package Leetcode;

/*
The beauty of a string is the difference in frequencies between the most frequent and least frequent characters.

For example, the beauty of "abaacc" is 3 - 1 = 2.
Given a string s, return the sum of beauty of all of its substrings.

 */

class Solution {
    public int beautySum(String s) {
        int length = s.length();
        int totalBeauty = 0;

        // Iterate through all possible substrings
        for (int i = 0; i < length; i++) {
            // Initialize an array to store character frequencies for the current substring
            int[] charFreq = new int[26]; // Assuming lowercase English letters

            for (int j = i; j < length; j++) {
                // Update the character frequency array based on characters in the substring
                charFreq[s.charAt(j) - 'a']++;

                // Calculate the beauty of the current substring and add it to the total beauty
                totalBeauty += calculateBeauty(charFreq);
            }
        }

        // Return the total sum of beauty for all substrings
        return totalBeauty;
    }

    public static int calculateBeauty(int[] charFreq) {
        int minFreq = Integer.MAX_VALUE;
        int maxFreq = 0;

        // Iterate through the character frequency array
        for (int freq : charFreq) {
            if (freq > maxFreq) {
                maxFreq = freq;
            }
            if (freq > 0 && freq < minFreq) {
                minFreq = freq;
            }
        }

        // Calculate and return the beauty of the substring
        return maxFreq - minFreq;
    }
}
