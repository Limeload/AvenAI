import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;

/*
 You are given a string s of even length consisting of digits from 0 to 9, and two integers a and b.

You can apply either of the following two operations any number of times and in any order on s:

Add a to all odd indices of s (0-indexed). Digits post 9 are cycled back to 0. For example, if s = "3456" and a = 5, s becomes "3951".
Rotate s to the right by b positions. For example, if s = "3456" and b = 1, s becomes "6345".
Return the lexicographically smallest string you can obtain by applying the above operations any number of times on s.

A string a is lexicographically smaller than a string b (of the same length) if in the first position where a and b differ, string a has a letter that appears earlier in the alphabet than the corresponding letter in b. For example, "0158" is lexicographically smaller than "0190" because the first position they differ is at the third letter, and '5' comes before '9'.
 */

class Solution {
    public String findLexSmallestString(String s, int a, int b) {
        Set<String> taken = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        queue.add(s);
        taken.add(s);

        int n = s.length();
        String res = s;
        while(queue.size() > 0) {
            String curr = queue.remove();

            res = (curr.compareTo(res) < 0) ? curr : res;

            String rotate = curr.substring(n-b) + curr.substring(0, n-b);
            String add = addNumber(curr, a, n);

            if(taken.add(rotate)) {
                queue.add(rotate);
            }

            if(taken.add(add)) {
                queue.add(add);
            }
        }
        return res;
    }

    public String addNumber(String s, int a, int n) {
        char[] c = s.toCharArray();

        for(int i=1; i<n; i+=2) {
            c[i] = (char)('0' + ((c[i]-'0')+a)%10);
        }
        return String.valueOf(c);
    }

}
