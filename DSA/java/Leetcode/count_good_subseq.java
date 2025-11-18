package Leetcode;

import java.util.Arrays;

/*
A subsequence of a string is good if it is not empty and the frequency of each one of its characters is the same.

Given a string s, return the number of good subsequences of s. Since the answer may be too large, return it modulo 109 + 7.

A subsequence is a string that can be derived from another string by deleting some or no characters without changing the order of the remaining characters.


 */

class Solution {
    public int countGoodSubsequences(String s) {
        final int mod = 1_000_000_007;
        int[] freq = new int[26];
        for (var ch : s.toCharArray()) ++freq[ch-'a'];
        long[] coef = new long[26], inv = new long[s.length()+1];
        Arrays.fill(coef, 1);
        inv[0] = inv[1] = 1;
        long ans = 0;
        for (int x = 1; x <= s.length(); ++x) {
            long val = 1;
            if (x >= 2) inv[x] = mod - mod/x * inv[mod%x] % mod;
            for (int i = 0; i < 26; ++i) {
                coef[i] = coef[i] * (freq[i]-x+1) % mod;
                coef[i] = coef[i] * inv[x] % mod;
                val = val * (1+coef[i]) % mod;
            }
            ans = (ans + val - 1) % mod;
        }
        return (int) ans; 
    }
}
