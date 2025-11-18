/*
 2^9 = 512 and the sum of its digits is 5+1+2 = 8.
What is the sum of the digits of the number 2^N ?
 */


package Hackerrank;

import java.math.*;
import java.util.Scanner;


public class Power_digit_sum {

    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int T = scanner.nextInt(); // Read number of test cases

            for (int i = 0; i < T; i++) {
                int power = scanner.nextInt(); // Read power for each test case

                int sum = calculatePowerDigitSum(power);
                System.out.println(sum);
            }
        }
    }

    private static int calculatePowerDigitSum(int power) {
        String temp = BigInteger.ONE.shiftLeft(power).toString();
        int sum = 0;

        for (int i = 0; i < temp.length(); i++) {
            sum += temp.charAt(i) - '0';
        }

        return sum;
    }
}
