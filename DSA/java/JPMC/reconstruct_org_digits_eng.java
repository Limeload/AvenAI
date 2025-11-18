/*
Given a string s containing an out-of-order English representation of digits 0-9, return the digits in ascending order.
 */

class Solution {
    public String originalDigits(String s) {
        int[] rescount = new int[10];
        int[] freqs = new int[26];
        for(char ch: s.toCharArray()) freqs[ch-'a']++;
        rescount[0] = freqs[25];
        rescount[2] = freqs[22];
        rescount[8] = freqs[6];
        rescount[6] = freqs[23];
        rescount[4] = freqs[20];
        rescount[5] = freqs[5] - rescount[4];
        rescount[1] = freqs[14] - rescount[0] - rescount[2]-rescount[4];
        rescount[7] = freqs[18] - rescount[6];
        rescount[9] = freqs[8] - rescount[8]-rescount[6]-rescount[5];
        rescount[3] = freqs[19] - rescount[2] - rescount[8];
        String res = "";
        // System.out.println(Arrays.toString(freqs));
        // System.out.println(Arrays.toString(rescount));
        for(int i=0;i<10;i++){
            if(rescount[i] > 0){
                res += (Integer.toString(i).repeat(rescount[i]));
            }
        }
        return res;
    }
}
