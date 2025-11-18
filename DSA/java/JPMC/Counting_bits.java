/*
Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.
 */


class Solution {
    public int[] countBits(int n) {
        int[] counts = new int[n + 1];

        for (int i = 0; i <= n; i++) {
            int count = 0;
            int num = i;

            while (num > 0) {
                count += num & 1;
                num >>= 1;
            }

            counts[i] = count;
        }

        return counts;
    }
}

