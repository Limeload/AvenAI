/*
The Fibonacci sequence is defined by the recurrence relation:
Fn = Fn−1 + Fn−2, where F1 = 1 and F2 = 1.
Hence the first 12 terms will be:
F1 = 1
F2 = 1
F3 = 2
F4 = 3
F5 = 5
F6 = 8
F7 = 13
F8 = 21
F9 = 34
F10 = 55
F11 = 89
F12 = 144
The 12th term, F12, is the first term to contain three digits.
What is the index of the first term in the Fibonacci sequence to contain 1000 digits?

Answer : 4782
 */

package Hackerrank;

import java.util.*;

public class Ndigit_fibonacci_num {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int t = in.nextInt();
        while (t-- > 0) {
            int a0 = in.nextInt();
            if (lastBitNum <= a0) {
                calc(a0);
            }
            System.out.println(result[a0]);
        }
        in.close();
    }

    static int LENGTH = 10000;

    static int DIGIT_NUMBER = 5001;

    static int[][] a = new int[2][DIGIT_NUMBER];

    static int[] result = new int[DIGIT_NUMBER];// store the result

    static int lastBitNum = 1;// digit N

    static int lastArrayIndex = 2;// which term

    /**
     * initial
     */
    static {
        a[0][0] = 1;
        a[1][0] = 1;
    }

    static void calc(int i) {
//        System.out.println(LocalDateTime.now());
        while (lastBitNum <= i) {
            lastArrayIndex = find(lastBitNum, lastArrayIndex);
//            System.out.println("lastBitNum : " + lastBitNum + " index : " + lastArrayIndex);
            lastBitNum++;
        }
//        System.out.println(LocalDateTime.now());
    }

    /**
     *
     * @param lastBitNum
     * @param lastArrayIndex
     * @return
     */
    private static int find(int lastBitNum, int lastArrayIndex) {
        int[] tmp = new int[DIGIT_NUMBER];
        while (true) {
            tmp = nextFibonacciNum(a[0], a[1]);
            a[0] = a[1];
            a[1] = tmp;
            int bitNum = calcBit(tmp);
            lastArrayIndex++;
            if (bitNum == lastBitNum) {
                result[lastBitNum] = lastArrayIndex;
                return lastArrayIndex;
            }
        }
    }

    static int calcBit(int[] a) {
        int index = 0;
        for (int i = a.length - 1; i >= 0; i--) {
            if (a[i] > 0) {
                return i + 1;
            }
        }
        return index;
    }

    private static int[] nextFibonacciNum(int[] a, int[] b) {
        int[] c = new int[a.length];
        int carry = 0;
        for (int i = 0; i < DIGIT_NUMBER; i++) {
            int result = (a[i] + b[i] + carry);
            int remainder = result % 10;
            c[i] = remainder;
            carry = result / 10;
        }
        return c;
    }
}
