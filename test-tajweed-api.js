// Simple test script to verify Tajweed API functions
import { fetchAllTajweedRules, fetchSpecificTajweedRule } from './src/api/apifunction.js';

async function testTajweedAPI() {
try {
    // Test fetching all rules
const allRules = await fetchAllTajweedRules();
if (Array.isArray(allRules) && allRules.length > 0) {
// Test fetching specific rule
      const firstRuleWithSubRules = allRules.find(rule => rule.Hassub === 1);
      if (firstRuleWithSubRules) {
const subRules = await fetchSpecificTajweedRule(firstRuleWithSubRules.RuleNo);
if (Array.isArray(subRules) && subRules.length > 0) {
// Check for examples
          const subRuleWithExamples = subRules.find(subRule => subRule.Examples && subRule.Examples.trim() !== '');
          if (subRuleWithExamples) {
}
        }
      }
    }
    
} catch (error) {
    console.error('❌ Tajweed API test failed:', error);
  }
}

testTajweedAPI();