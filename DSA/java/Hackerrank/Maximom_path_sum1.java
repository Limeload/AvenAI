/*
By starting at the top of the triangle below and moving to adjacent numbers on the row below, the maximum total from top to bottom is 23.
3
7 4
2 4 6
8 5 9 3
That is, 3 + 7 + 4 + 9 = 23.
Find the maximum total from top to bottom of the triangle below:
75
95 64
17 47 82
18 35 87 10
20 04 82 47 65
19 01 23 75 03 34
88 02 77 73 07 63 67
99 65 04 28 06 16 70 92
41 41 26 56 83 40 80 70 33
41 48 72 33 47 32 37 16 94 29
53 71 44 65 25 43 91 52 97 51 14
70 11 33 28 77 73 17 78 39 68 17 57
91 71 52 38 17 14 91 43 58 50 27 29 48
63 66 04 68 89 53 67 30 73 16 69 87 40 31
04 62 98 27 23 09 70 98 73 93 38 53 60 04 23
NOTE: As there are only 16384 routes, it is possible to solve this problem by trying every route. However, Problem 67, is the same challenge with a triangle containing one-hundred rows; it cannot be solved by brute force, and requires a clever method! ;o)

 */


package Hackerrank;

import java.util.*;


public class Maximom_path_sum1 {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t  = sc.nextInt();


        while (t-- > 0) {
            int n = sc.nextInt();

            // Create a 2D array to store the triangle of numbers
            int[][] arr = new int[n][];

            // Input values for each row of the array
            for (int i = 0; i < n; i++) {
                arr[i] = new int[i + 1]; // Initialize the array for the current row
                for (int j = 0; j <= i; j++) {
                    arr[i][j] = sc.nextInt(); // Input the value for the current element
                }
            }

            // Call the max function and print the result
            System.out.println(max(arr));
        }

    }

    public static int max(int[][] arr){
        int n = arr.length;
        int[][] dp = new int[n][20];
        for(int[] row: dp){
            Arrays.fill(row,-1);
        }
        return recursive(0,0,arr,n,dp);
    }

    private  static int recursive(int i, int j, int[][]arr,int n,int[][] dp){

        if(i< 0 || i>= n || j < 0 || j>= arr[i].length ){
            return 0;
        }
        if(dp[i][j] != -1){
            return dp[i][j];

        }
        int down = arr[i][j] + recursive(i + 1, j, arr, n,dp);
        int right = arr[i][j] + recursive(i + 1, j + 1, arr, n,dp);

        return dp[i][j]=Math.max(down, right);
    }
}
