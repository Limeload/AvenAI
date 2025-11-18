package Leetcode;

import java.util.HashSet;

/*
You are given a 0-indexed string word, consisting of lowercase English letters. You need to select one index and remove the letter at that index from word so that the frequency of every letter present in word is equal.

Return true if it is possible to remove one letter so that the frequency of all letters in word are equal, and false otherwise.

Note:

The frequency of a letter x is the number of times it occurs in the string.
You must remove exactly one letter and cannot choose to do nothing.

 */

class Solution {
    public boolean equalFrequency(String word) {
        int len=word.length();
        HashSet<Character> set=new HashSet<>();
        int arr[]=new int[26];
        for(char c:word.toCharArray()){
            arr[c-'a']++;
        }
        for(int i=0;i<26;i++){
            arr[i]--;
            if(check(arr)){
                return true;
            }
            arr[i]++;
        }

        return false;
    }

     public static boolean check(int [] ans){
        int c=0;
        for(int a:ans){
            if(c==0){
                c=a;
            }
            else if(a==0 || c==a){
                continue;
            }
            else{
                return false;
            }
        }
        return true;
    }
}
