package Hackerrank;
/*

By listing the first six prime numbers: 2,3,5,7,11 and 13, we can see that the 6th prime is 13.
What is the Nth prime number?

/ Input Format
First line contains T that denotes the number of test cases. This is followed by T lines, each containing an integer, N.

// Output Format
Print the required answer for each test case in a new line.

 */

import java.util.*;

public class tenthousandfirstst_prime{

    public static void main(String[] args) {
        try (Scanner in = new Scanner(System.in)) {
            int t = in.nextInt();
            for(int a0 = 0; a0 < t; a0++){
                int n = in.nextInt();
                int nthPrime = findNthPrime(n);
                System.out.println(nthPrime);
            }
        }
    }

    private static int findNthPrime(int n) {
         if (n == 1) {
        return 2;
    }
    int count = 1; // Start from 1 because 2 is the first prime
    int num = 3;   // Start checking odd numbers from 3
    while (count < n) {
        if (isPrime(num)) {
            count++;
        }
        if (count == n) {
            return num;
        }
        num += 2; // Increment by 2 to check the next odd number
    }
    return -1; // Shouldn't reach here in this problem
    }

    private static boolean isPrime(int n){
        if (n <= 1) {
        return false;
     }
    if (n <= 3) {
        return true;
    }
    if (n % 2 == 0 || n % 3 == 0) {
        return false;
    }
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n%(i+2)==0) {
            return false;
        }
    }
    return true;
    }
}

