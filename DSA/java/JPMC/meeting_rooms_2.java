// 253. Meeting Rooms II
// Medium
// Topics
// conpanies icon
// Companies
// Hint
// Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.

 

// Example 1:

// Input: intervals = [[0,30],[5,10],[15,20]]
// Output: 2
// Example 2:

// Input: intervals = [[7,10],[2,4]]
// Output: 1
 

// Constraints:

// 1 <= intervals.length <= 104
// 0 <= starti < endi <= 106

import java.util.Arrays;
import java.util.PriorityQueue;

class Solution {
    public int minMeetingRooms(int[][] intervals) {
        // Sort intervals by start time
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        
        // Min heap to track end times of ongoing meetings
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        
        int maxRooms = 0;
        
        for (int[] interval : intervals) {
            int start = interval[0];
            int end = interval[1];
            
            // Remove all meetings that have ended before current meeting starts
            while (!minHeap.isEmpty() && minHeap.peek() <= start) {
                minHeap.poll();
            }
            
            // Add current meeting's end time
            minHeap.offer(end);
            
            // Update maximum number of concurrent meetings
            maxRooms = Math.max(maxRooms, minHeap.size());
        }
        
        return maxRooms;
    }
}