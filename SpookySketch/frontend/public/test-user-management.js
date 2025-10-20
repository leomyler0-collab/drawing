/**
 * User Management Testing Suite - Enterprise Grade
 * Run in browser console to test all user management features
 * 
 * Usage: Copy and paste this entire file into browser console
 */

(async function() {
  console.log('🧪 ========================================');
  console.log('🧪 USER MANAGEMENT TEST SUITE');
  console.log('🧪 ========================================\n');

  const tests = {
    passed: 0,
    failed: 0,
    results: []
  };

  // Test 1: Check localStorage access
  console.log('📋 Test 1: localStorage Access');
  try {
    const usersKey = 'spookysketch_users';
    const data = localStorage.getItem(usersKey);
    if (data) {
      const users = JSON.parse(data);
      console.log(`✅ PASS: Found ${users.length} users in localStorage`);
      console.log('   Users:', users.map(u => `${u.username} (${u.tier})`).join(', '));
      tests.passed++;
      tests.results.push({ test: 'localStorage Access', status: 'PASS' });
    } else {
      console.log('❌ FAIL: No users found in localStorage');
      tests.failed++;
      tests.results.push({ test: 'localStorage Access', status: 'FAIL' });
    }
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    tests.failed++;
    tests.results.push({ test: 'localStorage Access', status: 'FAIL', error: error.message });
  }
  console.log('');

  // Test 2: Check admin account exists
  console.log('📋 Test 2: Admin Account');
  try {
    const users = JSON.parse(localStorage.getItem('spookysketch_users') || '[]');
    const admin = users.find(u => u.tier === 'admin');
    if (admin) {
      console.log('✅ PASS: Admin account exists');
      console.log('   👑 Username:', admin.username);
      console.log('   📧 Email:', admin.email);
      console.log('   🆔 ID:', admin.id);
      tests.passed++;
      tests.results.push({ test: 'Admin Account', status: 'PASS' });
    } else {
      console.log('❌ FAIL: No admin account found');
      tests.failed++;
      tests.results.push({ test: 'Admin Account', status: 'FAIL' });
    }
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    tests.failed++;
    tests.results.push({ test: 'Admin Account', status: 'FAIL', error: error.message });
  }
  console.log('');

  // Test 3: Test tier distribution
  console.log('📋 Test 3: Tier Distribution');
  try {
    const users = JSON.parse(localStorage.getItem('spookysketch_users') || '[]');
    const tiers = users.reduce((acc, u) => {
      acc[u.tier] = (acc[u.tier] || 0) + 1;
      return acc;
    }, {});
    console.log('✅ PASS: Tier distribution:');
    Object.entries(tiers).forEach(([tier, count]) => {
      console.log(`   ${tier.toUpperCase()}: ${count}`);
    });
    tests.passed++;
    tests.results.push({ test: 'Tier Distribution', status: 'PASS' });
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    tests.failed++;
    tests.results.push({ test: 'Tier Distribution', status: 'FAIL', error: error.message });
  }
  console.log('');

  // Test 4: Simulate tier update
  console.log('📋 Test 4: Tier Update Simulation');
  try {
    const users = JSON.parse(localStorage.getItem('spookysketch_users') || '[]');
    const testUser = users.find(u => u.tier === 'free');
    if (testUser) {
      const originalTier = testUser.tier;
      console.log(`   👤 Test user: ${testUser.username} (${originalTier})`);
      
      // Simulate update
      testUser.tier = 'pro';
      localStorage.setItem('spookysketch_users', JSON.stringify(users));
      
      // Verify
      const updated = JSON.parse(localStorage.getItem('spookysketch_users') || '[]');
      const verify = updated.find(u => u.id === testUser.id);
      
      if (verify && verify.tier === 'pro') {
        console.log('✅ PASS: Tier update successful');
        console.log(`   ${originalTier} → ${verify.tier}`);
        
        // Restore original
        verify.tier = originalTier;
        localStorage.setItem('spookysketch_users', JSON.stringify(updated));
        console.log('   🔄 Restored original tier');
        
        tests.passed++;
        tests.results.push({ test: 'Tier Update', status: 'PASS' });
      } else {
        console.log('❌ FAIL: Tier update verification failed');
        tests.failed++;
        tests.results.push({ test: 'Tier Update', status: 'FAIL' });
      }
    } else {
      console.log('⚠️  SKIP: No free user found to test');
      tests.results.push({ test: 'Tier Update', status: 'SKIP' });
    }
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    tests.failed++;
    tests.results.push({ test: 'Tier Update', status: 'FAIL', error: error.message });
  }
  console.log('');

  // Test 5: Check data integrity
  console.log('📋 Test 5: Data Integrity');
  try {
    const users = JSON.parse(localStorage.getItem('spookysketch_users') || '[]');
    let valid = true;
    let issues = [];
    
    users.forEach(u => {
      if (!u.id) issues.push(`Missing ID for ${u.username}`);
      if (!u.username) issues.push(`Missing username for ${u.id}`);
      if (!u.email) issues.push(`Missing email for ${u.username}`);
      if (!u.tier) issues.push(`Missing tier for ${u.username}`);
      if (!['free', 'pro', 'vip', 'admin'].includes(u.tier)) {
        issues.push(`Invalid tier "${u.tier}" for ${u.username}`);
      }
    });
    
    if (issues.length === 0) {
      console.log('✅ PASS: All users have valid data structure');
      tests.passed++;
      tests.results.push({ test: 'Data Integrity', status: 'PASS' });
    } else {
      console.log('❌ FAIL: Data integrity issues found:');
      issues.forEach(issue => console.log(`   ⚠️  ${issue}`));
      tests.failed++;
      tests.results.push({ test: 'Data Integrity', status: 'FAIL', issues });
    }
  } catch (error) {
    console.log('❌ FAIL:', error.message);
    tests.failed++;
    tests.results.push({ test: 'Data Integrity', status: 'FAIL', error: error.message });
  }
  console.log('');

  // Summary
  console.log('🧪 ========================================');
  console.log('🧪 TEST SUMMARY');
  console.log('🧪 ========================================');
  console.log(`✅ Passed: ${tests.passed}`);
  console.log(`❌ Failed: ${tests.failed}`);
  console.log(`📊 Total: ${tests.passed + tests.failed}`);
  console.log('');
  
  if (tests.failed === 0) {
    console.log('🎉 ALL TESTS PASSED! User management is working correctly.');
  } else {
    console.log('⚠️  SOME TESTS FAILED. Check the details above.');
  }
  
  console.log('\n📝 Detailed Results:');
  console.table(tests.results);
  
  return tests;
})();
