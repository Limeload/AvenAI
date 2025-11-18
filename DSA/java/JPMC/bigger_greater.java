/*
Lexicographical order is often known as alphabetical order when dealing with strings. A string is greater than another string if it comes later in a lexicographically sorted list.
Given a word, create a new word by swapping some or all of its characters. This new word must meet two criteria:
It must be greater than the original word
It must be the smallest word that meets the first condition
Example
w = abcd
The next largest word is abdc .
Complete the function biggerIsGreater below to create and return the new string meeting the criteria. If it is not possible, return no answer.

//Function Description
Complete the biggerIsGreater function in the editor below.
biggerIsGreater has the following parameter(s):
- string w: a word
Returns
- string: the smallest lexicographically higher string possible or no answer

 */

class Result {

    /*
     * Complete the 'biggerIsGreater' function below.
     *
     * The function is expected to return a STRING.
     * The function accepts STRING w as parameter.
     */

    public static String biggerIsGreater(String w) {
    // Write your code here
    StringBuilder sb = new StringBuilder(w);

    int minPos = Integer.MIN_VALUE;
    char minVal = Character.MAX_VALUE;
    Character toSubst = Character.MAX_VALUE;
    int positionToSubst = Integer.MAX_VALUE;

    for (int i = w.length() - 1; i >= 1; i--) {
        for (int j = i - 1; j >= 0; j--) {
            char iVal = w.charAt(i);
            char jVal = w.charAt(j);
            if (w.charAt(i) > w.charAt(j)) {
                if (minPos < j) {
                    minPos = j;
                    positionToSubst = i;
                    minVal = jVal;
                    toSubst = iVal;
                }
                break;
            }
        }
    }

    if (minPos != Integer.MIN_VALUE) {
        sb.replace(minPos, minPos + 1, String.valueOf(toSubst));
        sb.replace(positionToSubst, positionToSubst + 1, String.valueOf(minVal));

        return sb.replace(minPos + 1, sb.length(), sb.chars().skip(minPos + 1).sorted()
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString()).toString();
    } else {
        return "no answer";
    }
    }
}
