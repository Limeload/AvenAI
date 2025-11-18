/*
Given an m x n grid of characters board and a string word, return true if word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.
 */

class Solution {
    public boolean exist(char[][] board, String word) {
        int R = board.length;
        int C = board[0].length;
        for(int r = 0; r < R; r++) {
            for(int c = 0; c < C; c++) {
                if(dfs(r, c, 0, word, board)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    private boolean dfs(int x, int y, int index, String word, char[][] board) {
        if(index >= word.length()) {
            return true;
        }
        int R = board.length;
        int C = board[0].length;
        
        if(x < 0 || x >= R || y < 0 || y >= C || board[x][y] != word.charAt(index)) {
            return false;
        }
        char temp = board[x][y];
        board[x][y] = '*';
        
        
        boolean result = dfs(x+1, y, index+1, word, board) ||
            dfs(x-1, y, index+1, word, board) ||
            dfs(x, y+1, index+1, word, board) ||
            dfs(x, y-1, index+1, word, board);
        
        if(result)
            return result;//return without clean up if found a complete match
        
        board[x][y] = temp;
        
        return result;
    }
}
