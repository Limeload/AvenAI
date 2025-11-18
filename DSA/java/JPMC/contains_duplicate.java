import java.util.HashSet;
import java.util.Set;

/*
Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.
 */

class Solution {
    public boolean containsDuplicate(int[] nums) {
       Set<Integer> seenNumbers = new HashSet<>();
    for (int num : nums) {
        if (seenNumbers.contains(num)) {
            return true;
        }
        seenNumbers.add(num);
    }
    return false;
    }
}
