import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/*
A sentence is a string of single-space separated words where each word consists only of lowercase letters.

A word is uncommon if it appears exactly once in one of the sentences, and does not appear in the other sentence.

Given two sentences s1 and s2, return a list of all the uncommon words. You may return the answer in any order.
 */

class Solution {
    public String[] uncommonFromSentences(String s1, String s2) {
       // Split the sentences into words
    String[] words1 = s1.split(" ");
    String[] words2 = s2.split(" ");

    // Create two HashMaps to store word counts for each sentence
    HashMap<String, Integer> wordCounts1 = new HashMap<>();
    HashMap<String, Integer> wordCounts2 = new HashMap<>();

    // Count the occurrences of each word in each sentence
    for (String word : words1) {
        wordCounts1.putIfAbsent(word, 0);
        wordCounts1.put(word, wordCounts1.get(word) + 1);
    }

    for (String word : words2) {
        wordCounts2.putIfAbsent(word, 0);
        wordCounts2.put(word, wordCounts2.get(word) + 1);
    }

    // Create a list to store the uncommon words
    List<String> uncommonWords = new ArrayList<>();

    // Iterate through the word counts and add uncommon words to the list
    for (String word : wordCounts1.keySet()) {
        int count1 = wordCounts1.get(word);
        int count2 = wordCounts2.getOrDefault(word, 0);

        if (count1 == 1 && count2 == 0) {
            uncommonWords.add(word);
        }
    }

    for (String word : wordCounts2.keySet()) {
        int count2 = wordCounts2.get(word);
        int count1 = wordCounts1.getOrDefault(word, 0);

        if (count2 == 1 && count1 == 0) {
            uncommonWords.add(word);
        }
    }

    return uncommonWords.toArray(new String[uncommonWords.size()]);
    }
}
