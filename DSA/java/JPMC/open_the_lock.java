import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;

/*
You have a lock in front of you with 4 circular wheels. Each wheel has 10 slots: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'. The wheels can rotate freely and wrap around: for example we can turn '9' to be '0', or '0' to be '9'. Each move consists of turning one wheel one slot.

The lock initially starts at '0000', a string representing the state of the 4 wheels.

You are given a list of deadends dead ends, meaning if the lock displays any of these codes, the wheels of the lock will stop turning and you will be unable to open it.

Given a target representing the value of the wheels that will unlock the lock, return the minimum total number of turns required to open the lock, or -1 if it is impossible.


 */

class Solution {
    public int openLock(String[] deadends, String target) {
        Set<String> deadSet = new HashSet<>(Arrays.asList(deadends));
        Queue<String> queue = new LinkedList<>();

        queue.add("0000");
        int steps = 0;

        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String current = queue.poll();
                if (target.equals(current)) {
                    return steps;
                }
                if (deadSet.contains(current)) {
                    continue;
                }
                deadSet.add(current);

                for (int j = 0; j < 4; j++) {
                    char c = current.charAt(j);
                    char next = c == '9' ? '0' : (char) (c + 1);
                    queue.add(current.substring(0, j) + next + current.substring(j + 1));

                    next = c == '0' ? '9' : (char) (c - 1);
                    queue.add(current.substring(0, j) + next + current.substring(j + 1));
                }
            }
            steps++;
        }
        return -1;
    }
}
