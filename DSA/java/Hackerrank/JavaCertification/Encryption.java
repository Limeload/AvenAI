/*
An English text needs to be encrypted using the following encryption scheme.
First, the spaces are removed from the text. Let  be the length of this text.
Then, characters are written into a grid, whose rows and columns have the following constraints:

Example

 */

import java.io.*;

class Result {

    /*
     * Complete the 'encryption' function below.
     *
     * The function is expected to return a STRING.
     * The function accepts STRING s as parameter.
     */

    public static String encryption(String s) {
    // Write your code here
double srt = Math.sqrt(s.length());
        int floor = (int)Math.floor(srt);
        int ceil = (int)Math.ceil(srt);
        int si = 0;
        String k = "";

        while(floor*ceil < s.length()){
           floor++;
        }

        char[][] grid = new char[floor][ceil];
        for (int i = 0; i < floor; i++) {
            for (int j = 0; j < ceil; j++) {
                if(s.length() > si){
                    grid[i][j] = s.charAt(si++);
                }
            }
        }
        for (int i = 0; i < ceil; i++) {
            for (int j = 0; j < floor ; j++) {
                if(Character.isLetter(grid[j][i])){
                    k+=grid[j][i];
                }
                if(j==floor-1){
                    k+=' ';
                }
            }
        }
        return k;
    }
}

public class Encryption {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(System.getenv("OUTPUT_PATH")));

        String s = bufferedReader.readLine();

        String result = Result.encryption(s);

        bufferedWriter.write(result);
        bufferedWriter.newLine();

        bufferedReader.close();
        bufferedWriter.close();
    }
}
