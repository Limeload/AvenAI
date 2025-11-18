package Leetcode;

import java.util.HashMap;

/*
Given a string s and an integer k, return true if you can use all the characters in s to construct k palindrome strings or false otherwise.

Example 1:

Input: s = "annabelle", k = 2
Output: true
Explanation: You can construct two palindromes using all characters in s.
Some possible constructions "anna" + "elble", "anbna" + "elle", "anellena" + "b"
Example 2:

Input: s = "leetcode", k = 3
Output: false
Explanation: It is impossible to construct 3 palindromes using all the characters of s.
Example 3:

Input: s = "true", k = 4
Output: true
Explanation: The only possible solution is to put each character in a separate string.

 */

class Solution {
    public boolean canConstruct(String s, int k) {
        if(s.length()<k) {
			return false;
		}
		HashMap<Character,Integer> map=new HashMap<>();
		for(char c:s.toCharArray()) {
			map.put(c,map.getOrDefault(c, 0)+1);
		}
		int odd=0;
		for(int count:map.values()) {
			if(count%2==1) {
				odd++;
			}
		}
		return odd<=k;
    }
}
