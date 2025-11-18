import java.util.Stack;

/*
A bracket is considered to be any one of the following characters: (, ), {, }, [, or ].
Two brackets are considered to be a matched pair if the an opening bracket (i.e., (, [, or {) occurs to the left of a closing bracket (i.e., ), ], or }) of the exact same type. There are three types of matched pairs of brackets: [], {}, and ().
A matching pair of brackets is not balanced if the set of brackets it encloses are not matched. For example, {[(])} is not balanced because the contents in between { and } are not balanced. The pair of square brackets encloses a single, unbalanced opening bracket, (, and the pair of parentheses encloses a single, unbalanced closing square bracket, ].
Some examples of balanced brackets are []{}(), [({})]{}() and ({(){}[]})[].
By this logic, we say a sequence of brackets is considered to be balanced if the following conditions are met:
It contains no unmatched brackets.
The subset of brackets enclosed within the confines of a matched pair of brackets is also a matched pair of brackets.
Given  strings of brackets, determine whether each sequence of brackets is balanced. If a string is balanced, print YES on a new line; otherwise, print NO on a new line.
Function Description
Complete the isBalanced function in the editor below.
isBalanced has the following parameter(s):
- string expression: a string of brackets
Returns
- string: either YES or NO
 */

class Result {
public static String isBalanced(String expression) {
    // Write your code here
    Stack<Character> stack = new Stack<>();
    for (char c : expression.toCharArray()) {
        switch (c) {
            case '(':
            case '{':
            case '[':
                stack.push(c); // Push opening brackets onto the stack
                break;
            case ')':
                if (stack.isEmpty() || stack.pop() != '(') {
                    return "NO"; // Mismatched closing bracket
                }
                break;
            case '}':
                if (stack.isEmpty() || stack.pop() != '{') {
                    return "NO"; // Mismatched closing bracket
                }
                break;
            case ']':
                if (stack.isEmpty() || stack.pop() != '[') {
                    return "NO"; // Mismatched closing bracket
                }
                break;
            default:
                break; // Ignore non-bracket characters
        }
    }
    return stack.isEmpty() ? "YES" : "NO"; // Unbalanced if stack not empty
    }
}

