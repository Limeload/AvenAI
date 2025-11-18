/*
145 is a curious number, as 1! + 4! + 5! = 1 + 24 + 120 = 145.
Find the sum of all numbers which are equal to the sum of the factorial of their digits.
Note: as 1! = 1 and 2! = 2 are not sums they are not included.

Answer : 40730
 */

package Hackerrank;

import java.math.BigInteger;
import java.util.Scanner;

public class Digit_factorials {

    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        long result = 0;
        if(n<10) System.out.println(0);
        else
        {
            for(int i=10;i<=n;i++)
            {
                int temp=i;
                BigInteger factorialSum = BigInteger.valueOf(0);
                while(temp!=0)
                {
                    int digit = temp%10;
                    factorialSum = factorialSum.add(getFactorial(digit));
                    temp/=10;
                }
                if(factorialSum.mod(BigInteger.valueOf(i)).compareTo(BigInteger.valueOf(0))==0)
                    result+=i;
            }
            System.out.println(result);
        }
    }
    public static BigInteger getFactorial(int n)
    {
        BigInteger bi = BigInteger.valueOf(1);
        for(int j=2;j<=n;j++)
        {
            bi = bi.multiply(BigInteger.valueOf(j));
        }
        return bi;
    }
}
