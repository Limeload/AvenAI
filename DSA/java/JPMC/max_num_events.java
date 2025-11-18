import java.util.Arrays;
import java.util.PriorityQueue;

/*
You are given an array of events where events[i] = [startDayi, endDayi]. Every event i starts at startDayi and ends at endDayi.

You can attend an event i at any day d where startTimei <= d <= endTimei. You can only attend one event at any time d.

Return the maximum number of events you can attend.
 */

class Solution {
    public int maxEvents(int[][] events) {
        Arrays.sort(events,(a,b)->(a[0]!=b[0])?a[0]-b[0]: a[1]-b[1]);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[1]-b[1]);
        int res=0, n=events.length;

        for(int i=1, j=0;i<=100000;i++){
            while(j<n && events[j][0]==i)
                pq.add(events[j++]);

            if(pq.isEmpty()){
                if(j==n) break;
                i=events[j][0]-1;
            }else{
                while(!pq.isEmpty() && pq.peek()[1]<i)
                    pq.poll();

                if(!pq.isEmpty()){
                    pq.poll();
                    res++;
                }
            }
        }
        return res;
    }
}
