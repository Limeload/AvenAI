/*
 The numbers 1 to 5 written out in words are
 One, Two, Three, Four, Five
First character of each word will be capital letter for example:
 104382426112 is One Hundred Four Billion Three Hundred Eighty Two Million Four Hundred Twenty Six Thousand One Hundred Twelve.
Given a number, you have to write it in words.
 */

package Hackerrank;

import java.util.*;

public class Num_to_words {

       private static String[] digits = {"", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
                "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"};

       private static String[] tens = {"", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"};

        // public static void main(String[] args) {
        //     /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */


        public static void word(int num) {
            if (num / 100 > 0) {
                System.out.print(digits[num / 100] + " Hundred ");
            }
            if ((num % 100) < 20 && (num % 100) > 0) {
                System.out.print(digits[num % 100] + " ");
            } else if ((num / 10) % 10 > 0) {
                System.out.print(tens[(num / 10) % 10] + " ");
                if (num % 10 > 0) {
                    System.out.print(digits[num % 10] + " ");
                }
            }
        }

        public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
            int t = scanner.nextInt();
            while (t-- > 0) {
                long num = scanner.nextLong();
                int tn = (int) (num / 1000000000000L);
                int bn = (int) ((num / 1000000000L) % 1000);
                int mn = (int) ((num / 1000000L) % 1000);
                int th = (int) ((num / 1000L) % 1000);
                int hd = (int) (num % 1000);
                if ((tn + bn + mn + th + hd) == 0) {
                    System.out.print("Zero");
                }
                if (tn > 0) {
                    word(tn);
                    System.out.print("Trillion ");
                }
                if (bn > 0) {
                    word(bn);
                    System.out.print("Billion ");
                }
                if (mn > 0) {
                    word(mn);
                    System.out.print("Million ");
                }
                if (th > 0) {
                    word(th);
                    System.out.print("Thousand ");
                }
                if (hd > 0) {
                    word(hd);
                }
                System.out.println();
            }
        }


    }
