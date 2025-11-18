package Leetcode;

/*
You are given two strings a and b that consist of lowercase letters. In one operation, you can change any character in a or b to any lowercase letter.

Your goal is to satisfy one of the following three conditions:

Every letter in a is strictly less than every letter in b in the alphabet.
Every letter in b is strictly less than every letter in a in the alphabet.
Both a and b consist of only one distinct letter.
Return the minimum number of operations needed to achieve your goal.
 */

class Solution {
    public int minCharacters(String a, String b) {
        int[][] countAndPrefixA = getCountAndPrefix(a);
        int[][] countAndPrefixB = getCountAndPrefix(b);
        int min = makeOnlyOneDistinct(countAndPrefixA[0], countAndPrefixB[0], countAndPrefixA[1][25] + countAndPrefixB[1][25]);
        if (min > 0) {
            min = Math.min(min, makeLessThan(countAndPrefixA[1], countAndPrefixB[1]));
        }
        if (min > 0) {
            min = Math.min(min, makeLessThan(countAndPrefixB[1], countAndPrefixA[1]));
        }
        return min;
    }

    private int makeOnlyOneDistinct(int[] countA, int[] countB, int total) {
        int min = Integer.MAX_VALUE;
        for (int i = 0; i < countA.length; i++) {
            min = Math.min(min, total - (countA[i] + countB[i]));
        }
        return min;
    }

    private int makeLessThan(int[] prefixA, int[] prefixB) {
        int min = Integer.MAX_VALUE;
        int removeFromA, removeFromB;
        for (int i = 24; i >= 0; i--) {
            removeFromA = prefixA[25] - prefixA[i];
            removeFromB = prefixB[i];
            min = Math.min(min, removeFromA + removeFromB);
        }
        return min;
    }

    private int[][] getCountAndPrefix(String str) {
        int[][] countAndPrefix = new int[2][26];
        for (int i = 0; i < str.length(); i++) {
            countAndPrefix[0][str.charAt(i) - 'a']++;
        }
        int prefix = 0;
        for (int i = 0; i < countAndPrefix[0].length; i++) {
            prefix += countAndPrefix[0][i];
            countAndPrefix[1][i] = prefix;
        }
        return countAndPrefix;
    }
}
