import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

/*
 Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.
 */


class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
       // Create a set to store unique elements from nums1
    Set<Integer> nums1Set = new HashSet<>();
    for (int num : nums1) {
        nums1Set.add(num);
    }

    // Create an ArrayList to store the intersection elements
    ArrayList<Integer> intersection = new ArrayList<>();

    // Check if each element in nums2 exists in nums1Set and add it to the intersection if it's unique
    for (int num : nums2) {
        if (nums1Set.contains(num) && !intersection.contains(num)) {
            intersection.add(num);
        }
    }

    // Convert the ArrayList to an int array


int[] result = new

int[intersection.size()];
    for (int i = 0; i < intersection.size(); i++) {
        result[i] = intersection.get(i);
    }

    return result;
    }
}
