// 1208. Get Equal Substrings Within Budget
// Medium
// Topics
// conpanies icon
// Companies
// Hint
// You are given two strings s and t of the same length and an integer maxCost.

// You want to change s to t. Changing the ith character of s to ith character of t costs |s[i] - t[i]| (i.e., the absolute difference between the ASCII values of the characters).

// Return the maximum length of a substring of s that can be changed to be the same as the corresponding substring of t with a cost less than or equal to maxCost. If there is no substring from s that can be changed to its corresponding substring from t, return 0.

 

// Example 1:

// Input: s = "abcd", t = "bcdf", maxCost = 3
// Output: 3
// Explanation: "abc" of s can change to "bcd".
// That costs 3, so the maximum length is 3.
// Example 2:

// Input: s = "abcd", t = "cdef", maxCost = 3
// Output: 1
// Explanation: Each character in s costs 2 to change to character in t,  so the maximum length is 1.
// Example 3:

// Input: s = "abcd", t = "acde", maxCost = 0
// Output: 1
// Explanation: You cannot make any change, so the maximum length is 1.
 

// Constraints:

// 1 <= s.length <= 105
// t.length == s.length
// 0 <= maxCost <= 106
// s and t consist of only lowercase English letters.

class Solution {
    public int equalSubstring(String s, String t, int maxCost) {
        int n = s.length();
        int left = 0;
        int currentCost = 0;
        int maxLength = 0;
        
        // Use sliding window to find the longest substring with cost <= maxCost
        for (int right = 0; right < n; right++) {
            // Calculate cost for current character
            int cost = Math.abs(s.charAt(right) - t.charAt(right));
            currentCost += cost;
            
            // If current cost exceeds maxCost, shrink window from left
            while (currentCost > maxCost) {
                int leftCost = Math.abs(s.charAt(left) - t.charAt(left));
                currentCost -= leftCost;
                left++;
            }
            
            // Update maximum length
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        // Example 1
        String s1 = "abcd";
        String t1 = "bcdf";
        int maxCost1 = 3;
        System.out.println(sol.equalSubstring(s1, t1, maxCost1)); // Expected: 3
        
        // Example 2
        String s2 = "abcd";
        String t2 = "cdef";
        int maxCost2 = 3;
        System.out.println(sol.equalSubstring(s2, t2, maxCost2)); // Expected: 1
        
        // Example 3
        String s3 = "abcd";
        String t3 = "acde";
        int maxCost3 = 0;
        System.out.println(sol.equalSubstring(s3, t3, maxCost3)); // Expected: 1
    }
}