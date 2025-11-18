/*
Given an array of integers nums, you start with an initial positive value startValue.

In each iteration, you calculate the step by step sum of startValue plus elements in nums (from left to right).

Return the minimum positive value of startValue such that the step by step sum is never less than 1.
 */

class Solution {
    public int minStartValue(int[] nums) {
        int minSum = 0, currSum = 0;

    for (int num : nums) {
        currSum += num;
        minSum = Math.min(minSum, currSum);
    }

    return -Math.min(minSum, 0) + 1;
    }
}
