package Hackerrank;
/*

A palindromic number reads the same both ways.
The smallest 6 digit palindrome made from the product of two 3-digit numbers is 101101 = 143 x 707.

Find the largest palindrome made from the product of two 3-digit numbers which is less than N.

// Input Format
First line contains T that denotes the number of test cases. This is followed by T lines, each containing an integer, N.

// Output Format
Print the required answer for each test case in a new line.

 */

import java.util.*;

public class Largest_palindrome_product {
    private static final int LOWER_BOUND = 100;
    private static final int UPPER_BOUND = 1000;

    public static void main(String[] args) {
        try (Scanner in = new Scanner(System.in)) {
            int t = in.nextInt();
            for(int a0 = 0; a0 < t; a0++){
                int n = in.nextInt();
                int largestPalindrome = 0;

                for (int i = UPPER_BOUND; i >= LOWER_BOUND; i--) {
                    for (int j = UPPER_BOUND; j >= LOWER_BOUND; j--) {
                        int product = i * j;

                        if (product < n && isPalindrome(product) && product > largestPalindrome) {
                            largestPalindrome = product;
                        }
                    }
                }
                System.out.println(largestPalindrome);
            }
        }
    }
    private static boolean isPalindrome(int num){
        int reversedNum = 0;
        int originalNum = num;

        while (num > 0) {
            int digit = num % 10;
            reversedNum = reversedNum * 10 + digit;
            num /= 10;
        }

        return originalNum == reversedNum;
    }

}
