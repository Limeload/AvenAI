import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
You are given an array of strings products and a string searchWord.

Design a system that suggests at most three product names from products after each character of searchWord is typed. Suggested products should have common prefix with searchWord. If there are more than three products with a common prefix return the three lexicographically minimums products.

Return a list of lists of the suggested products after each character of searchWord is typed.
 */

class Solution {
    public List<List<String>> suggestedProducts(String[] products, String searchWord) {
        Map<String, List<String>> prefixMap = new HashMap<>();
        for (String product : products) {
            for (int i = 1; i <= product.length(); i++) {
                String prefix = product.substring(0, i);
                prefixMap.putIfAbsent(prefix, new ArrayList<>());
                prefixMap.get(prefix).add(product);
            }
        }

        List<List<String>> suggestions = new ArrayList<>();
        for (int i = 0; i < searchWord.length(); i++) {
            String prefix = searchWord.substring(0, i + 1);
            List<String> productSuggestions = prefixMap.getOrDefault(prefix, new ArrayList<>());
            Collections.sort(productSuggestions);
            suggestions.add(productSuggestions.subList(0, Math.min(3, productSuggestions.size())));
        }

        return suggestions;
    }
}
