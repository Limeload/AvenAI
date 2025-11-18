package Hackerrank;
/*

2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder.
What is the smallest positive number that is evenly divisible(divisible with no remainder) by all of the numbers from 1 to N ?

// Input Format
First line contains T that denotes the number of test cases. This is followed by T lines, each containing an integer, N.

// Output Format
Print the required answer for each test case in a new line.

 */

import java.util.*;

public class Smallest_multiple {

    public static void main(String[] args) {
        try (Scanner in = new Scanner(System.in)) {
            int t = in.nextInt();
            for(int a0 = 0; a0 < t; a0++){
                int n = in.nextInt();
                long smallestMultiple = findSmallestMultiple(n);
                System.out.println(smallestMultiple);
            }
        }
    }

    private static long findSmallestMultiple(int n) {
        long smallestMultiple = 1;

        for (int i = 2; i <= n; i++) {
            smallestMultiple = lcm(smallestMultiple, i);
        }

        return smallestMultiple;
    }

    private static long lcm(long a, long b) {
        long product = a * b;

        while (b != 0) {
            long remainder = a % b;
            a = b;
            b = remainder;
        }

        return product / a;
    }
}
