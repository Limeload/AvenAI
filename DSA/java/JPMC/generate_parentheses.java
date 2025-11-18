import java.util.ArrayList;
import java.util.List;

/*
Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.


 */

class Solution {
    public List<String> generateParenthesis(int n) {

        List<String> result = new ArrayList<>();
        backtrack(result, "", 0, 0, n);
        return result;

    }

    private void backtrack(List<String> result, String currentString, int openCount, int closeCount, int n) {
        if (openCount == n && closeCount == n) {
            result.add(currentString);
            return;
        }

        if (openCount < n) {
            backtrack(result, currentString + "(", openCount + 1, closeCount, n);
        }

        if (closeCount < openCount) {
            backtrack(result, currentString + ")", openCount, closeCount + 1, n);
        }
    }

}
