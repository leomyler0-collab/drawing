/**
 * VisibilityDB - Enterprise-Grade Visibility Management System
 * 
 * Robust, fault-tolerant database for managing drawing visibility states
 * with transaction support, data integrity validation, and comprehensive error recovery.
 * 
 * @author Elite Senior Software Engineer
 * @version 2.0.0
 * @license MIT
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface VisibilityRecord {
  drawingId: string;
  isPublic: boolean;
  updatedAt: string;
  updatedBy?: string;
  version: number;
  metadata?: {
    previousState?: boolean;
    changeReason?: string;
    ipAddress?: string;
  };
}

export interface VisibilityTransaction {
  id: string;
  drawingId: string;
  oldState: boolean;
  newState: boolean;
  timestamp: string;
  status: 'pending' | 'committed' | 'rolled_back';
  error?: string;
}

export interface VisibilityStats {
  totalDrawings: number;
  publicDrawings: number;
  privateDrawings: number;
  recentChanges: number;
  lastUpdate: string;
}

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class VisibilityDBError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'VisibilityDBError';
  }
}

export class TransactionError extends VisibilityDBError {
  constructor(message: string, details?: any) {
    super(message, 'TRANSACTION_ERROR', details);
    this.name = 'TransactionError';
  }
}

export class ValidationError extends VisibilityDBError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

// ============================================================================
// MAIN DATABASE CLASS
// ============================================================================

class VisibilityDatabase {
  private readonly STORAGE_KEY = 'spookysketch_visibility_v2';
  private readonly TRANSACTION_KEY = 'spookysketch_visibility_transactions';
  private readonly BACKUP_KEY = 'spookysketch_visibility_backup';
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY_MS = 100;
  
  private cache: Map<string, VisibilityRecord> = new Map();
  private initialized = false;

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  /**
   * Initialize the database and load data into memory cache
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🔧 [VisibilityDB] Initializing database...');
      
      // Load existing records
      await this.loadFromStorage();
      
      // Recover any pending transactions
      await this.recoverPendingTransactions();
      
      // Validate data integrity
      await this.validateIntegrity();
      
      this.initialized = true;
      console.log('✅ [VisibilityDB] Database initialized successfully');
      console.log(`📊 [VisibilityDB] Loaded ${this.cache.size} visibility records`);
    } catch (error) {
      console.error('❌ [VisibilityDB] Initialization failed:', error);
      throw new VisibilityDBError(
        'Failed to initialize visibility database',
        'INIT_ERROR',
        error
      );
    }
  }

  /**
   * Load data from localStorage into memory cache
   */
  private async loadFromStorage(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      
      if (!data) {
        console.log('ℹ️ [VisibilityDB] No existing data found, starting fresh');
        return;
      }

      const records: VisibilityRecord[] = JSON.parse(data);
      
      // Validate and load into cache
      for (const record of records) {
        if (this.validateRecord(record)) {
          this.cache.set(record.drawingId, record);
        } else {
          console.warn('⚠️ [VisibilityDB] Skipping invalid record:', record);
        }
      }

      console.log(`✅ [VisibilityDB] Loaded ${this.cache.size} records from storage`);
    } catch (error) {
      console.error('❌ [VisibilityDB] Failed to load from storage:', error);
      await this.attemptBackupRecovery();
    }
  }

  /**
   * Validate a visibility record
   */
  private validateRecord(record: any): record is VisibilityRecord {
    return (
      typeof record === 'object' &&
      typeof record.drawingId === 'string' &&
      typeof record.isPublic === 'boolean' &&
      typeof record.updatedAt === 'string' &&
      typeof record.version === 'number' &&
      record.drawingId.length > 0
    );
  }

  // ==========================================================================
  // CORE OPERATIONS
  // ==========================================================================

  /**
   * Set visibility for a drawing with transaction support
   */
  public async setVisibility(
    drawingId: string,
    isPublic: boolean,
    userId?: string
  ): Promise<VisibilityRecord> {
    await this.ensureInitialized();

    // Validate input
    if (!drawingId || typeof drawingId !== 'string') {
      throw new ValidationError('Invalid drawing ID', { drawingId });
    }

    if (typeof isPublic !== 'boolean') {
      throw new ValidationError('Invalid visibility state', { isPublic });
    }

    const transaction = this.createTransaction(drawingId, isPublic);

    try {
      console.log(`🔄 [VisibilityDB] Setting visibility for ${drawingId} to ${isPublic ? 'PUBLIC' : 'PRIVATE'}`);

      // Get existing record or create new
      const existingRecord = this.cache.get(drawingId);
      const oldState = existingRecord?.isPublic ?? false;

      // Create new record
      const newRecord: VisibilityRecord = {
        drawingId,
        isPublic,
        updatedAt: new Date().toISOString(),
        updatedBy: userId,
        version: (existingRecord?.version ?? 0) + 1,
        metadata: {
          previousState: oldState,
          changeReason: 'user_action',
        },
      };

      // Update cache
      this.cache.set(drawingId, newRecord);

      // Persist with retry logic
      await this.persistWithRetry();

      // Create backup
      await this.createBackup();

      // Commit transaction
      await this.commitTransaction(transaction.id);

      console.log(`✅ [VisibilityDB] Successfully updated visibility for ${drawingId}`);
      console.log(`📝 [VisibilityDB] State: ${oldState ? 'PUBLIC' : 'PRIVATE'} → ${isPublic ? 'PUBLIC' : 'PRIVATE'}`);

      return newRecord;
    } catch (error) {
      console.error(`❌ [VisibilityDB] Failed to set visibility for ${drawingId}:`, error);
      
      // Rollback transaction
      await this.rollbackTransaction(transaction.id, error);

      throw new TransactionError(
        `Failed to update visibility for drawing ${drawingId}`,
        { drawingId, isPublic, error }
      );
    }
  }

  /**
   * Get visibility status for a drawing
   */
  public async getVisibility(drawingId: string): Promise<VisibilityRecord | null> {
    await this.ensureInitialized();

    if (!drawingId) {
      throw new ValidationError('Drawing ID is required', { drawingId });
    }

    const record = this.cache.get(drawingId);
    
    if (record) {
      console.log(`📖 [VisibilityDB] Retrieved visibility for ${drawingId}: ${record.isPublic ? 'PUBLIC' : 'PRIVATE'}`);
    } else {
      console.log(`ℹ️ [VisibilityDB] No visibility record found for ${drawingId}, defaulting to PRIVATE`);
    }

    return record || null;
  }

  /**
   * Check if a drawing is public
   */
  public async isPublic(drawingId: string): Promise<boolean> {
    const record = await this.getVisibility(drawingId);
    return record?.isPublic ?? false;
  }

  /**
   * Toggle visibility state
   */
  public async toggleVisibility(
    drawingId: string,
    userId?: string
  ): Promise<VisibilityRecord> {
    const current = await this.getVisibility(drawingId);
    const newState = !(current?.isPublic ?? false);
    
    return await this.setVisibility(drawingId, newState, userId);
  }

  /**
   * Batch update multiple drawings
   */
  public async batchUpdate(
    updates: Array<{ drawingId: string; isPublic: boolean }>,
    userId?: string
  ): Promise<VisibilityRecord[]> {
    await this.ensureInitialized();

    console.log(`🔄 [VisibilityDB] Batch updating ${updates.length} drawings`);

    const results: VisibilityRecord[] = [];
    const errors: Array<{ drawingId: string; error: any }> = [];

    for (const update of updates) {
      try {
        const result = await this.setVisibility(update.drawingId, update.isPublic, userId);
        results.push(result);
      } catch (error) {
        errors.push({ drawingId: update.drawingId, error });
        console.error(`❌ [VisibilityDB] Failed to update ${update.drawingId}:`, error);
      }
    }

    if (errors.length > 0) {
      console.warn(`⚠️ [VisibilityDB] Batch update completed with ${errors.length} errors`);
    }

    console.log(`✅ [VisibilityDB] Batch update completed: ${results.length}/${updates.length} successful`);

    return results;
  }

  // ==========================================================================
  // PERSISTENCE
  // ==========================================================================

  /**
   * Persist cache to localStorage with retry logic
   */
  private async persistWithRetry(attempt: number = 1): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const records = Array.from(this.cache.values());
      const data = JSON.stringify(records);
      
      localStorage.setItem(this.STORAGE_KEY, data);
      
      console.log(`💾 [VisibilityDB] Persisted ${records.length} records to storage`);
    } catch (error) {
      console.error(`❌ [VisibilityDB] Persist attempt ${attempt} failed:`, error);

      if (attempt < this.MAX_RETRY_ATTEMPTS) {
        console.log(`🔄 [VisibilityDB] Retrying in ${this.RETRY_DELAY_MS}ms...`);
        await this.delay(this.RETRY_DELAY_MS);
        return await this.persistWithRetry(attempt + 1);
      }

      throw new VisibilityDBError(
        'Failed to persist data after multiple attempts',
        'PERSIST_ERROR',
        error
      );
    }
  }

  /**
   * Create a backup of current state
   */
  private async createBackup(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const records = Array.from(this.cache.values());
      const backup = {
        timestamp: new Date().toISOString(),
        recordCount: records.length,
        data: records,
      };

      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
      console.log(`💾 [VisibilityDB] Backup created successfully`);
    } catch (error) {
      console.warn('⚠️ [VisibilityDB] Failed to create backup:', error);
      // Non-critical error, don't throw
    }
  }

  /**
   * Attempt to recover from backup
   */
  private async attemptBackupRecovery(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      console.log('🔄 [VisibilityDB] Attempting backup recovery...');
      
      const backupData = localStorage.getItem(this.BACKUP_KEY);
      if (!backupData) {
        console.log('ℹ️ [VisibilityDB] No backup found');
        return;
      }

      const backup = JSON.parse(backupData);
      const records: VisibilityRecord[] = backup.data;

      for (const record of records) {
        if (this.validateRecord(record)) {
          this.cache.set(record.drawingId, record);
        }
      }

      console.log(`✅ [VisibilityDB] Recovered ${this.cache.size} records from backup`);
    } catch (error) {
      console.error('❌ [VisibilityDB] Backup recovery failed:', error);
    }
  }

  // ==========================================================================
  // TRANSACTION MANAGEMENT
  // ==========================================================================

  /**
   * Create a new transaction
   */
  private createTransaction(drawingId: string, newState: boolean): VisibilityTransaction {
    const existing = this.cache.get(drawingId);
    
    const transaction: VisibilityTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      drawingId,
      oldState: existing?.isPublic ?? false,
      newState,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    this.saveTransaction(transaction);
    return transaction;
  }

  /**
   * Commit a transaction
   */
  private async commitTransaction(transactionId: string): Promise<void> {
    try {
      const transactions = this.loadTransactions();
      const transaction = transactions.find(t => t.id === transactionId);
      
      if (transaction) {
        transaction.status = 'committed';
        this.saveTransactions(transactions);
      }
    } catch (error) {
      console.warn('⚠️ [VisibilityDB] Failed to commit transaction:', error);
    }
  }

  /**
   * Rollback a transaction
   */
  private async rollbackTransaction(transactionId: string, error: any): Promise<void> {
    try {
      const transactions = this.loadTransactions();
      const transaction = transactions.find(t => t.id === transactionId);
      
      if (transaction) {
        transaction.status = 'rolled_back';
        transaction.error = error?.message || 'Unknown error';
        this.saveTransactions(transactions);

        // Restore old state
        const existing = this.cache.get(transaction.drawingId);
        if (existing) {
          existing.isPublic = transaction.oldState;
          this.cache.set(transaction.drawingId, existing);
        }
      }
    } catch (err) {
      console.error('❌ [VisibilityDB] Failed to rollback transaction:', err);
    }
  }

  /**
   * Recover pending transactions
   */
  private async recoverPendingTransactions(): Promise<void> {
    try {
      const transactions = this.loadTransactions();
      const pending = transactions.filter(t => t.status === 'pending');

      if (pending.length > 0) {
        console.log(`🔄 [VisibilityDB] Found ${pending.length} pending transactions, rolling back...`);
        
        for (const transaction of pending) {
          await this.rollbackTransaction(transaction.id, new Error('Recovery rollback'));
        }
      }
    } catch (error) {
      console.warn('⚠️ [VisibilityDB] Failed to recover pending transactions:', error);
    }
  }

  /**
   * Save transaction to storage
   */
  private saveTransaction(transaction: VisibilityTransaction): void {
    const transactions = this.loadTransactions();
    transactions.push(transaction);
    this.saveTransactions(transactions);
  }

  /**
   * Load transactions from storage
   */
  private loadTransactions(): VisibilityTransaction[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(this.TRANSACTION_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Save transactions to storage
   */
  private saveTransactions(transactions: VisibilityTransaction[]): void {
    if (typeof window === 'undefined') return;

    try {
      // Keep only last 100 transactions
      const recent = transactions.slice(-100);
      localStorage.setItem(this.TRANSACTION_KEY, JSON.stringify(recent));
    } catch (error) {
      console.warn('⚠️ [VisibilityDB] Failed to save transactions:', error);
    }
  }

  // ==========================================================================
  // STATISTICS & REPORTING
  // ==========================================================================

  /**
   * Get visibility statistics
   */
  public async getStats(): Promise<VisibilityStats> {
    await this.ensureInitialized();

    const records = Array.from(this.cache.values());
    const publicCount = records.filter(r => r.isPublic).length;
    const recentChanges = records.filter(r => {
      const age = Date.now() - new Date(r.updatedAt).getTime();
      return age < 24 * 60 * 60 * 1000; // Last 24 hours
    }).length;

    const lastUpdate = records.length > 0
      ? records.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0].updatedAt
      : new Date().toISOString();

    return {
      totalDrawings: records.length,
      publicDrawings: publicCount,
      privateDrawings: records.length - publicCount,
      recentChanges,
      lastUpdate,
    };
  }

  /**
   * Export all data
   */
  public async exportData(): Promise<string> {
    await this.ensureInitialized();

    const data = {
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      recordCount: this.cache.size,
      records: Array.from(this.cache.values()),
      stats: await this.getStats(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data
   */
  public async importData(jsonData: string): Promise<number> {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.records || !Array.isArray(data.records)) {
        throw new ValidationError('Invalid import data format');
      }

      let imported = 0;
      for (const record of data.records) {
        if (this.validateRecord(record)) {
          this.cache.set(record.drawingId, record);
          imported++;
        }
      }

      await this.persistWithRetry();
      console.log(`✅ [VisibilityDB] Imported ${imported} records`);

      return imported;
    } catch (error) {
      throw new VisibilityDBError('Failed to import data', 'IMPORT_ERROR', error);
    }
  }

  // ==========================================================================
  // MAINTENANCE
  // ==========================================================================

  /**
   * Validate data integrity
   */
  private async validateIntegrity(): Promise<void> {
    console.log('🔍 [VisibilityDB] Validating data integrity...');

    let invalidCount = 0;
    const entries = Array.from(this.cache.entries());
    for (const [id, record] of entries) {
      if (!this.validateRecord(record) || record.drawingId !== id) {
        this.cache.delete(id);
        invalidCount++;
      }
    }

    if (invalidCount > 0) {
      console.warn(`⚠️ [VisibilityDB] Removed ${invalidCount} invalid records`);
      await this.persistWithRetry();
    } else {
      console.log('✅ [VisibilityDB] Data integrity validated');
    }
  }

  /**
   * Clear all data
   */
  public async clearAll(): Promise<void> {
    console.log('🗑️ [VisibilityDB] Clearing all data...');
    
    this.cache.clear();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.TRANSACTION_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
    }

    console.log('✅ [VisibilityDB] All data cleared');
  }

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  /**
   * Ensure database is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get database health status
   */
  public async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    message: string;
    details: any;
  }> {
    try {
      const stats = await this.getStats();
      const canWrite = await this.testWrite();

      return {
        status: canWrite ? 'healthy' : 'degraded',
        message: canWrite ? 'Database is operational' : 'Write operations failing',
        details: {
          initialized: this.initialized,
          cacheSize: this.cache.size,
          stats,
          canWrite,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Database is not functional',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  }

  /**
   * Test write capabilities
   */
  private async testWrite(): Promise<boolean> {
    try {
      const testId = '__test_write__';
      await this.setVisibility(testId, true);
      this.cache.delete(testId);
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const visibilityDB = new VisibilityDatabase();

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

if (typeof window !== 'undefined') {
  visibilityDB.initialize().catch(error => {
    console.error('❌ [VisibilityDB] Auto-initialization failed:', error);
  });
}

// ============================================================================
// EXPORT
// ============================================================================

export default visibilityDB;
