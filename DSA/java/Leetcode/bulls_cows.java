package Leetcode;

import java.util.HashMap;

/*
You are playing the Bulls and Cows game with your friend.

You write down a secret number and ask your friend to guess what the number is. When your friend makes a guess, you provide a hint with the following info:

The number of "bulls", which are digits in the guess that are in the correct position.
The number of "cows", which are digits in the guess that are in your secret number but are located in the wrong position. Specifically, the non-bull digits in the guess that could be rearranged such that they become bulls.
Given the secret number secret and your friend's guess guess, return the hint for your friend's guess.

The hint should be formatted as "xAyB", where x is the number of bulls and y is the number of cows. Note that both secret and guess may contain duplicate digits.


 */

class Solution {
    public String getHint(String secret, String guess) {
         StringBuilder first = new StringBuilder(secret);
        StringBuilder second = new StringBuilder(guess);
        HashMap<Character, Integer> dict = new HashMap<>();
        int numA = 0;
        int numB = 0;
        for (int i = secret.length() - 1; i > -1; i--)
        {
            if (first.charAt(i) == second.charAt(i)) {
                numA++;
                first.deleteCharAt(i);
                second.deleteCharAt(i);
            }
            else {
                if (!dict.containsKey(secret.charAt(i)))
                    dict.put(secret.charAt(i), 0);
                dict.put(secret.charAt(i), dict.get(secret.charAt(i)) + 1);
            }
        }
        for (int i = 0; i < second.length(); i++)
        {
            if(dict.containsKey(second.charAt(i)) && dict.get(second.charAt(i)) > 0)
            {
                numB++;
                dict.put(second.charAt(i), dict.get(second.charAt(i)) - 1);
            }
        }
        return numA + "A" + numB + "B";
    }
}
