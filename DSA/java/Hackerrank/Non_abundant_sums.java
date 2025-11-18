/*
A perfect number is a number for which the sum of its proper divisors is exactly equal to the number. For example, the sum of the proper divisors of 28 would be 1 + 2 + 4 + 7 + 14 = 28, which means that 28 is a perfect number.
A number n is called deficient if the sum of its proper divisors is less than n and it is called abundant if this sum exceeds n.
As 12 is the smallest abundant number, 1 + 2 + 3 + 4 + 6 = 16, the smallest number that can be written as the sum of two abundant numbers is 24. By mathematical analysis, it can be shown that all integers greater than 28123 can be written as the sum of two abundant numbers. However, this upper limit cannot be reduced any further by analysis even though it is known that the greatest number that cannot be expressed as the sum of two abundant numbers is less than this limit.
Given N, print YES if it can be expressed as sum of two abundant numbers, else print NO.
 */


package Hackerrank;

import java.util.*;

public class Non_abundant_sums {
    static int limit = 28123;
    static boolean[] abundant_numbers = new boolean[limit];
    //find out all the abundant numbers below 28123
    static {
        // System.out.println(LocalDateTime.now());
        for (int i = 1; i <= limit; i++) {
            if (i > 6 && i % 6 == 0) {
                abundant_numbers[i] = true;
            } else {
                int sum = foo(i);
                if (i < sum) {
                    abundant_numbers[i] = true;
                }
            }
        }
        // System.out.println(LocalDateTime.now());
    }

    //get the sum of the proper divisors
    private static int foo(int N) {
        int sum = 0;
        for (int i = 2; i * i < N; i++) {
            if (N % i == 0)
                sum += (i + N / i);
        }
        if (sum == 0)
            return sum;
        // add 1
        sum++;
        return sum;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int t = in.nextInt();
        while (t-- > 0) {
            int a0 = in.nextInt();
            if (a0 > limit) {
                System.out.println("YES");
            } else {
                if (getResult(a0)) {
                    System.out.println("YES");
                } else {
                    System.out.println("NO");
                }
            }
        }
        in.close();
    }

    private static boolean getResult(int a0) {
        int i = (a0 + 1) / 2;
        for (int k = 1; k <= i; k++) {
            if (abundant_numbers[k] && abundant_numbers[a0 - k]) {
                return true;
            }
        }
        return false;
    }
}



