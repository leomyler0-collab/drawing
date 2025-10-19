/**
 * Visibility Handler - Shared robust visibility toggle logic
 * 
 * 3-Tier bulletproof system for updating drawing visibility
 * @author Elite Senior Software Engineer
 */

import { drawingAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { localDB } from '@/utils/localStorageDB';
import visibilityDB from '@/utils/visibilityDB';

export interface VisibilityHandlerOptions {
  drawingId: string;
  currentStatus: boolean;
  userId?: string;
  onSuccess?: () => void;
  source?: string; // For logging: 'Admin', 'VIP', 'Pro', 'Free'
}

/**
 * Handle visibility toggle with 3-tier fallback system
 * 
 * Tier 1: Backend API
 * Tier 2: Enterprise Visibility DB
 * Tier 3: Direct LocalStorage
 */
export async function handleVisibilityToggle(
  options: VisibilityHandlerOptions
): Promise<boolean> {
  const { drawingId, currentStatus, userId, onSuccess, source = 'User' } = options;
  const newStatus = !currentStatus;
  const statusText = newStatus ? 'PUBLIC' : 'PRIVATE';
  
  // Show loading indicator
  const loadingToast = toast.loading(`Updating visibility...`);
  
  try {
    // ========================================================================
    // TIER 1: Try Backend API
    // ========================================================================
    console.log(`🔄 [${source}] TIER 1: Attempting backend API for ${drawingId}`);
    
    await drawingAPI.toggleVisibility(drawingId, newStatus);
    
    // Sync with visibility DB for consistency
    await visibilityDB.setVisibility(drawingId, newStatus, userId);
    
    toast.dismiss(loadingToast);
    toast.success(`🎉 Drawing is now ${statusText}!`, { duration: 3000 });
    
    if (onSuccess) onSuccess();
    
    console.log(`✅ [${source}] TIER 1: Backend update successful`);
    return true;
    
  } catch (backendError) {
    console.warn(`⚠️ [${source}] TIER 1 failed, trying TIER 2:`, backendError);
    
    try {
      // ======================================================================
      // TIER 2: Enterprise Visibility Database
      // ======================================================================
      console.log(`🔄 [${source}] TIER 2: Using visibility database`);
      
      const result = await visibilityDB.setVisibility(drawingId, newStatus, userId);
      
      if (!result) {
        throw new Error('Visibility DB returned null');
      }
      
      // Sync with localStorage for complete consistency
      localDB.toggleVisibility(drawingId, newStatus);
      
      toast.dismiss(loadingToast);
      toast.success(`🎉 Drawing is now ${statusText}!`, { 
        duration: 3000,
        icon: '💾'
      });
      
      if (onSuccess) onSuccess();
      
      console.log(`✅ [${source}] TIER 2: Visibility DB successful`);
      console.log(`📊 [${source}] State: ${!newStatus ? 'PRIVATE' : 'PUBLIC'} → ${statusText}`);
      return true;
      
    } catch (visibilityError) {
      console.error(`❌ [${source}] TIER 2 failed, trying TIER 3:`, visibilityError);
      
      try {
        // ====================================================================
        // TIER 3: Direct LocalStorage Fallback
        // ====================================================================
        console.log(`🔄 [${source}] TIER 3: Using direct localStorage`);
        
        const localResult = localDB.toggleVisibility(drawingId, newStatus);
        
        if (!localResult) {
          throw new Error('Drawing not found in localStorage');
        }
        
        toast.dismiss(loadingToast);
        toast.success(`✅ Drawing is now ${statusText}!`, { duration: 2000 });
        
        if (onSuccess) onSuccess();
        
        console.log(`✅ [${source}] TIER 3: localStorage successful`);
        return true;
        
      } catch (finalError) {
        // ====================================================================
        // ALL TIERS FAILED
        // ====================================================================
        console.error(`❌ [${source}] ALL TIERS FAILED:`, finalError);
        
        toast.dismiss(loadingToast);
        
        const errorMessage = finalError instanceof Error 
          ? finalError.message 
          : 'Failed to update visibility';
        
        toast.error(`Failed: ${errorMessage}. Please try again.`, { 
          duration: 4000 
        });
        
        return false;
      }
    }
  }
}

/**
 * Get current visibility status with fallbacks
 */
export async function getVisibilityStatus(drawingId: string): Promise<boolean> {
  try {
    const record = await visibilityDB.getVisibility(drawingId);
    return record?.isPublic ?? false;
  } catch {
    // Fallback to localStorage
    const drawing = localDB.getDrawing(drawingId);
    return drawing?.isPublic ?? false;
  }
}

/**
 * Batch update visibility for multiple drawings
 */
export async function batchUpdateVisibility(
  updates: Array<{ drawingId: string; isPublic: boolean }>,
  userId?: string
): Promise<{ success: number; failed: number }> {
  const results = { success: 0, failed: 0 };
  
  for (const update of updates) {
    const success = await handleVisibilityToggle({
      drawingId: update.drawingId,
      currentStatus: !update.isPublic, // Toggle to desired state
      userId,
      source: 'Batch',
    });
    
    if (success) {
      results.success++;
    } else {
      results.failed++;
    }
  }
  
  return results;
}

export default handleVisibilityToggle;
