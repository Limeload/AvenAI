package Leetcode;

/*
You are given an array of strings words (0-indexed).

In one operation, pick two distinct indices i and j, where words[i] is a non-empty string, and move any character from words[i] to any position in words[j].

Return true if you can make every string in words equal using any number of operations, and false otherwise.
 */

class Solution {
    public boolean makeEqual(String[] words) {
        int[] arr = new int[26];
        int n = words.length;
        for(int i=0; i<n; i++){
            for(int j=0; j<words[i].length(); j++) arr[words[i].charAt(j)-'a']++;
        }
        for(int i=0; i<26; i++){
            if(arr[i]!=0 && arr[i]%n!=0) return false;
        }
        return true;
    }
}
