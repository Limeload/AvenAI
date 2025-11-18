/*
You are given two strings of the same length s and t. In one step you can choose any character of t and replace it with another character.

Return the minimum number of steps to make t an anagram of s.

An Anagram of a string is a string that contains the same characters with a different (or the same) ordering.
 */



package Leetcode;

class Solution {
    public int minSteps(String s, String t) {
        if (s.length() != t.length()) {
        return -1;
    }

    int[] count = new int[26];
    for (char c : s.toCharArray()) {
        count[c - 'a']++;
    }

    for (char c : t.toCharArray()) {
        count[c - 'a']--;
    }

    int minSteps = 0;
    for (int i = 0; i < 26; i++) {
        if (count[i] > 0) {
            minSteps += count[i];
        }
    }

    return minSteps;
    }
}
