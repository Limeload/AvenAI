import java.util.PriorityQueue;
import java.util.Queue;

/*
You are given an m x n integer matrix grid and an array queries of size k.

Find an array answer of size k such that for each integer queries[i] you start in the top left cell of the matrix and repeat the following process:

If queries[i] is strictly greater than the value of the current cell that you are in, then you get one point if it is your first time visiting this cell, and you can move to any adjacent cell in all 4 directions: up, down, left, and right.
Otherwise, you do not get any points, and you end this process.
After the process, answer[i] is the maximum number of points you can get. Note that for each query you are allowed to visit the same cell multiple times.

Return the resulting array answer.
 */

class Solution {
    public int[] maxPoints(int[][] grid, int[] queries) {
        Queue<int[]> processQueue = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        int k = queries.length;
        int[] answer = new int[k];

        for (int i = 0; i < k; i++) {
            processQueue.offer(new int[]{queries[i], i});
        }

        int m = grid.length;
        int n = grid[0].length;
        boolean[][] vis = new boolean[m][n];
        Queue<int[]> bfsQueue = new PriorityQueue<>((a,b) ->
                grid[a[0]][a[1]] - grid[b[0]][b[1]]
            );
        int reach = 0;

        bfsQueue.offer(new int[]{0, 0});
        vis[0][0] = true;

        while (!processQueue.isEmpty()) {
            int[] nextElement = processQueue.poll();
            int elementValue = nextElement[0];
            int elementIndex = nextElement[1];

            while (!bfsQueue.isEmpty() && elementValue > grid[bfsQueue.peek()[0]][bfsQueue.peek()[1]]) {
                reach++;
                int[] cell = bfsQueue.poll();
                int row = cell[0];
                int col = cell[1];

                for (int[] d : new int[][]{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}) {
                    int nextRow = row + d[0];
                    int nextCol = col + d[1];
                    if (nextRow >= 0 && nextRow < m && nextCol >= 0 && nextCol < n && !vis[nextRow][nextCol]) {
                        vis[nextRow][nextCol] = true;
                        bfsQueue.offer(new int[]{nextRow, nextCol});
                    }
                }

            }

            answer[elementIndex] = reach;
        }


        return answer;
    }
}
