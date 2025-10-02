// Simple test script to verify Tajweed API functions
import { fetchAllTajweedRules, fetchSpecificTajweedRule } from './src/api/apifunction.js';

async function testTajweedAPI() {
  console.log('Testing Tajweed API...');
  
  try {
    // Test fetching all rules
    console.log('\n1. Fetching all Tajweed rules...');
    const allRules = await fetchAllTajweedRules();
    console.log('All rules response:', allRules);
    console.log('Number of rules:', allRules?.length || 'Not an array');
    
    if (Array.isArray(allRules) && allRules.length > 0) {
      console.log('First rule:', allRules[0]);
      
      // Test fetching specific rule
      const firstRuleWithSubRules = allRules.find(rule => rule.Hassub === 1);
      if (firstRuleWithSubRules) {
        console.log(`\n2. Fetching sub-rules for rule ${firstRuleWithSubRules.RuleNo}...`);
        const subRules = await fetchSpecificTajweedRule(firstRuleWithSubRules.RuleNo);
        console.log('Sub-rules response:', subRules);
        console.log('Number of sub-rules:', subRules?.length || 'Not an array');
        
        if (Array.isArray(subRules) && subRules.length > 0) {
          console.log('First sub-rule:', subRules[0]);
          
          // Check for examples
          const subRuleWithExamples = subRules.find(subRule => subRule.Examples && subRule.Examples.trim() !== '');
          if (subRuleWithExamples) {
            console.log('Sub-rule with examples:', {
              rule: subRuleWithExamples.Rule,
              examples: subRuleWithExamples.Examples
            });
          }
        }
      }
    }
    
    console.log('\n✅ Tajweed API test completed successfully!');
  } catch (error) {
    console.error('❌ Tajweed API test failed:', error);
  }
}

testTajweedAPI();