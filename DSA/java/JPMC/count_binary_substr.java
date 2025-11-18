/*
696. Count Binary Substrings
Easy
Topics
conpanies icon
Companies
Hint
Given a binary string s, return the number of non-empty substrings that have the same number of 0's and 1's, and all the 0's and all the 1's in these substrings are grouped consecutively.

Substrings that occur multiple times are counted the number of times they occur.

 

Example 1:

Input: s = "00110011"
Output: 6
Explanation: There are 6 substrings that have equal number of consecutive 1's and 0's: "0011", "01", "1100", "10", "0011", and "01".
Notice that some of these substrings repeat and are counted the number of times they occur.
Also, "00110011" is not a valid substring because all the 0's (and 1's) are not grouped together.
Example 2:

Input: s = "10101"
Output: 4
Explanation: There are 4 substrings: "10", "01", "10", "01" that have equal number of consecutive 1's and 0's.
 

Constraints:

1 <= s.length <= 105
s[i] is either '0' or '1'.
*/

import java.util.*;

public class count_binary_substr {
    public int countBinarySubstrings(String s) {
        int n = s.length();
        int result = 0;
        int prev = 0;  // length of previous group
        int curr = 1;  // length of current group
        
        for (int i = 1; i < n; i++) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                curr++;
            } else {
                // When we encounter a different character, we've finished a group
                // The number of valid substrings between prev and curr is min(prev, curr)
                result += Math.min(prev, curr);
                prev = curr;
                curr = 1;
            }
        }
        
        // Don't forget the last pair
        result += Math.min(prev, curr);
        
        return result;
    }
    
    public static void main(String[] args) {
        count_binary_substr solution = new count_binary_substr();
        
        // Test case 1
        String s1 = "00110011";
        System.out.println("Input: " + s1);
        System.out.println("Output: " + solution.countBinarySubstrings(s1)); // Expected: 6
        
        // Test case 2
        String s2 = "10101";
        System.out.println("\nInput: " + s2);
        System.out.println("Output: " + solution.countBinarySubstrings(s2)); // Expected: 4
    }
}
