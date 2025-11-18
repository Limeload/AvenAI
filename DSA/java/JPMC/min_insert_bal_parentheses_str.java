import java.util.Stack;

/*
Given a parentheses string s containing only the characters '(' and ')'. A parentheses string is balanced if:

Any left parenthesis '(' must have a corresponding two consecutive right parenthesis '))'.
Left parenthesis '(' must go before the corresponding two consecutive right parenthesis '))'.
In other words, we treat '(' as an opening parenthesis and '))' as a closing parenthesis.

For example, "())", "())(())))" and "(())())))" are balanced, ")()", "()))" and "(()))" are not balanced.
You can insert the characters '(' and ')' at any position of the string to balance it if needed.

Return the minimum number of insertions needed to make s balanced.
 */

class Solution {
    public int minInsertions(String s) {
        Stack<Integer> stack = new Stack<>();
        int ans =0;
        for(int i =0;i<s.length();i++)
        {
            char ch = s.charAt(i);
            if(ch == '(')
            {
                if(stack.isEmpty() || stack.peek() == 2)
                stack.push(2);
                else{
                    stack.pop();
                    stack.push(2);
                    ans++;
                }
            }
            else if(ch == ')')
            {
                if(stack.isEmpty())
                {
                    stack.push(1);
                    ans++;
                }
                else if (stack.peek()==1)
                stack.pop();
                else if (stack.peek()==2)
                {
                    stack.pop();
                    stack.push(1);
                }
            }

        }
        while(!stack.isEmpty())
        {
            ans = ans + stack.peek();
            stack.pop();
        }
        return ans;
    }
}
