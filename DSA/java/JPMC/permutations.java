// 46. Permutations
// Medium
// Topics
// conpanies icon
// Companies
// Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.

 

// Example 1:

// Input: nums = [1,2,3]
// Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
// Example 2:

// Input: nums = [0,1]
// Output: [[0,1],[1,0]]
// Example 3:

// Input: nums = [1]
// Output: [[1]]
 

// Constraints:

// 1 <= nums.length <= 6
// -10 <= nums[i] <= 10
// All the integers of nums are unique.

import java.util.*;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        
        backtrack(nums, current, used, result);
        
        return result;
    }
    
    private void backtrack(int[] nums, List<Integer> current, boolean[] used, List<List<Integer>> result) {
        // Base case: if current permutation is complete
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        
        // Try each number that hasn't been used yet
        for (int i = 0; i < nums.length; i++) {
            if (!used[i]) {
                // Choose
                current.add(nums[i]);
                used[i] = true;
                
                // Explore
                backtrack(nums, current, used, result);
                
                // Unchoose (backtrack)
                current.remove(current.size() - 1);
                used[i] = false;
            }
        }
    }
    
    // Test method
    public static void main(String[] args) {
        Solution solution = new Solution();
        
        // Test case 1
        int[] nums1 = {1, 2, 3};
        System.out.println("Input: " + Arrays.toString(nums1));
        System.out.println("Output: " + solution.permute(nums1));
        
        // Test case 2
        int[] nums2 = {0, 1};
        System.out.println("\nInput: " + Arrays.toString(nums2));
        System.out.println("Output: " + solution.permute(nums2));
        
        // Test case 3
        int[] nums3 = {1};
        System.out.println("\nInput: " + Arrays.toString(nums3));
        System.out.println("Output: " + solution.permute(nums3));
    }
}