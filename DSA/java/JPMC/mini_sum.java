/*
Given N elements, you can remove any two elements from the list, note their sum, and add the sum to the list. Repeat these steps while there is more than a single element in the list. The task is to minimize the sum of these chosen sums in the end.
Examples:

Input: arr[] = {1, 4, 7, 10}
Output: 39
Choose 1 and 4, Sum = 5, arr[] = {5, 7, 10}
Choose 5 and 7, Sum = 17, arr[] = {12, 10}
Choose 12 and 10, Sum = 39, arr[] = {22}
Input: arr[] = {1, 3, 7, 5, 6}
Output: 48
 */

 // Java implementation of the approach
import java.util.PriorityQueue;

class GFG
{

	// Function to return the minimized sum
	static int getMinSum(int arr[], int n)
	{
		int i, sum = 0;

		// Priority queue to store the elements of the array
		// and retrieve the minimum element efficiently
		PriorityQueue<Integer> pq = new PriorityQueue<>();

		// Add all the elements
		// to the priority queue
		for (i = 0; i < n; i++)
			pq.add(arr[i]);

		// While there are more than 1 elements
		// left in the queue
		while (pq.size() > 1)
		{

			// Remove and get the minimum
			// element from the queue
			int min = pq.poll();

			// Remove and get the second minimum
			// element (currently minimum)
			int secondMin = pq.poll();

			// Update the sum
			sum += (min + secondMin);

			// Add the sum of the minimum
			// elements to the queue
			pq.add(min + secondMin);
		}

		// Return the minimized sum
		return sum;
	}

	// Driver code
	public static void main(String[] args)
	{
		int arr[] = { 1, 3, 7, 5, 6 };
		int n = arr.length;
		System.out.print(getMinSum(arr, n));
	}
}
