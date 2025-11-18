/*
 Given a non-empty array of non-negative integers nums, the degree of this array is defined as the maximum frequency of any one of its elements.

Your task is to find the smallest possible length of a (contiguous) subarray of nums, that has the same degree as nums.



Example 1:

Input: nums = [1,2,2,3,1]
Output: 2
Explanation:
The input array has a degree of 2 because both elements 1 and 2 appear twice.
Of the subarrays that have the same degree:
[1, 2, 2, 3, 1], [1, 2, 2, 3], [2, 2, 3, 1], [1, 2, 2], [2, 2, 3], [2, 2]
The shortest length is 2. So return 2.
Example 2:

Input: nums = [1,2,2,3,1,4,2]
Output: 6
Explanation:
The degree is 3 because the element 2 is repeated 3 times.
So [2,2,3,1,4,2] is the shortest subarray, therefore returning 6.

 */

import java.util.HashMap;

class Solution {
    public int findShortestSubArray(int[] nums) {
         HashMap<Integer,Integer> count=new HashMap<>();
        for(int i:nums){
            count.put(i,count.getOrDefault(i,0)+1);
        }
        int maxcount=Integer.MIN_VALUE;
        for(int j:count.keySet()){
            maxcount=Math.max(maxcount,count.get(j));
        }
        HashMap<Integer,Integer> hm=new HashMap<>();
        int windowsize=Integer.MIN_VALUE;
        int res=Integer.MAX_VALUE;
        int i=0,j=0;
        while(j<nums.length){
            hm.put(nums[j],hm.getOrDefault(nums[j],0)+1);
            windowsize=Math.max(windowsize,hm.get(nums[j]));
            while(windowsize==maxcount){
                res=Math.min(res,j-i+1);
                hm.put(nums[i],hm.get(nums[i])-1);
                if(hm.get(nums[i])==0)
                    hm.remove(nums[i]);
                if(nums[i]==nums[j])
                    windowsize--;
                i++;
            }
            j++;
        }
        return res;
    }
}
