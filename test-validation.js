// Quick validation test script
import { 
  ValidationError, 
  validateFetchDataOptions, 
  validateArticleCode, 
  validateTableName,
  validateStringArray,
  validateNumber 
} from './dist-electron/validators/inputValidators.js';

console.log('🧪 Testing Validation System...\n');

// Test 1: Valid inputs
try {
  console.log('✅ Test 1: Valid fetch options');
  const validOptions = validateFetchDataOptions({ limit: 100, offset: 0, orderBy: 'ARTICLESCODE' });
  console.log('   Result:', validOptions);
} catch (error) {
  console.log('❌ Unexpected error:', error.message);
}

// Test 2: Invalid table name
try {
  console.log('\n❌ Test 2: Invalid table name (should fail)');
  validateTableName('DROP TABLE users;');
  console.log('   ERROR: Should have thrown validation error!');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('   ✅ Correctly caught validation error:', error.message);
  } else {
    console.log('   ❌ Unexpected error type:', error);
  }
}

// Test 3: SQL injection attempt in article code
try {
  console.log('\n❌ Test 3: SQL injection in article code (should fail)');
  validateArticleCode("'; DROP TABLE articles; --");
  console.log('   ERROR: Should have thrown validation error!');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('   ✅ Correctly caught validation error:', error.message);
  } else {
    console.log('   ❌ Unexpected error type:', error);
  }
}

// Test 4: Valid number validation
try {
  console.log('\n✅ Test 4: Valid number validation');
  const validNumber = validateNumber(500, 'limit', { min: 1, max: 1000, integer: true });
  console.log('   Result:', validNumber);
} catch (error) {
  console.log('❌ Unexpected error:', error.message);
}

// Test 5: Invalid number (too large)
try {
  console.log('\n❌ Test 5: Invalid number - too large (should fail)');
  validateNumber(50000, 'limit', { min: 1, max: 1000, integer: true });
  console.log('   ERROR: Should have thrown validation error!');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('   ✅ Correctly caught validation error:', error.message);
  } else {
    console.log('   ❌ Unexpected error type:', error);
  }
}

// Test 6: Valid table name that was failing
try {
  console.log('\n✅ Test 6: Valid table name - ArticlesDimUDF');
  const validTableName = validateTableName('ArticlesDimUDF');
  console.log('   Result:', validTableName);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('   ❌ Still failing:', error.message);
  } else {
    console.log('   ❌ Unexpected error type:', error);
  }
}

console.log('\n🎉 Validation system tests completed!');
