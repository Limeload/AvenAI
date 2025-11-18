import java.util.ArrayList;
import java.util.List;

/*
Given an array of strings queries and a string pattern, return a boolean array answer where answer[i] is true if queries[i] matches pattern, and false otherwise.

A query word queries[i] matches pattern if you can insert lowercase English letters pattern so that it equals the query. You may insert each character at any position and you may not insert any characters.
*/

class Solution {
    public List<Boolean> camelMatch(String[] queries, String pattern) {
        List<Boolean> list = new ArrayList<>();

        for (var q : queries) {
           int index = 0;
           boolean flag = true;
           for (var c : q.toCharArray()) {
              if(index < pattern.length() && c == pattern.charAt(index)){
                 index++;
                 continue;
              }
              if(c >= 'A' && c <= 'Z'){
                 if(index >= pattern.length() || c != pattern.charAt(index)){
                    flag = false;
                    break;
                 }
              }
           }
           flag = flag && index == pattern.length();
           list.add(flag);
        }
        return list;
    }
}
