package Leetcode;

import java.util.HashMap;
import java.util.PriorityQueue;

/*
Given a string s, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.

Return the sorted string. If there are multiple answers, return any of them.

Example 1:

Input: s = "tree"
Output: "eert"
Explanation: 'e' appears twice while 'r' and 't' both appear once.
So 'e' must appear before both 'r' and 't'. Therefore "eetr" is also a valid answer.
Example 2:

Input: s = "cccaaa"
Output: "aaaccc"
Explanation: Both 'c' and 'a' appear three times, so both "cccaaa" and "aaaccc" are valid answers.
Note that "cacaca" is incorrect, as the same characters must be together.
Example 3:

Input: s = "Aabb"
Output: "bbAa"
Explanation: "bbaA" is also a valid answer, but "Aabb" is incorrect.
Note that 'A' and 'a' are treated as two different characters.
 */

class Solution {
    public String frequencySort(String s) {
         HashMap<Character, Integer> map= new HashMap<>();

        for(int i=0;i<s.length();i++){
            char curr= s.charAt(i);
            map.put(curr, map.getOrDefault(curr,0)+1);
        }

        PriorityQueue<Pair> pq= new PriorityQueue<>((a,b)-> a.freq==b.freq ? a.ch - b.ch : b.freq- a.freq);
        for(Character i: map.keySet()){
            pq.add(new Pair(i, map.get(i)));
        }

        String ans="";

        while(!pq.isEmpty()){
            char ch= pq.peek().ch;
            int fr= pq.peek().freq;
            pq.poll();

            while(fr!=0){
                ans+=ch;
                fr--;
            }

        }

        return ans;
    }

    static class Pair{
        char ch;
        int freq;
        public Pair(char ch, int freq){
            this.ch=ch;
            this.freq=freq;
        }
    }
}
