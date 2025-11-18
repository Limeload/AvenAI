package Leetcode;

import java.util.HashMap;
import java.util.Map;

/*
You have a chat log of n messages. You are given two string arrays messages and senders where messages[i] is a message sent by senders[i].

A message is list of words that are separated by a single space with no leading or trailing spaces. The word count of a sender is the total number of words sent by the sender. Note that a sender may send more than one message.

Return the sender with the largest word count. If there is more than one sender with the largest word count, return the one with the lexicographically largest name.

Note:

Uppercase letters come before lowercase letters in lexicographical order.
"Alice" and "alice" are distinct.

 */

class Solution {
    public String largestWordCount(String[] messages, String[] senders) {
        // In a hashmap, record whhich person has sent how many words
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < messages.length; i++) {
            // doing this would get us the number of words in that particular message
            int words = messages[i].split(" ").length;
            String name = senders[i];
            // update in the map
            map.put(name, words + map.getOrDefault(name, 0));
        }

        // a string 'ans' to record our final sender's name
        String ans = "";
        // variable to keep track of the maximum number of words spoken by a sender
        int max = 0;
        // go through the senders
        for (String name : map.keySet()) {
            // number of words current sender has sent
            int words = map.get(name);
            // if number of words > max spoken words
            if (words > max) {
                max = words;    // update max
                ans = name;     // make this sender our candidate
            }
            // if we have a tie in the max number of words spoken
            else if (words == max) {
                // keep the name which is lexicographically greater
                int x = ans.compareTo(name);
                ans = (x > 0)? ans : name;
            }
        }
        return ans;
    }
}
