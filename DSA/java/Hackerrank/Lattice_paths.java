/*
Starting in the top left corner of a 2 X 2 grid, and only being able to move to the right and down, there are exactly 6 routes to the bottom right corner.

How many such routes are there through a N X M grid? As number of ways can be very large, print it modulo (10^9 + 7) .
 */


package Hackerrank;

import java.util.*;
import java.math.*;


public class Lattice_paths {

    public static void main(String[] args) {
        try (/* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner scanner = new Scanner(System.in)) {
            int T = scanner.nextInt(); // Read number of test cases
for (int i = 0; i < T; i++) {
                int n = scanner.nextInt(); // Read grid width
                int m = scanner.nextInt(); // Read grid height

                BigInteger totalPaths = calculateLatticePaths(n, m);
                System.out.println(totalPaths.mod(BigInteger.valueOf(1000000007)));
            }
        }
    }

    private static BigInteger calculateLatticePaths(int n, int m) {
        BigInteger factorial = BigInteger.valueOf(1);
        for (int i = 1; i <= n + m; i++) {
            factorial = factorial.multiply(BigInteger.valueOf(i));
        }

        BigInteger divisor = BigInteger.valueOf(1);
        for (int i = 1; i <= n; i++) {
            divisor = divisor.multiply(BigInteger.valueOf(i));
        }

        for (int i = 1; i <= m; i++) {
            divisor = divisor.multiply(BigInteger.valueOf(i));
        }

        BigInteger totalPaths = factorial.divide(divisor);
        return totalPaths;

    }
}
