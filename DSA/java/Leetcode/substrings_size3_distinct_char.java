/*
A string is good if there are no repeated characters.

Given a string s​​​​​, return the number of good substrings of length three in s​​​​​​.

Note that if there are multiple occurrences of the same substring, every occurrence should be counted.

A substring is a contiguous sequence of characters in a string.

 */

package Leetcode;

import java.util.LinkedHashSet;

class Solution {
    public int countGoodSubstrings(String s) {
        int count = 0;
        LinkedHashSet<Character> set = new LinkedHashSet<>();
        for (int i = 0; i < s.length(); i++) {
            if (set.size() != 3) {
                while (!set.add(s.charAt(i))) {
                    set.remove(set.iterator().next());
                }
            }
            else {
                count++;
                set.remove(set.iterator().next());
                while (!set.add(s.charAt(i))) {
                    set.remove(set.iterator().next());
                }
            }
        }
        if (set.size() == 3) {
            count++;
        }
        return count;
    }
}
