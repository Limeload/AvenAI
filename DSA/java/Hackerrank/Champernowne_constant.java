/*
An irrational decimal fraction is created by concatenating the positive integers:
0.123456789101112131415161718192021...
It can be seen that the 12th digit of the fractional part is 1.
If dn represents the nth digit of the fractional part, find the value of the following expression.
d1 × d10 × d100 × d1000 × d10000 × d100000 × d1000000

 */

package Hackerrank;

import java.util.Scanner;

public class Champernowne_constant {
    private static int getDigit(long x) {
        int digits = 1;
        long range = 9;
        long first = 1;
        long skip = 0;
        while(skip + digits * range < x) {
            skip += digits * range;
            digits++;
            range *= 10;
            first *= 10;
        }
        while(range > 0) {
            while(skip + digits * range < x) {
                skip += digits * range;
                first += range;
            }
            range /= 10;
        }
        while(skip + digits < x) {
            first++;
            skip += digits;
        }
        x -= skip;
        x--;
        char s = String.valueOf(first).charAt((int) x);
        return s - '0';
    }

    public static void main(String[] args) {
        try(Scanner sc = new Scanner(System.in)) {
            int T = sc.nextInt();
            while(T-- > 0) {
                int product = 1;
                for(int i = 0; i < 7; i++) {
                    long pos = sc.nextLong();
                    product *= getDigit(pos);
                }
                System.out.println(product);
            }
        }
    }
}
