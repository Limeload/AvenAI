/*
The nth term of the sequence of triangle numbers is given by, tn = ½n(n+1); so the first ten triangle numbers are:
1, 3, 6, 10, 15, 21, 28, 36, 45, 55, ...
By converting each letter in a word to a number corresponding to its alphabetical position and adding these values we form a word value. For example, the word value for SKY is 19 + 11 + 25 = 55 = t10. If the word value is a triangle number then we shall call the word a triangle word.
Using words.txt (right click and 'Save Link/Target As...'), a 16K text file containing nearly two-thousand common English words, how many are triangle words?

Answer : 162
 */

package Hackerrank;

import java.util.Scanner;

public class Coded_triangle_nums {
    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner in = new Scanner(System.in);
        int numberOfTestCases = in.nextInt();
        for(int i=0;i<numberOfTestCases;i++)
        {
            long n = in.nextLong();
            long perfectSquareNum = 8*n+1;
            if(isPerfectSquare(perfectSquareNum))
            {
                double term = 0.5*(Math.sqrt(perfectSquareNum))-0.5;
                System.out.println((long)term);
            }
            else System.out.println("-1");
        }
    }

    private static boolean isPerfectSquare(long n)
    {
        long root = (long)Math.sqrt(n);
        return n == root*root;
    }
}
