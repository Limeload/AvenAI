import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Stack;

/*
You are given a list of airline tickets where tickets[i] = [fromi, toi] represent the departure and the arrival airports of one flight. Reconstruct the itinerary in order and return it.

All of the tickets belong to a man who departs from "JFK", thus, the itinerary must begin with "JFK". If there are multiple valid itineraries, you should return the itinerary that has the smallest lexical order when read as a single string.

For example, the itinerary ["JFK", "LGA"] has a smaller lexical order than ["JFK", "LGB"].
You may assume all tickets form at least one valid itinerary. You must use all the tickets once and only once.
 */

class Solution {
    public List<String> findItinerary(List<List<String>> tickets) {
        Map<String, PriorityQueue<String>> graph = new HashMap<>();
        for (List<String> ticket : tickets) {
            graph.computeIfAbsent(ticket.get(0), k -> new PriorityQueue<>()).add(ticket.get(1));
        }

        Stack<String> stack = new Stack<>();
        stack.push("JFK");
        List<String> itinerary = new ArrayList<>();

        while (!stack.isEmpty()) {
            String current = stack.peek();
            if (!graph.getOrDefault(current, new PriorityQueue<>()).isEmpty()) {
                stack.push(graph.get(current).poll());
            } else {
                itinerary.add(current);
                stack.pop();
            }
        }

        Collections.reverse(itinerary);
        return itinerary;
    }
}
