import java.util.ArrayList;
import java.util.List;

/*
Max Profit with Transaction Fee:

Given an array of prices where prices[i] is the price of a given stock on the ith day, and a transaction fee fee. You can only hold at most one share of the stock at any time, and you can buy it at any time (including after selling it). You must sell the stock before buying it again. You may not engage in multiple transactions at the same time (i.e., you must sell the stock before you buy it again). Return the maximum profit you can achieve.

Highly Profitable Months:

Given an array of stock prices stocks and an integer k, find the maximum number of months where the stock price is strictly increasing.

Constraints:

1 <= prices.length <= 3 * 104;
0 <= prices[i] <= 104;
0 <= fee <= 1.
Highly Profitable Months Constraints:

1 <= len(stocks) <= 3 * 104;
0 <= stocks[i] <= 104;
1 <= k <= len(stocks).
 */

public class Highly_profitable_months {

    public static int countHighlyProfitableMonths(int[] stocks, int k) {
        int seqLength = 1, count = 0;
        List<Integer> seqs = new ArrayList<>();

        for (int i = 1; i < stocks.length; i++) {
            if (stocks[i - 1] < stocks[i]) {
                seqLength++;
            } else {
                if (seqLength >= k) {
                    seqs.add(seqLength);
                }
                seqLength = 1;
            }
        }

        if (seqLength >= k) {
            seqs.add(seqLength);
        }

        for (int seqLn : seqs) {
            count += (seqLn - k) + 1;
        }

        return count;
    }

    public static void main(String[] args) {
        int[] stocks1 = {5, 3, 5, 7, 8};
        int k1 = 3;
        int[] stocks2 = {1, 2, 3, 3, 4, 5};
        int k2 = 3;

        int count1 = countHighlyProfitableMonths(stocks1, k1);
        int count2 = countHighlyProfitableMonths(stocks2, k2);

        System.out.println("Number of highly profitable months for stocks1: " + count1);
        System.out.println("Number of highly profitable months for stocks2: " + count2);
    }
}
