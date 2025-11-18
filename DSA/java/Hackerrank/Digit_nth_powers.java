/*
Surprisingly there are only three numbers that can be written as the sum of fourth powers of their digits:
1634 = 14 + 64 + 34 + 44
8208 = 84 + 24 + 04 + 84
9474 = 94 + 44 + 74 + 44
As 1 = 14 is not a sum it is not included.
The sum of these numbers is 1634 + 8208 + 9474 = 19316.
Find the sum of all the numbers that can be written as the sum of fifth powers of their digits.

Answer : 443839
 */


package Hackerrank;

import java.util.Scanner;

public class Digit_nth_powers {
    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        {
        int n = new Scanner(System.in).nextInt();
        long sum=0;
        for(long i=(long)Math.pow(10,0);i<=(long)2*Math.pow(10,n);i++)
        {
            String ok=""+i;
            int add=0;
            for(int j=0;j<ok.length();j++)
            {
                add+=(long)Math.pow(Integer.valueOf(""+ok.charAt(j)),n);
            }
            if(add==i &&i!=1)
            {
                sum+=i;
            }
        }
        System.out.println(sum);
    }
    }
}
