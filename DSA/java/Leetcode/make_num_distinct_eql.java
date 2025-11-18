package Leetcode;

import java.util.HashMap;
import java.util.Map;

/*
You are given two 0-indexed strings word1 and word2.

A move consists of choosing two indices i and j such that 0 <= i < word1.length and 0 <= j < word2.length and swapping word1[i] with word2[j].

Return true if it is possible to get the number of distinct characters in word1 and word2 to be equal with exactly one move. Return false otherwise.

 */

class Solution {
    public boolean isItPossible(String word1, String word2) {
      Map<Character, Integer> mp1 = new HashMap<>();
        Map<Character, Integer> mp2 = new HashMap<>();

        for (char w1: word1.toCharArray()) {   // store freq of chars in word1 in mp1
            mp1.put(w1, mp1.getOrDefault(w1, 0) + 1);
        }
        for (char w2: word2.toCharArray()) {   // store freq of chars in word2 in mp2
            mp2.put(w2, mp2.getOrDefault(w2, 0) + 1);
        }


        for(char c1='a'; c1<='z'; c1++){
            for(char c2='a'; c2<='z'; c2++){

                if(!mp1.containsKey(c1) || !mp2.containsKey(c2)) continue;  // if any of the char is not present then skip

                insertAndRemove(mp1, c2, c1); // insert c2 to word1 and remove c1 from word1
                insertAndRemove(mp2, c1, c2); // insert c1 to word2 and remove c2 from word2

                if(mp1.size()==mp2.size()) return true;  // if size of both maps are equal then possible return true

                // reset back the maps
                insertAndRemove(mp1, c1, c2); // insert c1 back to word1 and remove c2 from word1
                insertAndRemove(mp2, c2, c1); // insert c2 back to word2 and remove c1 from word2
            }
        }

        return false;
    }
 public void insertAndRemove(Map<Character, Integer> mp, char toInsert, char toRemove){  // made this helper fxn for easy removal from hashmap
        mp.put(toInsert, mp.getOrDefault(toInsert, 0) + 1); // increment freq for char to be inserted
        mp.put(toRemove, mp.getOrDefault(toRemove, 0) - 1); // decrement freq for char to be removed
        if(mp.get(toRemove)==0) mp.remove(toRemove); // if freq of that char reaches zero, then remove the key from hashmap

    }

}
