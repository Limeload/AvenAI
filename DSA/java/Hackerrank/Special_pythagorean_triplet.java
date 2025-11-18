package Hackerrank;
/*
 A Pythagorean triplet is a set of three natural numbers, a < b < c, for which, a^2 + b^2 = c^2

For example, 3^2 + 4^2 = 9 + 16 = 25 = 5^2

Given N, Check if there exists any Pythagorean triplet for which a + b + c = N.
Find maximum possible value of abc among all such Pythagorean triplets, If there is no such Pythagorean triplet print -1.

/ Input Format
The first line contains an integer T i.e. number of test cases.
The next T lines will contain an integer N.

// Output Format
Print the value corresponding to each test case in separate lines.

*/

import java.util.*;

public class Special_pythagorean_triplet {

    public static void main(String[] args) {
        try (Scanner in = new Scanner(System.in)) {
            int t = in.nextInt();

            for (int i = 0; i < t; i++) {
                int n = in.nextInt();
                int maxValue = findMaxValue(n);
                System.out.println(maxValue);
            }
        }
    }

    private static int findMaxValue(int n) {
        int maxValue = -1;
        if (n % 2 == 1) {
            return maxValue;
        }
        int maxA = (n - 4) / 8 * 4;
        for (int a = maxA; a >= 4; a -= 4) {
            if ( (n * (n - 2 * a)) % (2 * (n - a)) == 0) {
                int b = (n * (n - 2 * a)) / (2 * (n - a));
                maxValue = Math.max(maxValue, a * b * (n - a - b));
            }
        }
        return maxValue;
    }
}

