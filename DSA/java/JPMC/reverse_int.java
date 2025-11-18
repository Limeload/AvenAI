/*
Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-231, 231 - 1], then return 0.

Assume the environment does not allow you to store 64-bit integers (signed or unsigned).
 */

class Solution {
    public int reverse(int x) {
        int reversed = 0;
        int original = Math.abs(x);

        while (original > 0) {
            int digit = original % 10;

            // Check overflow before updating reversed
            if (reversed > Integer.MAX_VALUE / 10 || (reversed == Integer.MAX_VALUE / 10 && digit > 7)) {
                return 0;
            }

            reversed = reversed * 10 + digit;
            original /= 10;
        }

        return x < 0 ? -reversed : reversed;
    }
}
