package Hackerrank;
/*

If we list all the natural numbers below 10 that are multiples of 3 or 5 , we get 3, 5, 6 and 9. The sum of these multiples is 23.
Find the sum of all the multiples of 3 or 5 below N.

// Input Format
First line contains T that denotes the number of test cases. This is followed by T lines, each containing an integer, N.

// Output Format
For each test case, print an integer that denotes the sum of all the multiples of 3 or 5 below N.

*/

import java.util.*;

public class Multiples_of_3and5 {

    public static void main(String[] args) {
        try (Scanner in = new Scanner(System.in)) {
            int t = in.nextInt();
             while(t-- > 0){
                 long n = in.nextLong();
                 n = n - 1;
                 long S3 = sum(n,3);
                 long S5 = sum(n,5);
                 long S15 = sum(n,15);
                 System.out.println(S3+S5-S15);

             }
        }
    }
    static long sum(long n, int k){
    return k * ((n/k) * ((n/k) + 1)) /2;
}
}
