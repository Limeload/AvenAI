import java.util.Arrays;

/*
Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.
 */

class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1])); // Sort by end times

        int removals = 0;
        int prevEnd = Integer.MIN_VALUE;
        for (int i = 0; i < intervals.length; i++) {
            int[] current = intervals[i];
            if (current[0] < prevEnd) {
                removals++;
            } else {
                prevEnd = current[1];
            }
        }

        return removals;
    }
}
