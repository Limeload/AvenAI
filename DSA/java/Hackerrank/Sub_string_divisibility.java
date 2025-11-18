/*
The number, 1406357289, is a 0 to 9 pandigital number because it is made up of each of the digits 0 to 9 in some order, but it also has a rather interesting sub-string divisibility property.
Let d1 be the 1st digit, d2 be the 2nd digit, and so on. In this way, we note the following:
d2d3d4=406 is divisible by 2
d3d4d5=063 is divisible by 3
d4d5d6=635 is divisible by 5
d5d6d7=357 is divisible by 7
d6d7d8=572 is divisible by 11
d7d8d9=728 is divisible by 13
d8d9d10=289 is divisible by 17
Find the sum of all 0 to 9 pandigital numbers with this property.

Answer : 16695334890
 */

package Hackerrank;

import java.util.ArrayList;
import java.util.Scanner;

public class Sub_string_divisibility {
    private static ArrayList<String> panDigitalList = null;
    public static void main(String[] args) {
        long startTime = System.nanoTime();
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        StringBuffer sb = new StringBuffer();
        for(int i=0;i<=n;i++)
            sb.append(i);

        getPermutations(new String(sb));
        System.out.println(getSatisfiedPropertySum(panDigitalList, n));
    }

    public static long getSatisfiedPropertySum(ArrayList<String> list, int n)
    {
        long sum=0;
        int[] arr = {2, 3, 5, 7, 11, 13, 17};
        if(n!=9)
        {
            for(int i=0;i<list.size();i++)
            {
                int ws = 1;
                int we = ws+3;
                int arrIndex=0;
                boolean broken = false;
                while(we<=list.get(i).length())
                {
                    int val = Integer.valueOf(list.get(i).substring(ws, we));
                    if(val%arr[arrIndex]!=0)
                    {
                        broken=true;
                        break;
                    }
                    arrIndex+=1;
                    ws+=1;we+=1;
                }
                if(!broken) sum+=Integer.valueOf(list.get(i));
            }
        }
        else
        {
            for(int i=0;i<list.size();i++)
            {
                if(list.get(i).charAt(5) == '5')
                {
                    int ws = 1;
                    int we = ws+3;
                    int arrIndex=0;
                    boolean broken = false;
                    while(we<=list.get(i).length())
                    {
                        int val = Integer.valueOf(list.get(i).substring(ws, we));
                        if(val%arr[arrIndex]!=0)
                        {
                            broken=true;
                            break;
                        }
                        arrIndex+=1;
                        ws+=1;we+=1;
                    }
                    if(!broken) sum+=Long.valueOf(list.get(i));
                }
            }
        }

        return sum;
    }

    public static void getPermutations(String s)
    {
        panDigitalList = new ArrayList<String>();
        getPermutationsUtil(new StringBuilder(s), 0, s.length() - 1);
    }

    private static void getPermutationsUtil(StringBuilder s, int start, int end)
    {
        if (start == end)
            panDigitalList.add(s.toString());
        else {
            for (int i = start; i <= end; i++) {
                swap(s, start, i);
                getPermutationsUtil(s, start + 1, end);
                swap(s, start, i);
            }
        }
    }

    private static void swap(StringBuilder s, int i, int j)
    {
        char tmp = s.charAt(i);
        s.setCharAt(i, s.charAt(j));
        s.setCharAt(j, tmp);
    }
}
