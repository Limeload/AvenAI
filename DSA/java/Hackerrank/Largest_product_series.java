package Hackerrank;
/*

Find the greatest product of K consecutive digits in the N digit number.

// Input Format
First line contains T that denotes the number of test cases.
First line of each test case will contain two integers N & K.
Second line of each test case will contain a N digit integer.

// Output Format
Print the required answer for each test case.

 */

import java.util.*;

public class Largest_product_series {

    public static void main(String[] args) {
        try (Scanner in = new Scanner(System.in)) {
            int t = in.nextInt();
            for(int a0 = 0; a0 < t; a0++){
                int n = in.nextInt();
                int k = in.nextInt();
                String num = in.next();
                int max=1;
            for(int i=0;i<n-k;i++){
                int max2=1;
                for(int j=i;j<i+k;j++){
                  int a=(int)num.charAt(j)-'0';

                  max2*=a;
                }
                max=Math.max(max2,max);
                if(max==1){
                    max=0;
                }
            }
            System.out.println(max);
            }
        }
    }
}
