package Hackerrank;
/*

The prime factors of 13195 are 5,7,13 and 29.
What is the largest prime factor of a given number N?

// Input Format
First line contains T, the number of test cases. This is followed by T lines each containing an integer N.

// Output Format
For each test case, display the largest prime factor of N.
 */


import java.util.*;

public class Largest_prime_factor {

    public static void main(String[] args) {
        try (Scanner in = new Scanner(System.in)) {
            int t = in.nextInt();
            for(int a0 = 0; a0 < t; a0++){
                long n = in.nextLong();
                System.out.println(findLargestPrimeFactor(n));
            }
        }
    }

    private static long findLargestPrimeFactor(long n) {
        long smallestFactor = findSmallestPrimeFactorGreaterThanOne(n);

        if (smallestFactor == n) {
            return n;
        }

        return findLargestPrimeFactor(n/smallestFactor);

    }

    private static long findSmallestPrimeFactorGreaterThanOne(long n) {
        for (long i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) {
                return i;
            }
        }
        return n;
    }
}
