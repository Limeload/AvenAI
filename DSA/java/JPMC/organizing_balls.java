import java.util.Arrays;
import java.util.List;

/*
David has several containers, each with a number of balls in it. He has just enough containers to sort each type of ball he has into its own container. David wants to sort the balls using his sort method.
David wants to perform some number of swap operations such that:
Each container contains only balls of the same type.
No two balls of the same type are located in different containers.

David has  containers and  different types of balls, both of which are numbered from  to . The distribution of ball types per container are shown in the following diagram.

In a single operation, David can swap two balls located in different containers.
The diagram below depicts a single swap operation:

In this case, there is no way to have all green balls in one container and all red in the other using only swap operations. Return Impossible.
You must perform  queries where each query is in the form of a matrix, . For each query, print Possible on a new line if David can satisfy the conditions above for the given matrix. Otherwise, print Impossible.

// Function Description
Complete the organizingContainers function in the editor below.
organizingContainers has the following parameter(s):
int containter[n][m]: a two dimensional array of integers that represent the number of balls of each color in each container
Returns
string: either Possible or Impossible
 */

class Result {

    /*
     * Complete the 'organizingContainers' function below.
     *
     * The function is expected to return a STRING.
     * The function accepts 2D_INTEGER_ARRAY container as parameter.
     */

    public static String organizingContainers(List<List<Integer>> container) {
    // Write your code here
    if (!container.isEmpty()) {
        int containerCount = container.size();
        int[] ballTypeCount = new int[containerCount];
        int[] containerCapacityCount = new int[containerCount];
        for (int i = 0; i < containerCount; i++) {
            List<Integer> row = container.get(i);
            for (int j = 0; j < row.size(); j++) {
                int ele = row.get(j);
                containerCapacityCount[i] += ele;
                ballTypeCount[j] += ele;
            }
        }
        Arrays.sort(ballTypeCount);
        Arrays.sort(containerCapacityCount);
        for (int i = 0; i < containerCount; i++) {
            if (ballTypeCount[i] > containerCapacityCount[i])
                return "Impossible";
        }
        return "Possible";
    }
    return "Impossible";
    }

}
