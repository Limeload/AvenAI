import java.util.Arrays;

/*
You are assigned to put some amount of boxes onto one truck. You are given a 2D array boxTypes, where boxTypes[i] = [numberOfBoxesi, numberOfUnitsPerBoxi]:

numberOfBoxesi is the number of boxes of type i.
numberOfUnitsPerBoxi is the number of units in each box of the type i.
You are also given an integer truckSize, which is the maximum number of boxes that can be put on the truck. You can choose any boxes to put on the truck as long as the number of boxes does not exceed truckSize.

Return the maximum total number of units that can be put on the truck.
*/

class Solution {
    public int maximumUnits(int[][] boxTypes, int truckSize) {
       Arrays.sort(boxTypes, (a, b) -> b[1] - a[1]); // Sort by units per box in descending order

    int totalUnits = 0;
    for (int[] boxType : boxTypes) {
        int boxes = Math.min(boxType[0], truckSize); // Take the minimum of available boxes and remaining truck space
        totalUnits += boxes * boxType[1]; // Add the total units from the selected boxes
        truckSize -= boxes; // Update the remaining truck space

        if (truckSize == 0) {
            break; // Break if truck is full
        }
    }

    return totalUnits;
    }
}
