package Leetcode;

import java.util.HashMap;
import java.util.Map;

/*
You are given a string s containing one or more words. Every consecutive pair of words is separated by a single space ' '.

A string t is an anagram of string s if the ith word of t is a permutation of the ith word of s.

For example, "acb dfe" is an anagram of "abc def", but "def cab" and "adc bef" are not.
Return the number of distinct anagrams of s. Since the answer may be very large, return it modulo 10^9 + 7.


 */

class Solution {
    public int countAnagrams(String s) {
         final int mod = (int) 1e9 + 7;
        long ans = 1;
        int n = s.length();
        int totalChars = 0;
        Map<Character, Integer> freqMap = new HashMap<>();

        for (int i = 0; i < n; i++) {
            if (s.charAt(i) == ' ' || i == n - 1) {
                if (i == n - 1) {
                    freqMap.put(s.charAt(i), freqMap.getOrDefault(s.charAt(i), 0) + 1);
                    totalChars++;
                }

                long t = 1;
                for (int freq : freqMap.values()) {
                    t = (t * factorial(freq, mod)) % mod;
                }

                ans = (ans * factorial(totalChars, mod)) % mod;
                ans = (ans * modularInverse(t, mod)) % mod;

                totalChars = 0;
                freqMap.clear();
            } else {
                freqMap.put(s.charAt(i), freqMap.getOrDefault(s.charAt(i), 0) + 1);
                totalChars++;
            }
        }

        return (int) ans;
    }

    private int factorial(int n, int mod) {
        long fact = 1;
        for (int i = 2; i <= n; i++) {
            fact = (fact * i) % mod;
        }
        return (int) fact;
    }

    private int modularInverse(long a, int mod) {
        int b = mod - 2;
        int result = 1;

        while (b > 0) {
            if ((b & 1) == 1) {
                result = (int) ((result * a) % mod);
            }
            a = (a * a) % mod;
            b >>= 1;
        }

        return result;
    }
}
