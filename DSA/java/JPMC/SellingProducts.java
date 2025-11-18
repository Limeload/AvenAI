import java.util.*;

public class SellingProducts {
    // A salesperson must sell n items in a bag with random IDs.
    // The salesperson can remove as many as m items from the bag.
    // Determine the minimum number of different IDs the final bag
    // can contain after performing, at most, m deletions
    // A salesperson must sell n items in a bag with random IDs. The salesperson can remove as many as m items from the bag. Determine the minimum number of different IDs the final bag can contain after performing, at most, m deletions.
    //
    //Example
    //
    //n = 6
    //
    //ids = [1, 1, 1, 2, 3, 2]
    //
    //m = 2
    //
    //Two possible actions that give the minimum 2 different IDs:
    //
    //Remove 2 items with ID = 2 and the final bag will contain item ids' = [1, 1, 1, 3]
    //Remove 1 item with ID = 2 and 1 item with ID=3 and the final bag will contain item ids' = [1, 1, 1, 2]
    //The minimum number of distinct IDs is 2.
    //
    //Function Description
    //
    //Complete the function deleteProducts in the editor below.
    //
    //deleteProducts has the following parameters:
    //
    //int ids[n]: an array of integers
    //
    //int m: an integer, the maximum number of deletions
    //
    //Returns:
    //
    //int: an integer that represents the minimum number of item IDs

        /*
         * Complete the 'deleteProducts' function below.
         *
         * The function is expected to return an INTEGER.
         * The function accepts following parameters:
         *  1. INTEGER_ARRAY ids
         *  2. INTEGER m
         */
        public static int deleteProducts(List<Integer> ids, int m) {
            //made a map to store the end result
            Map<Integer, Integer> result = new HashMap<>();
            //sort the ids into hashmap based on how many times they appear
            for (Integer id : ids) {
                if (result.containsKey(id)) {
                    result.put(id, result.get(id) + 1);
                } else {
                    result.put(id, 1);
                }
            }
            // make a list to store the values
            List<Map.Entry<Integer, Integer>> list = new LinkedList<>(result.entrySet());
            // sorting using Comparator
            list.sort(Comparator.comparingInt(Map.Entry::getValue));
            // Creating new map after sorting and also
            // maintaining insertion order
            Map<Integer, Integer> sortedMap = new LinkedHashMap<>();
            for (Map.Entry<Integer, Integer> e : list) {
                sortedMap.put(e.getKey(), e.getValue());
            }
            for (Integer i : sortedMap.keySet()) {
                // taking out elements whose count is
                // less than m in a sorted manner
                if (result.get(i) <= m) {
                    m -= result.get(i);
                    result.remove(i);
                }
            }
            //returning result
            return result.size();
        }
}
