import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.

A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.
 */

class Solution {
    public List<String> letterCombinations(String digits) {
        if (digits.isEmpty()) {
            return new ArrayList<>();
        }
        Map<Character, String> map = new HashMap<>();
        map.put('2', "abc");
        map.put('3', "def");
        map.put('4', "ghi");
        map.put('5', "jkl");
        map.put('6', "mno");
        map.put('7', "pqrs");
        map.put('8', "tuv");
        map.put('9', "wxyz");
        List<String> combinations = new ArrayList<>();
        backtrack(combinations, map, "", digits);
        return combinations;
    }

    private void backtrack(List<String> combinations, Map<Character, String> map, String current, String remaining) {
        if (remaining.isEmpty()) {
            combinations.add(current);
            return;
        }
        char digit = remaining.charAt(0);
        String letters = map.get(digit);
        for (int i = 0; i < letters.length(); i++) {
            backtrack(combinations, map, current + letters.charAt(i), remaining.substring(1));
        }
    }
}
