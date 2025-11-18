import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class anagrams_fun {
    //QUESTION DESCRIPTION
    //Two strings are anagrams if they are permutations of each other. For example, "aaagmnrs" is an anagram of "anagrams".
    //Given an array of strings, remove each string that is an anagram of an earlier string, then return the remaining array
    //in sorted order.
    //
    //For example, given the strings s = ['code', 'doce', 'ecod', 'framer', 'frame'],  the strings 'doce' and 'ecod' are both
    //anagrams of 'code' so they are removed from the list. The words 'frame' and 'framer' are not anagrams due to the extra
    //'r' in 'framer', so they remain. The final list of strings in alphabetical order is ['code', 'frame', 'framer'].

    //words = ['code', 'doce', 'ecod', 'framer', 'frame']


    public static List<String> anagrams_Fun(List<String> input){
        // we make a hashset to store values
        HashSet<String> hashSet=new HashSet<>();
        //we make an arraylist to store answer
        ArrayList<String> result=new ArrayList<>();
        // we loop through the words
        for (String i:input) {
            char[] chars = i.toCharArray();
            Arrays.sort(chars);
            String sortedWord = new String(chars);
            //it gets made into sorted words
            //if map does not contain sorted word make a new list of words if it does add it to the anagrams list
            if (!hashSet.contains(sortedWord)) {
                hashSet.add(sortedWord);
                //put sorted word into new array list
                result.add(i);
            }
        }
        return result.stream().toList();
    }
}
