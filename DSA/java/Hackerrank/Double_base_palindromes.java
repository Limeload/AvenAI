/*
The decimal number, 585 = 10010010012 (binary), is palindromic in both bases.
Find the sum of all numbers, less than one million, which are palindromic in base 10 and base 2.
(Please note that the palindromic number, in either base, may not include leading zeros.)

Answer : 872187
 */


package Hackerrank;

import java.util.Scanner;
import java.util.Stack;

public class Double_base_palindromes {

    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
         Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int k = in.nextInt();
        long res = 0;

        for(int i=1;i<n;i++)
        {
            if(isPallindrome(String.valueOf(i)) && isPallindrome(getNumberInGivenBase(i, k)))
                res+=i;
        }
        System.out.println(res);
    }
    public static boolean isPallindrome(String s)
    {
        String reverse = new StringBuffer(s).reverse().toString();
        return s.equals(reverse);
    }
    public static String getNumberInGivenBase(int n, int k)
    {
        Stack<Integer> s = new Stack<Integer>();
        while(n!=0)
        {
            s.push(n%k);
            n/=k;
        }
        StringBuffer sb = new StringBuffer();
        while(!s.isEmpty())
        {
            sb.append(s.pop());
        }
        return new String(sb);
    }
}
