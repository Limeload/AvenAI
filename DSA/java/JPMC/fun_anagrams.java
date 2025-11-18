/*
Given an array of strings, remove each string that is an anagram of an earlier string, then return the remaining array in sorted order.

Example

str = ['code', 'doce', 'ecod', 'framer', 'frame']

code and doce are anagrams. Remove doce from the array and keep the first occurrence code in the array.
code and ecod are anagrams. Remove ecod from the array and keep the first occurrence code in the array.
code and framer are not anagrams. Keep both strings in the array.
framer and frame are not anagrams due to the extra r in framer. Keep both strings in the array.
Order the remaining strings in ascending order: ['code','frame','framer'].
 */

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

class Solution {

    public static String[] removeAnagramsAndSort(String[] str) {
        // Set to track seen strings
        HashSet<String> seen = new HashSet<>();
        // Map to store sorted string as key and original string as value
        HashMap<String, String> sortedMap = new HashMap<>();

        // Loop through strings
        for (String s : str) {
            // Sort the current string
            String sortedString = sortString(s);

            // Check if the sorted string has already been seen
            if (!seen.contains(sortedString)) {
                seen.add(sortedString);
                // Store the original string associated with the sorted key
                sortedMap.put(sortedString, s);
            }
        }

        // Collect original strings from the sorted map and convert to an array
        List<String> remainingStrings = sortedMap.values().stream().collect(Collectors.toList());

        // Sort the remaining strings and return them
        return remainingStrings.toArray(new String[0]);
    }

    private static String sortString(String s) {
        char[] charArray = s.toCharArray();
        Arrays.sort(charArray);
        return new String(charArray);
    }
}


// javaScript solution
/*
 function funWithAnagrams(array) {
   let sortedArray = array.map(string =>
      string.split('').sort().join(''))
   let firstAnagram = [sortedArray[0]]
   let indices = [0]
   let results = []
   for (let i = 1; i < sortedArray.length; i++) {
      if (firstAnagram.includes(sortedArray[i])) {
      } else {
         firstAnagram.push(sortedArray[i])
         indices.push(i)
      }
   }
   indices.forEach(index => {
      results.push(array[index])
   })
   return results.sort()
}
 */

