/*
A permutation is an ordered arrangement of objects. For example, dadc is one possible permutation of the word abcd. If all of the permutations are listed alphabetically, we call it lexicographic order. The lexicographic permutations of abc are:
 abc acb bac bca cab cba
What is the Nth lexicographic permutation of the word abcdefghijklm ?
*/

package Hackerrank;


import java.util.*;

public class Lexicographic_permutations {
       static long[] fact = new long[14];

    public static void main(String[] args) {
        factorialFill();

        Scanner scanner = new Scanner(System.in);
        int t = scanner.nextInt();

        for (int a0 = 0; a0 < t; a0++) {
            long n = scanner.nextLong();
            int[] arrc = new int[13];
            factorialNum(n - 1, arrc);
            printPermutation(arrc);
            System.out.println();
        }
        scanner.close();
    }

    static void factorialFill() {
        fact[0] = 1;
        for (int i = 1; i < 14; i++) {
            fact[i] = i * fact[i - 1];
        }
    }

    static void factorialNum(long n, int[] arrc) {
        long tmp = n;
        int index = 0;
        for (int i = 13; i >= 0; i--) {
            if (fact[i] <= tmp) {
                index = i;
                break;
            }
        }

        long q, r;
        while (index >= 0) {
            q = tmp / fact[index];
            r = tmp % fact[index];
            arrc[index] = (int) q;
            tmp = r;
            index--;
        }
    }

    static void updateList(char[] str, int index) {
        for (int i = index + 1; i <= 12; i++) {
            str[i - 1] = str[i];
        }
    }

    static void printPermutation(int[] arrc) {
        char[] str = "abcdefghijklm".toCharArray();
        for (int i = 12; i >= 0; i--) {
            System.out.print(str[arrc[i]]);
            updateList(str, arrc[i]);
        }
    }
}

