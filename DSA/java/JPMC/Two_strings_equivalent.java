import java.util.HashMap;
import java.util.Map;

/*
Two strings word1 and word2 are considered almost equivalent if the differences between the frequencies of each letter from 'a' to 'z' between word1 and word2 is at most 3.

Given two strings word1 and word2, each of length n, return true if word1 and word2 are almost equivalent, or false otherwise.

The frequency of a letter x is the number of times it occurs in the string.


 */

class Solution {
    public boolean checkAlmostEquivalent(String word1, String word2) {
        Map<Character,Integer> map = new HashMap();
        for (int i = 0; i < word1.length(); i++) {
            map.put(word1.charAt(i), map.getOrDefault(word1.charAt(i), 0) + 1);
            map.put(word2.charAt(i), map.getOrDefault(word2.charAt(i), 0) - 1);
        }
        for (int i : map.values()) { //get value set
            if (i > 3 || i < -3) {
                return false;
            }
        }
        return true;
    }

}
