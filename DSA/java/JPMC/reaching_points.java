/*
Given four integers sx, sy, tx, and ty, return true if it is possible to convert the point (sx, sy) to the point (tx, ty) through some operations, or false otherwise.

The allowed operation on some point (x, y) is to convert it to either (x, x + y) or (x + y, y).

 */

class Solution {
    public boolean reachingPoints(int sx, int sy, int tx, int ty) {
        while(sx < tx && sy < ty){
			if(tx > ty){
				tx = tx % ty;
			}
			else{
				ty = ty % tx;
			}
		}
		if(sx == tx && sy <= ty){
			return (ty - sy) % tx == 0;
		}
		else{
			return sy == ty && sx <= tx && (tx - sx) % ty == 0;
		}
    }
}
