package Leetcode;

import java.util.HashMap;

/*
Given a string paragraph and a string array of the banned words banned, return the most frequent word that is not banned. It is guaranteed there is at least one word that is not banned, and that the answer is unique.

The words in paragraph are case-insensitive and the answer should be returned in lowercase.



Example 1:

Input: paragraph = "Bob hit a ball, the hit BALL flew far after it was hit.", banned = ["hit"]
Output: "ball"
Explanation:
"hit" occurs 3 times, but it is a banned word.
"ball" occurs twice (and no other word does), so it is the most frequent non-banned word in the paragraph.
Note that words in the paragraph are not case sensitive,
that punctuation is ignored (even if adjacent to words, such as "ball,"),
and that "hit" isn't the answer even though it occurs more because it is banned.
Example 2:

Input: paragraph = "a.", banned = []
Output: "a"

 */

class Solution {
    public String mostCommonWord(String paragraph, String[] banned) {
        String[] words=paragraph.toLowerCase().replaceAll("\\W+" , " ").split("\\s+");
        HashMap<String,Integer>h=new HashMap<>();
        for(String word:words){

            int count=h.getOrDefault(word,0);
            h.put(word,count+1);
        }
        for(int i=0;i<banned.length;i++){
            h.remove(banned[i]);
        }
        int mx=Integer.MIN_VALUE;
        String ans="";
        for(String m : h.keySet()){
            int p=h.get(m);
            if(p>mx){
                  ans=m;
                  mx=p;
            }
        }
        return ans;
    }
}
