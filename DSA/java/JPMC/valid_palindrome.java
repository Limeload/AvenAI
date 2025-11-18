/*
A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.

 */


class Solution {
    public boolean isPalindrome(String s) {
       int left = 0, right = s.length() - 1;

    while (left < right) {
        char leftChar = Character.toLowerCase(s.charAt(left));
        char rightChar = Character.toLowerCase(s.charAt(right));

        if (!isAlphanumeric(leftChar) || !isAlphanumeric(rightChar)) {
            if (!isAlphanumeric(leftChar)) {
                left++;
            } else {
                right--;
            }
        } else

if (leftChar != rightChar) {
            return

false;
        } else {
            left++;
            right--;
        }
    }

    return

true;
}

private

boolean

isAlphanumeric(char c)

{
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
    }
}
