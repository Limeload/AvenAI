// 1002. Find Common Characters
// Easy
// Topics
// conpanies icon
// Companies
// Given a string array words, return an array of all characters that show up in all strings within the words (including duplicates). You may return the answer in any order.

 

// Example 1:

// Input: words = ["bella","label","roller"]
// Output: ["e","l","l"]
// Example 2:

// Input: words = ["cool","lock","cook"]
// Output: ["c","o"]
 

// Constraints:

// 1 <= words.length <= 100
// 1 <= words[i].length <= 100
// words[i] consists of lowercase English letters.

import java.util.*;

class Solution {
    public List<String> commonChars(String[] words) {
        // Count frequency of each character in the first word
        int[] minFreq = new int[26];
        Arrays.fill(minFreq, Integer.MAX_VALUE);
        
        for (String word : words) {
            int[] charCount = new int[26];
            // Count characters in current word
            for (char c : word.toCharArray()) {
                charCount[c - 'a']++;
            }
            // Update minimum frequency for each character
            for (int i = 0; i < 26; i++) {
                minFreq[i] = Math.min(minFreq[i], charCount[i]);
            }
        }
        
        // Build result list
        List<String> result = new ArrayList<>();
        for (int i = 0; i < 26; i++) {
            for (int j = 0; j < minFreq[i]; j++) {
                result.add(String.valueOf((char)('a' + i)));
            }
        }
        
        return result;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        // Example 1
        String[] words1 = {"bella","label","roller"};
        System.out.println(sol.commonChars(words1)); // Expected: ["e","l","l"]
        
        // Example 2
        String[] words2 = {"cool","lock","cook"};
        System.out.println(sol.commonChars(words2)); // Expected: ["c","o"]
    }
}
