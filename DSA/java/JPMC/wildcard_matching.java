/*
Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:

'?' Matches any single character.
'*' Matches any sequence of characters (including the empty sequence).
The matching should cover the entire input string (not partial).


 */

class Solution {
    public boolean isMatch(String s, String p) {
        int sIndex = 0;
        int pIndex = 0;
        int starIndex = -1; // index of the last seen '*'
        int sMatchIndex = 0; // index of the last matched character in s

        while (sIndex < s.length()) {
            if (pIndex < p.length() && (p.charAt(pIndex) == '?' || s.charAt(sIndex) == p.charAt(pIndex))) {
                sIndex++;
                pIndex++;
            } else if (pIndex < p.length() && p.charAt(pIndex) == '*') {
                starIndex = pIndex;
                sMatchIndex = sIndex;
                pIndex++;
            } else if (starIndex != -1) {
                // backtrack and try matching further characters in s
                pIndex = starIndex + 1;
                sMatchIndex++;
                sIndex = sMatchIndex;
            } else {
                return false;
            }
        }

        // check for remaining characters in p
        for (int i = pIndex; i < p.length(); i++) {
            if (p.charAt(i) != '*') {
                return false;
            }
        }

        return true;
    }
}
