/*
Q2. Rearranging a word
Given a string word, return the next alphabetically greater string in all permutations of the word. If such string does not exist, return "No answer".
Constraints - I forgot but the problem was solvable in O(n)
Example - 1: word = "xy"
Output: "yx"

Example - 2: word = "cba"
Output: "No answer"
 */

class Solution {
    public String nextPermutation(String word) {
        // Find the largest index i such that word[i] < word[i+1] (i.e., the peak index)
        int i = word.length() - 2;
        while (i >= 0 && word.charAt(i) >= word.charAt(i + 1)) {
            i--;
        }

        // If no such index is found, meaning the word is in descending order (lexicographically largest), return "No answer"
        if (i < 0) {
            return "No answer";
        }

        // Find the smallest index j > i such that word[j] > word[i] (the successor index)
        int j = i + 1;
        for (int k = j + 1; k < word.length(); k++) {
            if (word.charAt(k) > word.charAt(i) && word.charAt(k) <= word.charAt(j)) {
                j = k;
            }
        }

        // Swap characters at i and j
        char temp = word.charAt(i);
        word = word.substring(0, i) + word.charAt(j) + word.substring(i + 1, j) + temp + word.substring(j + 1);

        // Reverse the substring after i to create the next lexicographically greater permutation
        StringBuilder sb = new StringBuilder(word.substring(i + 1));
        sb.reverse();
        word = word.substring(0, i + 1) + sb.toString();

        return word;
    }
}
