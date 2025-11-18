/*
You are given an integer array arr. Sort the integers in the array in ascending order by the number of 1's in their binary representation and in case of two or more integers have the same number of 1's you have to sort them in ascending order.

Return the array after sorting it.
 */





import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] sortByBits(int[] arr) {
       HashMap<Integer, ArrayList<Integer>> map = new HashMap<>();

    for (int num : arr) {
        int count = Integer.bitCount(num);
        if (!map.containsKey(count)) {
            map.put(count, new ArrayList<>());
        }
        map.get(count).add(num);
    }

    ArrayList<Integer> sortedArr = new ArrayList<>();

    for (Map.Entry<Integer, ArrayList<Integer>> entry : map.entrySet()) {
        ArrayList<Integer> values = entry.getValue();
        Collections.sort(values);
        sortedArr.addAll(values);
    }

    return sortedArr.stream().mapToInt(Integer::intValue).toArray();
}
}
