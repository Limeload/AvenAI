import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/*
Given an array of distinct integers arr, find all pairs of elements with the minimum absolute difference of any two elements.

Return a list of pairs in ascending order(with respect to pairs), each pair [a, b] follows

a, b are from arr
a < b
b - a equals to the minimum absolute difference of any two elements in arr
 */

class Solution {
    public List<List<Integer>> minimumAbsDifference(int[] arr) {
      // Sort the array in ascending order to minimize unnecessary comparisons
    Arrays.sort(arr);

    // Initialize the minimum absolute difference and the result list
    int minAbsDiff = Integer.MAX_VALUE;
    List<List<Integer>> result = new ArrayList<>();

    // Iterate through the sorted array and check for pairs with the minimum absolute difference
    for (int i = 0; i < arr.length - 1; i++) {
        int absDiff = Math.abs(arr[i + 1] - arr[i]);

        if (absDiff < minAbsDiff) {
            minAbsDiff = absDiff;
            result = new ArrayList<>(); // Clear the result list to store only the pairs with the new minimum absolute difference
        }

        if (absDiff == minAbsDiff) {
            result.add(Arrays.asList(arr[i], arr[i + 1]));
        }
    }

    return result;
    }
}
