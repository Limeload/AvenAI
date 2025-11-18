/*
In the United Kingdom the currency is made up of pound (£) and pence (p). There are eight coins in general circulation:
1p, 2p, 5p, 10p, 20p, 50p, £1 (100p), and £2 (200p).
It is possible to make £2 in the following way:
1×£1 + 1×50p + 2×20p + 1×5p + 1×2p + 3×1p
How many different ways can £2 be made using any number of coins?

Answer : 73682
 */

package Hackerrank;

import java.math.BigInteger;
import java.util.Scanner;

public class Coin_sums {
    public static void main(String args[])
    {
        BigInteger table[]= new BigInteger[100001];

    int coin[]= new int[]{1,2,5,10,20,50,100,200};
    for(int i=0;i<table.length;i++)
    {
        table[i]=BigInteger.ZERO;
    }
    table[0]=BigInteger.ONE;
    for(int i=0;i<8;i++)
    {
        for(int j=coin[i];j<table.length;j++)
        {
            table[j]=table[j].add(table[j-coin[i]]);
        }
    }
        Scanner sc= new Scanner(System.in);
        int num=Integer.parseInt(sc.nextLine());
        for(int i=0;i<num;i++)
        {
            int tem=Integer.parseInt(sc.nextLine());
            System.out.println(table[tem].mod(BigInteger.valueOf(1000000007)));
        }
    }
}
