/*
 Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.



Example 1:

Input: nums = [1,2,3,4]
Output: [24,12,8,6]
Example 2:

Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]



 */





import java.util.Arrays;

class Solution {
    public int[] productExceptSelf(int[] nums) {
        int arsize = nums.length;

        int[] arr = new int[arsize];
        int[] left = new int[arsize];
        int[] right = new int[arsize];

        Arrays.fill(arr, 1);

        int j = nums.length - 1;

        for (int i = 0; i < arsize; i++){
            if (i ==  0)
                left[0] = 1;
            else
                left[i] = left[i - 1] * nums[i - 1];

            if (j == arsize - 1){
                right[arsize - 1] = 1;
                j--;
            }
            else{
                right[j] = right[j + 1] * nums[j + 1];
                j--;
            }
        }

        for (int i = 0; i < arsize; i++){
            arr[i] = left[i] * right[i];
        }

        return arr;
    }
}
