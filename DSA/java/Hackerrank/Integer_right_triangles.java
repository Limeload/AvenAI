/*
 If p is the perimeter of a right angle triangle with integral length sides, {a,b,c}, there are exactly three solutions for p = 120.
{20,48,52}, {24,45,51}, {30,40,50}
For which value of p ≤ 1000, is the number of solutions maximised?

Answer : 840
 */


package Hackerrank;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Integer_right_triangles {
        public static void main(String[] args) {
            int n = 5 * (int)Math.pow(10, 6);
            int[] answers = new int[n + 1];

            for (int t = 1; t * t <= n; t += 2) {
                for (int s = t + 2; s * s <= n; s += 2) {
                    if (gcd(s, t) == 1) {
                        for (int i = s * (s + t); i <= n; i += s * (s + t)) {
                            answers[i]++;
                        }
                    }
                }
            }

            int maxTri = 0;
            int answer = 0;
            List<Integer> finalAnswers = new ArrayList<>();

            for (int i = 0; i <= n; i++) {
                int value = answers[i];
                if (value > maxTri) {
                    answer = i;
                    maxTri = value;
                }
                finalAnswers.add(answer);
            }

            Scanner scanner = new Scanner(System.in);
            int q = Integer.parseInt(scanner.nextLine());
            for (int i = 0; i < q; i++) {
                n = Integer.parseInt(scanner.nextLine());
                System.out.println(finalAnswers.get(n));
            }
        }

        static int gcd(int a, int b) {
            while (b != 0) {
                int temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }

}
