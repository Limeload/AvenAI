package Leetcode;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/*
Given a string text, you want to use the characters of text to form as many instances of the word "balloon" as possible.

You can use each character in text at most once. Return the maximum number of instances that can be formed.
 */

class Solution {
    public int maxNumberOfBalloons(String text) {
 // declare HashSet to store word "balloon"
 Set<Character> map =  new HashSet();
 // declare our word balloon
 String baloon = "balloon";
 // iterate over balloon word:
 for(int i = 0; i < baloon.length(); i++) {
     // store each character in HashSet
     map.add(baloon.charAt(i));
 }
 // declare HashMap to calculate count
 Map<Character, Integer> hash = new HashMap();
 // iterate over text string:
 for(int i = 0; i < text.length(); i ++) {
     // get char from string
     char word = text.charAt(i);
     // if HashSet contains char:
     if(map.contains(word)) {
         // count char in HashMap
         hash.put(word, hash.getOrDefault(word, 0) + 1);
     }
 }
 // declare min variable to store answer
 int min = Integer.MAX_VALUE;
 // check if hash have all chars to make balloon word, if no return 0
 if(hash.size() < 5) return 0;
 // iterate over HashMap:
 for(Map.Entry<Character, Integer> entry: hash.entrySet()) {
     // get char from HashMap
     char word = entry.getKey();
     // get count of char from HashMap
     int count = entry.getValue();
     // check if char is "l" or "o":
     if(word == 'l' || word == 'o') {
         // if true: set min as devision of count by 2 and floor it
         min = Math.min(min, (int)Math.floor(count / 2));
     } else {
         // if false: set min as min value of min or count
         min = Math.min(min, count);
     }
 }
 // return answer
 return min;
    }
}
