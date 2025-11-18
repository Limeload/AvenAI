/*
 Given a string s consisting of lowercase English letters, return the first letter to appear twice.

Note:

A letter a appears twice before another letter b if the second occurrence of a is before the second occurrence of b.
s will contain at least one letter that appears twice.

 */

package Leetcode;

import java.util.HashSet;
import java.util.Set;

class Solution {
    public char repeatedCharacter(String s) {
        Set<Character> seenChars = new HashSet<>();
        for (char c : s.toCharArray()) {
            if (seenChars.contains(c)) {
                return c;
            }
            seenChars.add(c);
        }
        return ' '; // Should never reach this point
    }
}

