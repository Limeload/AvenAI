package Leetcode;

import java.util.HashSet;

/*
Given a digit string s, return the number of unique substrings of s where every digit appears the same number of times.


Example 1:

Input: s = "1212"
Output: 5
Explanation: The substrings that meet the requirements are "1", "2", "12", "21", "1212".
Note that although the substring "12" appears twice, it is only counted once.
Example 2:

Input: s = "12321"
Output: 9
Explanation: The substrings that meet the requirements are "1", "2", "3", "12", "23", "32", "21", "123", "321".
 */

class Solution {
    public int equalDigitFrequency(String s) {
 int N = s.length();
        HashSet<String> hs = new HashSet<>();
        char[] arr = s.toCharArray();
        int res = 0;

        for(int i=0; i<N; i++) {
            StringBuilder sb = new StringBuilder();
            int[] cnt = new int[10];

            for(int j=i; j<N; j++) {
                sb.append(arr[j]);
                cnt[arr[j]-'0']++;

                boolean flag = true;
                int cur = -1;

                for(int k=0; k<10; k++) {
                    if(cnt[k] == 0) continue;
                    if(cur == -1) {
                        cur = cnt[k];
                    } else {
                        if(cur != cnt[k]) {
                            flag = false;
                            break;
                        }
                    }
                }

                if(flag) {
                    if(!hs.contains(sb.toString())) {
                        hs.add(sb.toString());
                        res++;
                    }
                }
            }
        }

        return res;
    }
}
