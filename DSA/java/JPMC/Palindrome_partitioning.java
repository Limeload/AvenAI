/*
Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.
 */

import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> partitions = new ArrayList<>();
        backtrack(s, 0, new ArrayList<>(), partitions);
        return partitions;
    }

    private void backtrack(String s, int startIndex, List<String> currentPartition,
                            List<List<String>> partitions) {
        if (startIndex == s.length()) {
            partitions.add(new ArrayList<>(currentPartition));
            return;
        }

        for (int i = startIndex + 1; i <= s.length(); i++) {
            String substring = s.substring(startIndex, i);
            if (isPalindrome(substring)) {
                currentPartition.add(substring);
                backtrack(s, i, currentPartition, partitions);
                currentPartition.remove(currentPartition.size() - 1);
            }
        }
    }

    private boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }

            left++;
            right--;
        }

        return true;
    }
}
