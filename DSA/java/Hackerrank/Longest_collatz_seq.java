/*
The following iterative sequence is defined for the set of positive integers:
n → n/2 (n is even)
n → 3n + 1 (n is odd)
Using the rule above and starting with 13, we generate the following sequence:
13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1
It can be seen that this sequence (starting at 13 and finishing at 1) contains 10 terms. Although it has not been proved yet (Collatz Problem), it is thought that all starting numbers finish at 1.
Which starting number, under one million, produces the longest chain?
NOTE: Once the chain starts the terms are allowed to go above one million.

Answer : 837799
 */


package Hackerrank;

import java.util.*;

public class Longest_collatz_seq {
    public static void main(String[] args) {
        try (/* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
Scanner in = new Scanner(System.in)) {
    int t = in.nextInt();
    int result = 0;
    int maxcount = 0;
    int [] arr = new int[(int) (5 * Math.pow(10, 6) + 1)];
    for(int i=2;i<=3732423;i++) {
        int count = steps(i,0);
        if(count > maxcount) {
            result = i;
            maxcount = count;
        }
        else if(count == maxcount) {
            result = i;
        }
        arr[i] = result;
    }
    for(int a0 = 0; a0 < t; a0++){
        int no = in.nextInt();

        if(no > 3732423){
            System.out.println(3732423);
        }else{
            System.out.println(arr[no]);
        }
    }
}
    }
    public static int steps(long num,int count) {
        while(num !=1) {
            if(num % 2 == 0) {
                count++;
                num = num / 2;
            }
            else {
                count++;
                num = num*3 + 1;
            }
        }
        return count;
}
}

