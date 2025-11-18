/*
A unit fraction contains 1 in the numerator. The decimal representation of the unit fractions with denominators 2 to 10 are given:
1/2	= 	0.5
1/3	= 	0.(3)
1/4	= 	0.25
1/5	= 	0.2
1/6	= 	0.1(6)
1/7	= 	0.(142857)
1/8	= 	0.125
1/9	= 	0.(1)
1/10	= 	0.1
Where 0.1(6) means 0.166666..., and has a 1-digit recurring cycle. It can be seen that 1/7 has a 6-digit recurring cycle.
Find the value of d < 1000 for which 1/d contains the longest recurring cycle in its decimal fraction part.

Answer : 983
 */

package Hackerrank;

import java.util.*;

public class Reciprocal_cycles {
    public static void main(String[] args) {
    try (Scanner in = new Scanner(System.in)) {
        int t = in.nextInt();
        for (int a0 = 0; a0 < t; a0++) {
            int n = in.nextInt();
            run(n);
        }
    }
}

private static void run(int num) {
    HashMap<Integer, Integer> cycleLengths = new HashMap<>();
    int longestCycle = 0;
    int result = 0;
    for (int i = 2; i < num; i++) {
        int cycleLength = getCycleLength(i, cycleLengths);
        if (cycleLength > longestCycle) {
            longestCycle = cycleLength;
            result = i;
        }
    }
    System.out.println(result);
}

private static int getCycleLength(int d, HashMap<Integer, Integer> cycleLengths) {
    if (cycleLengths.containsKey(d)) {
        return cycleLengths.get(d);
    }

    int[] remainders = new int[d];
    int value = 1;
    int position = 0;

    while (remainders[value] == 0 && value != 0) {
        remainders[value] = position;
        value *= 10;
        value %= d;
        position++;
    }

    if (value == 0) {
        cycleLengths.put(d, 0);
        return 0; // Non-recurring decimal
    } else {
        int cycleLength = position - remainders[value];
        cycleLengths.put(d, cycleLength);
        return cycleLength;
    }
}
}


