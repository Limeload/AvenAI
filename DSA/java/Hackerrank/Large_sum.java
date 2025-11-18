/*
Work out the first ten digits of the sum of N 50 numbers.

//Input Format
First line contains N, next N lines contain a 50 digit number each.

//Output Format
Print only first 10 digit of the final sum
 */

package Hackerrank;


import java.util.*;
import java.math.*;


public class Large_sum {

    public static void main(String[] args) {
        try (/* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner scanner = new Scanner(System.in)) {
            int N = scanner.nextInt();

            BigInteger sum = BigInteger.ZERO;
            for (int i = 0; i < N; i++) {
                BigInteger number = new BigInteger(scanner.next());
                sum = sum.add(number);
            }

            String sumStr = sum.toString();
            System.out.println(sumStr.substring(0, 10));
        }
    }
}
