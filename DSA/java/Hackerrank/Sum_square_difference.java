package Hackerrank;
/*

The sum of the squares of the first ten natural numbers is, 1^2 + 2^2 + ... + 10^2 = 385.
The square of the sum of the first ten natural numbers is, (1 + 2 + ... + 10)^2 = 55^2 = 3025.
Hence the absolute difference between the sum of the squares of the first ten natural numbers and the square of the sum is 3025-385 = 2640.
Find the absolute difference between the sum of the squares of the first N natural numbers and the square of the sum.

// Input Format
First line contains T that denotes the number of test cases. This is followed by T lines, each containing an integer, N.

// Output Format
Print the required answer for each test case in a new line.

 */


import java.util.*;

public class Sum_square_difference {

    public static void main(String[] args) {
        try (Scanner in = new Scanner(System.in)) {
            int t = in.nextInt();
            for(int a0 = 0; a0 < t; a0++){
                int n = in.nextInt();
                long sumOfSquares = sumOfSquares(n);
                long squareOfSum = squareOfSum(n);
                long absoluteDifference = Math.abs(squareOfSum - sumOfSquares);
                System.out.println(absoluteDifference);
            }
        }
    }

    private static long sumOfSquares(int n) {
        long sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i * i;
        }
        return sum;
    }

    private static long squareOfSum(int n) {
        long sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        sum *= sum;
        return sum;
    }
}
