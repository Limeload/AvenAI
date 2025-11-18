/*
You have n  tiles, where each tile has one letter tiles[i] printed on it.

Return the number of possible non-empty sequences of letters you can make using the letters printed on those tiles.
 */



package Leetcode;

import java.util.HashSet;

class Solution {
    public int numTilePossibilities(String tiles) {
        HashSet<String> hs = new HashSet<>();
        int len = tiles.length();
        boolean[] vis = new boolean[len];
        helper("",hs,vis,tiles,len);
        return hs.size()-1;
    }

    public static void helper(String str,HashSet<String> hs,boolean[] vis,String tiles,int len){
        hs.add(str);
        for(int i=0;i<len;i++){
            if(!vis[i]){
                vis[i] = true;
                helper(str+tiles.charAt(i),hs,vis,tiles,len);
                vis[i] = false;
            }
        }
    }
}
