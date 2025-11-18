import java.util.PriorityQueue;

/*
You have some number of sticks with positive integer lengths. These lengths are given as an array sticks, where sticks[i] is the length of the ith stick.

You can connect any two sticks of lengths x and y into one stick by paying a cost of x + y. You must connect all the sticks until there is only one stick remaining.

Return the minimum cost of connecting all the given sticks into one stick in this way.
*/


class Solution {
    public int connectSticks(int[] sticks) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int stick : sticks) {
            pq.offer(stick);
        }

        int cost = 0;
        while (pq.size() > 1) {
            int stick1 = pq.poll();
            int stick2 = pq.poll();
            int newStick = stick1 + stick2;
            cost += newStick;
            pq.offer(newStick);
        }

        return cost;

    }
}
