package Leetcode;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.PriorityQueue;
import java.util.Queue;

/*
Given a string s and an integer k, rearrange s such that the same characters are at least distance k from each other. If it is not possible to rearrange the string, return an empty string "".
 */

class Solution {
    public String rearrangeString(String s, int k) {
      int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
        }
        int[] position = new int[26];
        Arrays.fill(position, -1);

        Queue<Integer> heap = new PriorityQueue<>((a, b) ->
            count[a] == count[b] ? a - b : count[b] - count[a]);
        for (int i = 0; i < 26; i++) {
            if (count[i] > 0) {
                heap.offer(i);
            }
        }
        Queue<Integer> queue = new LinkedList<>();

        StringBuilder builder = new StringBuilder();
        while (!heap.isEmpty() || !queue.isEmpty()) {
            if (!queue.isEmpty() && position[queue.peek()] <= builder.length() - k) {
                heap.offer(queue.poll());
            }
            if (heap.isEmpty()) {
                break;
            }

            int maxChar = heap.poll();
            position[maxChar] = builder.length();
            count[maxChar]--;
            builder.append((char)(maxChar + 'a'));

            if (count[maxChar] > 0) {
                queue.offer(maxChar);
            }
        }

        if (!queue.isEmpty()) {
            return "";
        }
        return builder.toString();
    }
}
