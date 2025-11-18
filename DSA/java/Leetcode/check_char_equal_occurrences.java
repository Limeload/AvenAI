/*

Given a string s, return true if s is a good string, or false otherwise.

A string s is good if all the characters that appear in s have the same number of occurrences (i.e., the same frequency).

 */


package Leetcode;

import java.util.HashMap;

class Solution {
    public boolean areOccurrencesEqual(String s) {
        // Create a hash table to store the frequency of each character
        HashMap<Character, Integer> charCounts = new HashMap<>();

        // Iterate through the string and update the character counts
        for (char c : s.toCharArray()) {
            int count = charCounts.getOrDefault(c, 0) + 1;
            charCounts.put(c, count);
        }

        // Check if all characters have the same frequency
        int expectedFrequency = -1; // Initialize the expected frequency
        for (int count : charCounts.values()) {
            if (expectedFrequency == -1) {
                expectedFrequency = count;
            } else if (expectedFrequency != count) {
                return false; // Not a good string
            }
        }

        return true; // All characters have the same frequency
    }
}
