/*
A distinct string is a string that is present only once in an array.

Given an array of strings arr, and an integer k, return the kth distinct string present in arr. If there are fewer than k distinct strings, return an empty string "".

Note that the strings are considered in the order in which they appear in the array.
 */

package Leetcode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

class Solution {
    public String kthDistinct(String[] arr, int k) {
        HashMap<String, Integer> map= new HashMap<>();

        for(String s: arr) map.put(s, map.getOrDefault(s,0)+1);

        List<String> ls= new ArrayList<>();
        for(String s: arr) if(map.get(s)==1) ls.add(s);

        if(ls.size()>=k) return ls.get(k-1);

        return "";
    }
}
