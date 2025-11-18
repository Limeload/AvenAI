import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

/*
 Given an array of integers arr and an integer k. Find the least number of unique integers after removing exactly k elements.
 */

class Solution {
    public int findLeastNumOfUniqueInts(int[] arr, int k) {
        Map<Integer, Integer> frequencyMap = new HashMap<>();
        for (int num : arr) {
            frequencyMap.put(num, frequencyMap.getOrDefault(num, 0) + 1);
        }

        PriorityQueue<Integer> minHeap = new PriorityQueue<>((a, b) -> frequencyMap.get(a) - frequencyMap.get(b));
        minHeap.addAll(frequencyMap.keySet());

        while (k > 0 && !minHeap.isEmpty()) {
            int element = minHeap.poll();
            int frequency = frequencyMap.get(element);

            if (frequency <= k) {
                k -= frequency;
                frequencyMap.remove(element);
            } else {
                frequencyMap.put(element, frequency - k);
                k = 0;
            }
        }

        return frequencyMap.size();
    }
}
