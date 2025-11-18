/*
Euler discovered the remarkable quadratic formula:
n2+n+41
It turns out that the formula will produce 40 primes for the consecutive integer values 0≤n≤39
. However, when n=40,402+40+41=40(40+1)+41 is divisible by 41, and certainly when n=41,412+41+41 is clearly divisible by 41.
The incredible formula n2−79n+1601
was discovered, which produces 80 primes for the consecutive values 0≤n≤79. The product of the coefficients, −79 and 1601, is −126479.
Considering quadratics of the form:
n2+an+b
, where |a|<1000 and |b|≤1000

where |n|
is the modulus/absolute value of n
e.g. |11|=11 and |−4|=4
Find the product of the coefficients, a
and b, for the quadratic expression that produces the maximum number of primes for consecutive values of n, starting with n=0.

Answer : -59231
 */


package Hackerrank;

import java.util.*;

public class Quadratic_primes {
    //store the primes under 10000
    static boolean[] prime_array = new boolean[10000];

    static {
        for (int i = 2; i < 10000; i++) {
            if (isPrime(i)) {
                prime_array[i] = true;
            }
        }
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a0 = in.nextInt();
        int maxNumOfPrimes = 0;
        int resultA = 0;
        int resultB = 0;
        for (int a = -a0; a <= a0; a++) {
            for (int b = -a0; b <= a0; b++) {
                int count = 0;
                mainLoop: for (int n = 0;; n++) {
                    long r = n * n + a * n + b;
                    boolean re;
                    if (r < 0) {
                        break mainLoop;
                    }
                    if (r <= prime_array.length) {
                        re = prime_array[(int) r];
                    } else {
                        re = isPrime(r);
                    }
                    if (!re) {
                        break mainLoop;
                    }
                    count++;
                }
                if (count > maxNumOfPrimes) {
                    maxNumOfPrimes = count;
                    resultA = a;
                    resultB = b;
                }
            }
        }
        System.out.println(resultA + " " + resultB);
        in.close();
    }

    private static boolean isPrime(long r) {
        if (r < 2) {
            return false;
        }
        for (int i = 2; i * i <= r; i++) {
            if (r % i == 0) {
                return false;
            }
        }
        return true;
}

}
