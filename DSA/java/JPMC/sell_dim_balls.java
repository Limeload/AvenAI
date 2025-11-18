// 1648. Sell Diminishing-Valued Colored Balls
// Medium
// Topics
// conpanies icon
// Companies
// Hint
// You have an inventory of different colored balls, and there is a customer that wants orders balls of any color.

// The customer weirdly values the colored balls. Each colored ball's value is the number of balls of that color you currently have in your inventory. For example, if you own 6 yellow balls, the customer would pay 6 for the first yellow ball. After the transaction, there are only 5 yellow balls left, so the next yellow ball is then valued at 5 (i.e., the value of the balls decreases as you sell more to the customer).

// You are given an integer array, inventory, where inventory[i] represents the number of balls of the ith color that you initially own. You are also given an integer orders, which represents the total number of balls that the customer wants. You can sell the balls in any order.

// Return the maximum total value that you can attain after selling orders colored balls. As the answer may be too large, return it modulo 109 + 7.

 

// Example 1:


// Input: inventory = [2,5], orders = 4
// Output: 14
// Explanation: Sell the 1st color 1 time (2) and the 2nd color 3 times (5 + 4 + 3).
// The maximum total value is 2 + 5 + 4 + 3 = 14.
// Example 2:

// Input: inventory = [3,5], orders = 6
// Output: 19
// Explanation: Sell the 1st color 2 times (3 + 2) and the 2nd color 4 times (5 + 4 + 3 + 2).
// The maximum total value is 3 + 2 + 5 + 4 + 3 + 2 = 19.
 

// Constraints:

// 1 <= inventory.length <= 105
// 1 <= inventory[i] <= 109
// 1 <= orders <= min(sum(inventory[i]), 109)

import java.util.*;

class Solution {
    private static final int MOD = 1000000007;
    
    public int maxProfit(int[] inventory, int orders) {
        // Sort inventory in descending order
        Arrays.sort(inventory);
        reverse(inventory);
        
        long totalValue = 0;
        int n = inventory.length;
        int idx = 0;
        
        while (orders > 0) {
            // Find the next distinct value level
            while (idx < n && inventory[idx] == inventory[0]) {
                idx++;
            }
            
            // Calculate how many colors have the current max value
            int count = idx;
            
            // Calculate the next value level (0 if we've processed all)
            int nextValue = idx < n ? inventory[idx] : 0;
            
            // Calculate how many balls we can sell at current level before moving to next
            int currentValue = inventory[0];
            int diff = currentValue - nextValue;
            
            // Calculate how many balls we can sell in this batch
            long ballsToSell = (long) count * diff;
            
            if (ballsToSell <= orders) {
                // Sell all balls at current level
                // Sum from currentValue down to (nextValue + 1)
                // Formula: count * sum(currentValue + nextValue + 1) * diff / 2
                long sum = (long) count * (currentValue + nextValue + 1) * diff / 2;
                totalValue = (totalValue + sum) % MOD;
                orders -= (int) ballsToSell;
                
                // Update all processed colors to nextValue
                for (int i = 0; i < idx; i++) {
                    inventory[i] = nextValue;
                }
            } else {
                // We can't sell all balls at current level
                // Calculate how many full rows we can sell
                int fullRows = orders / count;
                int remainder = orders % count;
                
                // Sell full rows: from currentValue down to (currentValue - fullRows + 1)
                if (fullRows > 0) {
                    long sum = (long) count * (currentValue + (currentValue - fullRows + 1)) * fullRows / 2;
                    totalValue = (totalValue + sum) % MOD;
                }
                
                // Sell remainder: (currentValue - fullRows) for remainder times
                if (remainder > 0) {
                    long sum = (long) remainder * (currentValue - fullRows);
                    totalValue = (totalValue + sum) % MOD;
                }
                
                orders = 0;
            }
        }
        
        return (int) totalValue;
    }
    
    private void reverse(int[] arr) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
    
    // Test cases
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        // Example 1
        int[] inventory1 = {2, 5};
        System.out.println(sol.maxProfit(inventory1, 4)); // Expected: 14
        
        // Example 2
        int[] inventory2 = {3, 5};
        System.out.println(sol.maxProfit(inventory2, 6)); // Expected: 19
    }
}