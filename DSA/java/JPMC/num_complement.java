// 476. Number Complement
// Easy
// Topics
// conpanies icon
// Companies
// The complement of an integer is the integer you get when you flip all the 0's to 1's and all the 1's to 0's in its binary representation.

// For example, The integer 5 is "101" in binary and its complement is "010" which is the integer 2.
// Given an integer num, return its complement.

 

// Example 1:

// Input: num = 5
// Output: 2
// Explanation: The binary representation of 5 is 101 (no leading zero bits), and its complement is 010. So you need to output 2.
// Example 2:

// Input: num = 1
// Output: 0
// Explanation: The binary representation of 1 is 1 (no leading zero bits), and its complement is 0. So you need to output 0.
 

// Constraints:

// 1 <= num < 231

class Solution {
    public int findComplement(int num) {
        // Find the number of bits needed to represent num
        int numBits = 0;
        int temp = num;
        while (temp > 0) {
            numBits++;
            temp >>= 1;
        }
        
        // Create a mask with all 1's for the significant bits
        // For example, if numBits = 3, mask = 111 (binary) = 7
        int mask = (1 << numBits) - 1;
        
        // XOR with mask to flip all bits
        return num ^ mask;
    }
}
