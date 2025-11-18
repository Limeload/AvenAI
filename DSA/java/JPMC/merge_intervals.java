import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/*
Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.
 */

class Solution {
    public int[][] merge(int[][] intervals) {
  // Sort intervals by starting time
  Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

  List<int[]> mergedIntervals = new LinkedList<>();
  int[] currentInterval = intervals[0];

  for (int i = 1; i < intervals.length; i++) {
      int[] nextInterval = intervals[i];

      // Check for overlap
      if (nextInterval[0] <= currentInterval[1]) {
          // Merge overlapping intervals
          currentInterval[1] = Math.max(currentInterval[1], nextInterval[1]);
      } else {
          // Add current interval to merged list and start a new one
          mergedIntervals.add(currentInterval);
          currentInterval = nextInterval;
      }
  }

  // Add the last interval
  mergedIntervals.add(currentInterval);

  // Convert list to array
  return mergedIntervals.toArray(new int[mergedIntervals.size()][]);
    }
}
