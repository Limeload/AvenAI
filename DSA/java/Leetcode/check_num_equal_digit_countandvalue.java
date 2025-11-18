/*
 You are given a 0-indexed string num of length n consisting of digits.

Return true if for every index i in the range 0 <= i < n, the digit i occurs num[i] times in num, otherwise return false.
 */


package Leetcode;

class Solution {
    public boolean digitCount(String num) {
        // Create an array to store the frequency of each digit
        int[] counts = new int[10];

        // Count the occurrences of each digit
        for (char c : num.toCharArray()) {
            counts[c - '0']++;
        }

        // Check if each digit occurs num[i] times
        for (int i = 0; i < 10; i++) {
            if (i < num.length() && counts[i] != num.charAt(i) - '0') {
                return false;
            }
        }

        return true;
    }
}
