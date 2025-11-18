/*
Given an integer n, find the count of integers from 1 to n having digits with sum maximum.
 */


import java.util.HashMap;

public class Counting_num_prop {

    public static int countNumbers(int n) {
        HashMap<Integer, Integer> mp = new HashMap<>();
        for (int i = 1; i <= n; i++) {
            int cnt = digit_count(i);
            mp.put(cnt, mp.getOrDefault(cnt, 0) + 1);
        }

        int maxx = -1;
        for (int i : mp.keySet()) {
            if (mp.get(i) > maxx) {
                maxx = mp.get(i);
            }
        }

        int cnt = 0;
        for (int i : mp.keySet()) {
            if (mp.get(i) == maxx) {
                cnt++;
            }
        }

        return cnt;
    }

    public static int digit_count(int nums) {
        int tmp = 0;
        while (nums > 0) {
            tmp += nums % 10;
            nums /= 10;
        }
        return tmp;
    }

    public static void main(String[] args) {
        int n = 10;
        int result = countNumbers(n);
        System.out.println(result);
    }
}

