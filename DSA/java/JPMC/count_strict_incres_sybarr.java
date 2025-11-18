/*
You are given an array nums consisting of positive integers.

Return the number of subarrays of nums that are in strictly increasing order.

A subarray is a contiguous part of an array.



Example 1:

Input: nums = [1,3,5,4,4,6]
Output: 10
Explanation: The strictly increasing subarrays are the following:
- Subarrays of length 1: [1], [3], [5], [4], [4], [6].
- Subarrays of length 2: [1,3], [3,5], [4,6].
- Subarrays of length 3: [1,3,5].
The total number of subarrays is 6 + 3 + 1 = 10.
Example 2:

Input: nums = [1,2,3,4,5]
Output: 15
Explanation: Every subarray is strictly increasing. There are 15 possible subarrays that we can take.

 */

 class Solution {
    public long countSubarrays(int[] nums) {
        long result =0;
        int start=0, end=1;
        long n = 0;
        while(end < nums.length){
			// if current element is not strictly increasing than previous
            if(nums[end] <= nums[end - 1]){
				// range - 1
                n = end - start;
				// calculating numbers of subarray from the range
                result += (n * (n+1))/2;
                start = end;
            }
            end ++;
        }
        n = end- start;
        result += (n * (n+1))/2;
        return result;
    }
}
