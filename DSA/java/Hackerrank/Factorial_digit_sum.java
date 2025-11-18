/*

Given an integer n, calculate the sum of the digits in n!

Input:

The first line of the input contains a single integer t, the number of test cases. Each of the next t lines contains a single integer n.

Output:

For each test case, print a single line containing the sum of the digits in n!.

Constraints:

1 <= t <= 100
1 <= n <= 100
 */

package Hackerrank;

import java.util.*;
import java.math.*;

public class Factorial_digit_sum {

    public static void main(String[] args) {
        try (/* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner in = new Scanner(System.in)) {
            int t = in.nextInt();
            for (int i = 0; i < t; i++) {
                BigInteger n = in.nextBigInteger();
                BigInteger factorial = calculateFactorial(n);
                int sum = calculateDigitSum(factorial);
                System.out.println(sum);
            }
        }
    }

    private static BigInteger calculateFactorial(BigInteger n) {
        if (n.equals(BigInteger.ZERO) || n.equals(BigInteger.ONE)) {
            return BigInteger.ONE;
        } else {
            return n.multiply(calculateFactorial(n.subtract(BigInteger.ONE)));
        }
    }

    private static int calculateDigitSum(BigInteger n) {
        int sum = 0;
        while (!n.equals(BigInteger.ZERO)) {
            sum += n.mod(BigInteger.TEN).intValue();
            n = n.divide(BigInteger.TEN);
        }
        return sum;

    }
}
