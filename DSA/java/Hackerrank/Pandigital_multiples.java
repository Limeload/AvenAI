/*
Take the number 192 and multiply it by each of 1, 2, and 3:
192 × 1 = 192
192 × 2 = 384
192 × 3 = 576
By concatenating each product we get the 1 to 9 pandigital, 192384576. We will call 192384576 the concatenated product of 192 and (1,2,3)
The same can be achieved by starting with 9 and multiplying by 1, 2, 3, 4, and 5, giving the pandigital, 918273645, which is the concatenated product of 9 and (1,2,3,4,5).
What is the largest 1 to 9 pandigital 9-digit number that can be formed as the concatenated product of an integer with (1,2, ... , n) where n > 1?

Answer : 932718654
 */

package Hackerrank;

import java.util.HashMap;
import java.util.Scanner;

public class Pandigital_multiples {

    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int k = in.nextInt();

        for(int i=2;i<n;i++)
        {
            StringBuffer sb = new StringBuffer();
            for(int j=1;j<=k;j++)
            {
                long product = i*j;
                sb.append(product);
                if(sb.length() == k && isKPanDigital(sb, k))
                    System.out.println(i);
            }
        }
    }

    public static boolean isKPanDigital(StringBuffer sb, int k)
    {
        HashMap<Integer, Integer> map = new HashMap<Integer, Integer>();
        String s = sb.toString();
        for(int i=0;i<s.length();i++)
        {
            if(!map.containsKey(Character.getNumericValue(s.charAt(i))))
                map.put(Character.getNumericValue(s.charAt(i)), 1);
            else return false;
        }
        for(int i=1;i<=k;i++)
        {
            if(!map.containsKey(i)) return false;
        }
        return true;
    }
}
