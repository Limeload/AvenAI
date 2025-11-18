import java.util.Arrays;

/*
You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.
 */

class Solution {
    public int coinChange(int[] coins, int amount) {
        if (amount == 0) return 0; // Base case: need no coins for 0 amount
        if (coins.length == 0) return -1; // Base case: no coins available

        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE); // Initialize with maximum value to represent non-reachable amounts
        dp[0] = 0; // Base case: need no coins for 0 amount

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i && dp[i - coin] != Integer.MAX_VALUE) {
                    dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
                }
            }
        }

        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
}
