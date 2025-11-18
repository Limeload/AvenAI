/*
You are given a list of songs where the ith song has a duration of time[i] seconds.

Return the number of pairs of songs for which their total duration in seconds is divisible by 60. Formally, we want the number of indices i, j such that i < j with (time[i] + time[j]) % 60 == 0.
 */

class Solution {
    public int numPairsDivisibleBy60(int[] time) {
        int[] remainders = new int[60];
        int pairs = 0;

        for (int t : time) {
            int remainder = t % 60;
            if (remainder == 0) {
                pairs += remainders[0]; // Add pairs with 0 remainder
            } else {
                pairs += remainders[60 - remainder]; // Add pairs with complementing remainder
            }
            remainders[remainder]++; // Increment count for current remainder
        }

        return pairs;
    }
}
