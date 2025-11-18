// 295. Find Median from Data Stream
// Hard
// Topics
// conpanies icon
// Companies
// The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

// For example, for arr = [2,3,4], the median is 3.
// For example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.
// Implement the MedianFinder class:

// MedianFinder() initializes the MedianFinder object.
// void addNum(int num) adds the integer num from the data stream to the data structure.
// double findMedian() returns the median of all elements so far. Answers within 10-5 of the actual answer will be accepted.
 

// Example 1:

// Input
// ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
// [[], [1], [2], [], [3], []]
// Output
// [null, null, null, 1.5, null, 2.0]

// Explanation
// MedianFinder medianFinder = new MedianFinder();
// medianFinder.addNum(1);    // arr = [1]
// medianFinder.addNum(2);    // arr = [1, 2]
// medianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)
// medianFinder.addNum(3);    // arr[1, 2, 3]
// medianFinder.findMedian(); // return 2.0
 

// Constraints:

// -105 <= num <= 105
// There will be at least one element in the data structure before calling findMedian.
// At most 5 * 104 calls will be made to addNum and findMedian.
 

// Follow up:

// If all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?
// If 99% of all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?

import java.util.PriorityQueue;
import java.util.Collections;

class MedianFinder {
    // Max heap for the lower half (smaller numbers)
    private PriorityQueue<Integer> maxHeap;
    // Min heap for the upper half (larger numbers)
    private PriorityQueue<Integer> minHeap;
    
    public MedianFinder() {
        // Max heap: reverse natural order
        maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        // Min heap: natural order
        minHeap = new PriorityQueue<>();
    }
    
    public void addNum(int num) {
        // Always add to maxHeap first
        maxHeap.offer(num);
        
        // Move the largest from maxHeap to minHeap
        minHeap.offer(maxHeap.poll());
        
        // Balance: if minHeap has more elements, move one back to maxHeap
        // This ensures maxHeap has equal or one more element than minHeap
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }
    
    public double findMedian() {
        // If maxHeap has more elements, median is its top
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.peek();
        }
        // Otherwise, median is the average of both tops
        return (maxHeap.peek() + minHeap.peek()) / 2.0;
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * MedianFinder obj = new MedianFinder();
 * obj.addNum(num);
 * double param_2 = obj.findMedian();
 */