import java.util.Arrays;

/*
We have n jobs, where every job is scheduled to be done from startTime[i] to endTime[i], obtaining a profit of profit[i].

You're given the startTime, endTime and profit arrays, return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range.

If you choose a job that ends at time X you will be able to start another job that starts at time X.
 */

class Solution {

    class Jobs{
        int start;
        int end;
        int profit;

        Jobs(int start, int end, int profit){
            this.start=start;
            this.end=end;
            this.profit=profit;
        }
    }
    public int jobScheduling(int[] startTime, int[] endTime, int[] profit) {

        int n=startTime.length;
        Jobs[] jobs= new Jobs[n];
        int[] dp=new int[n];

        for(int i=0;i<n;i++){
            jobs[i]= new Jobs(startTime[i],endTime[i],profit[i]);
            dp[i]=-1;
        }

        //sort according to the start time
        //if same then sort using end time
        Arrays.sort(jobs,(a,b) -> a.start==b.start ? a.end-b.end : a.start-b.start);

        return helper(jobs, 0, dp);
    }

    public int helper(Jobs[] jobs, int index, int[] dp){

        if(index >= jobs.length)
            return 0;

        //we already have the value
        if(dp[index] != -1)
            return dp[index];

        int j=index+1;

        //finding the next job whose start time is greater than the end time of the current job
        while(j<jobs.length && jobs[index].end > jobs[j].start)
            j++;

        //max profit if we include the current job and exclude the current job
        return dp[index]=Math.max(helper(jobs, j, dp)+jobs[index].profit,
        helper(jobs, index+1, dp));
    }
}
