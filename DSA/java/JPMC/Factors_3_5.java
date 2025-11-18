import java.util.Scanner;

/*

The LeetCode problem corresponding to the provided code is Count Pairs, which asks to count the number of pairs of integers (x, y) satisfying the conditions:

0 <= x <= high
0 <= y <= high
x * y is divisible by both 3 and 5
The provided code efficiently counts these pairs by iterating through possible values of x and y within the specified range and checking if their product meets the conditions. It utilizes the maximum powers of 3 and 5 to avoid unnecessary computations.

The Java code implementation provides a clear and structured approach to solving the problem, using explicit type casting, Math.floor for calculating the maximum power, and a nested loop to iterate through the valid range of x and y values.

 */


public class Factors_3_5 {

    public static int countPairs(int low, int high) {
        int maxPowerOf3 = (int) Math.floor(Math.log(high) / Math.log(3));
        int maxPowerOf5 = (int) Math.floor(Math.log(high) / Math.log(5));
        int count = 0;

        for (int x = 0; x <= maxPowerOf3; x++) {
            for (int y = 0; y <= maxPowerOf5; y++) {
                int value = (int) Math.pow(3, x) * (int) Math.pow(5, y);

                if (low <= value && value <= high) {
                    count++;
                }
            }
        }

        return count;
    }

    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int low = scanner.nextInt();
            int high = scanner.nextInt();

            int count = countPairs(low, high);
            System.out.println(count);
        }
    }
}

