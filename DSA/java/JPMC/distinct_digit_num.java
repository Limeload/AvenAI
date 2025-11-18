import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

/*
Given a range of integers, determine how many numbers have no repeating digits.
Basically a list of queries was given of size q, and in each query you had l and r. You have to find all the numbers in between l and r (both inclusive), that only have distinct digits.
1 <= q <= 10^5
1 <= l <= r <= 10^6

Example-
Query array: { {1,20} , {9,19}}
Output: {19,10}
Here, all the numbers have distinct digits except 11. So, 19 is the answer for the first query and 10 is for the second.
Note: 11, 2827, 5566, etc. are the kind of numbers that are not allowed.
Hint: To solve the above problem, pre-compute all the numbers to check for distinct digits and store them in the array arr. If arr[i] = 1, this means i has only distinct digits. Else if arr[i] = 0, then i has a repeating digit. Now calculate the prefix sum of arr, and for a given l and r, arr[l] - arr[r-1] shall give you the answer in O(1) time for each query. Hence, The time complexity is O(n) for pre-computation, O(q) for total queries, and space complexity is O(n), where n = 10^6.
 */

class Solution {

    private static final int MAX_NUM = 1000000;
    private static boolean[] isDistinct = new boolean[MAX_NUM + 1];

    public static void main(String[] args) {
        // Pre-compute numbers with distinct digits
        precomputeDistinctNumbers();

        // Create prefix sum array
        int[] prefixSum = new int[MAX_NUM + 1];
        for (int i = 1; i <= MAX_NUM; i++) {
            prefixSum[i] = prefixSum[i - 1] + (isDistinct[i] ? 1 : 0);
        }

        // Process queries
        Scanner scanner = new Scanner(System.in);
        int q = scanner.nextInt();
        for (int i = 0; i < q; i++) {
            int l = scanner.nextInt();
            int r = scanner.nextInt();

            // Calculate the number of distinct numbers within the range
            int distinctCount = prefixSum[r] - prefixSum[l - 1];
            System.out.println(distinctCount);
        }
    }

    private static void precomputeDistinctNumbers() {

        for (int i = 1; i <= MAX_NUM; i++) {
            int num = i;
            Set<Integer> digits = new HashSet<>();
            boolean distinct = true;
            while (num > 0) {
                int digit = num % 10;
                if (digits.contains(digit)) {
                    distinct = false;
                    break;
                }
                digits.add(digit);
                num /= 10;
            }
            isDistinct[i] = distinct;
        }
    }
}
