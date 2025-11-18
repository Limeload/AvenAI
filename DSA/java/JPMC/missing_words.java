/*
Julia and Samantha are playing with strings. Julia has a string S, and Samantha has a string T which is a subsequence of string S. They are trying to find out what words are missing in T.
Help Julia and Samantha to solve the problem. List all the missing words in T, such that inserting them at the appropriate positions in T, in the same order, results in the string S.
Constraints
1 <= |T| <= |S| <= 106, where |X| denotes the length of string X.
The length of each word will be less than 15.

Function Parameter
You are given a function missingWords that takes the strings S and T as its arguments.

Function Return Value
Return an array of the missing words.

Sample Input
I am using hackerrank to improve programming
am hackerrank to improve
Sample Output
I
using
programming
Explanation
Missing words are:
1. I
2. using
3. programming
 */

import java.util.ArrayList;
import java.util.List;

class Solution {

    public static List<String> missingWords(String S, String T) {
        List<String> missingWords = new ArrayList<>();
        int i = 0, j = 0;
        while (i < S.length() && j < T.length()) {
            if (S.charAt(i) == T.charAt(j)) {
                i++;
                j++;
            } else {
                // Find the word starting from i in S that isn't in T
                int k = i;
                while (k < S.length() && !Character.isWhitespace(S.charAt(k))) {
                    k++;
                }
                missingWords.add(S.substring(i, k));
                i = k;
            }
        }
        // Add any remaining words in S
        while (i < S.length()) {
            int k = i;
            while (k < S.length() && !Character.isWhitespace(S.charAt(k))) {
                k++;
            }
            missingWords.add(S.substring(i, k));
            i = k;
        }
        return missingWords;
    }

    public static void main(String[] args) {
        String S = "I am using hackerrank to improve programming";
        String T = "am hackerrank to improve";
        List<String> missingWords = missingWords(S, T);
        System.out.println("Missing words:");
        for (String word : missingWords) {
            System.out.println(word);
        }
    }
}


// Solution from github
class Solution1 {
public static List<String> missingWords(String S, String T) {
    List<String> missing = new ArrayList<>();
    String[] a = S.split(" ");
    String[] b = T.split(" ");

    for (int i = 0, j = 0; i < a.length; i++) {
      if (!a[i].equals(b[j])) {
        missing.add(a[i]);
      } else {
        j++;
      }
    }
    return missing;
  }
}
