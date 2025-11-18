import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

/*
Given the array orders, which represents the orders that customers have done in a restaurant. More specifically orders[i]=[customerNamei,tableNumberi,foodItemi] where customerNamei is the name of the customer, tableNumberi is the table customer sit at, and foodItemi is the item customer orders.

Return the restaurant's “display table”. The “display table” is a table whose row entries denote how many of each food item each table ordered. The first column is the table number and the remaining columns correspond to each food item in alphabetical order. The first row should be a header whose first column is “Table”, followed by the names of the food items. Note that the customer names are not part of the table. Additionally, the rows should be sorted in numerically increasing order.


 */


class Solution {
    public List<List<String>> displayTable(List<List<String>> arr) {
        HashMap<Integer,HashMap<String,Integer>> hp = new HashMap<>();
        ArrayList<String> str = new ArrayList<>();
        HashSet<String> hs = new HashSet<>();

        for(var x : arr){
            int a = Integer.valueOf(x.get(1));
            String k = x.get(2);

            if(!hs.contains(k)) str.add(k);

            hs.add(k);

            if(hp.containsKey(a)){
                HashMap<String,Integer> h = hp.get(a);
                if(h.containsKey(k)){
                    h.put(k,h.get(k)+1);
                }else{
                    h.put(k,1);
                }
            }else{
                HashMap<String,Integer> h = new HashMap<>();
                h.put(k,1);
                hp.put(a,h);
            }
        }

        Collections.sort(str);
        List<List<String>> ans = new ArrayList<>();
        List<String> ar = new ArrayList<>();
        ar.add("Table");
        for(var x : str){
            ar.add(x);
        }
        ans.add(ar);

        ArrayList<Integer> table = new ArrayList<>();

        for(var x : hp.keySet()){
            table.add(x);
        }


        Collections.sort(table);

        for(int i=0; i<table.size(); i++){
            int x = table.get(i);
            List<String> a = new ArrayList<>();
            a.add(String.valueOf(x));
            for(int j=0; j<str.size(); j++){
                String k = str.get(j);
                HashMap<String,Integer> h = hp.get(x);
                if(h.containsKey(k)){
                    a.add(String.valueOf(h.get(k)));
                }else a.add("0");
            }
            ans.add(a);
        }
        return ans;
    }
}
