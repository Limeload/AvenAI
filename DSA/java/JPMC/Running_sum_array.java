/*
Given an array nums. We define a running sum of an array as runningSum[i] = sum(nums[0]…nums[i]).

Return the running sum of nums.
 */

public class Running_sum_array {
    public int[] runningSum(int[] nums) {
        int[] runningSums = new int[nums.length];
        runningSums[0] = nums[0];
        for (int i = 1; i < nums.length; i++) {
            runningSums[i] = runningSums[i - 1] + nums[i];
        }
        return runningSums;
    }
}

