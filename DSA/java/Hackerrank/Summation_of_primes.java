package Hackerrank;
/*
The sum of the primes below 10 is 2 + 3 + 5 + 7 = 17.
Find the sum of all the primes not greater than given N.

//Input Format
First line contains T that denotes the number of test cases. This is followed by T lines, each containing an integer, N.

//Output Format
Print the required answer for each test case.
 */


import java.util.*;

public class Summation_of_primes {
    public static void main(String[] args) {
         final int SIZE = 1000000;
        boolean[] isPrime = new boolean[SIZE + 1];
        Arrays.fill(isPrime, true);
        long[] sums = new long[SIZE + 2];
        for (int i = 2; i <= SIZE; i++) {
            if (isPrime[i]) {
                sums[i] = sums[i-1] + i;
                for (long j = (long) i * i; j <= SIZE; j+=i) {
                    isPrime[(int)j] = false;
                }
            } else {
                sums[i] = sums[i-1];
            }
        }

        try (Scanner in = new Scanner(System.in)) {
            int t = in.nextInt();
            for(int a0 = 0; a0 < t; a0++){
                int n = in.nextInt();
                System.out.println(sums[n]);
            }
        }
    }
}

