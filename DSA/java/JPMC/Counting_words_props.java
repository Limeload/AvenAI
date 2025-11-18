/*
 Given a string of words separated by spaces, find the count of words that have at least one vowel and at least one consonant.
 */



import java.util.HashMap;

public class Counting_words_props {

    public static int countWords(String words) {
        HashMap<String, Integer> mp = new HashMap<>();
        String[] wordsArr = words.split(" ");
        for (String word : wordsArr) {
            if (isVowelPresent(word) && isConsonantPresent(word)) {
                mp.put(word, mp.getOrDefault(word, 0) + 1);
            }
        }

        return mp.size();
    }

    public static boolean isVowelPresent(String word) {
        for (char c : word.toCharArray()) {
            if ("aeiouAEIOU".contains(Character.toString(c))) {
                return true;
            }
        }

        return false;
    }

    public static boolean isConsonantPresent(String word) {
        for (char c : word.toCharArray()) {
            if (!"aeiouAEIOU ".contains(Character.toString(c))) {
                return true;
            }
        }

        return false;
    }

    public static void main(String[] args) {
        String words = "Hello world";
        int result = countWords(words);
        System.out.println(result);
    }
}

