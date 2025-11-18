/*
We shall say that an n-digit number is pandigital if it makes use of all the digits 1 to n exactly once; for example, the 5-digit number, 15234, is 1 through 5 pandigital.
The product 7254 is unusual, as the identity, 39 × 186 = 7254, containing multiplicand, multiplier, and product is 1 through 9 pandigital.
Find the sum of all products whose multiplicand/multiplier/product identity can be written as a 1 through 9 pandigital.
HINT: Some products can be obtained in more than one way so be sure to only include it once in your sum.

Answer : 45228
 */


package Hackerrank;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Scanner;

public class Pandigital_products {

    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        long endVal = (long)Math.pow(10, n)-1;
        int end = (int)Math.sqrt(endVal);
        HashMap<Integer, Integer> nMap = new HashMap<Integer, Integer>();
        for(int i=1;i<=n;i++) nMap.put(i, 0);
        long productSum = 0;

        HashSet<Integer> set = new HashSet<Integer>();
        for(int i=1;i<=end;i++)
        {
            for(int j=i;j<=end;j++)
            {
                int product = i*j;
                int iLength = Integer.toString(i).length();
                int jLength = Integer.toString(j).length();
                int productLength = Integer.toString(product).length();
                if(iLength + jLength + productLength == n)
                {
                    if(isPanDigital(i, j, product, nMap))
                        set.add(product);
                }
                else if(iLength + jLength + productLength>n) break;
            }
        }
        for(Integer i : set)
            productSum+=i;

        System.out.println(productSum);
    }
    public static boolean isPanDigital(int multiplicand, int multiplier, int product, HashMap<Integer, Integer> nMap)
    {
        HashMap<Integer, Integer> countMap = new HashMap<Integer, Integer>();
        while(multiplicand!=0)
        {
            int digit = multiplicand%10;
            if(!countMap.containsKey(digit) && nMap.containsKey(digit))
            {
                countMap.put(digit,1);
                multiplicand/=10;
            }
            else return false;
        }
        while(multiplier!=0)
        {
            int digit = multiplier%10;
            if(!countMap.containsKey(digit) && nMap.containsKey(digit))
            {
                countMap.put(digit,1);
                multiplier/=10;
            }
            else return false;
        }
        while(product!=0)
        {
            int digit = product%10;
            if(!countMap.containsKey(digit) && nMap.containsKey(digit))
            {
                countMap.put(digit,1);
                product/=10;
            }
            else return false;
        }
        return true;
    }
    
}
