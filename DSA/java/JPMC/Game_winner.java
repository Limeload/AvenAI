/*
 Louise and Richard are playing a game involving a string of characters 'w' and 'b'. The game starts with an initial string, and the players take turns removing characters from the string. In each turn, a player can remove any character from the string, as long as the resulting substring is still a palindrome. A palindrome is a string that reads the same backward as forward. The player who cannot make a valid move loses the game.
 */

public class Game_winner {

    public static String findWinner(String s) {
        int wendyMoves = 0, bobMoves = 0;
        int n = s.length(), i = 0;

        while (i < n) {
            int j = i, count = 0;
            while (j < n && s.charAt(i) == s.charAt(j)) {
                count++;
                j++;
            }

            if (count > 2) {
                if (s.charAt(i) == 'w') {
                    wendyMoves += count - 2;
                } else {
                    bobMoves += count - 2;
                }
            }

            i = j;
        }

        if (bobMoves >= wendyMoves) {
            return "Bob";
        } else {
            return "Wendy";
        }
    }

    public static void main(String[] args) {
        String s = "wwwbbbbwww";
        String winner = findWinner(s);
        System.out.println("Winner: " + winner);
    }
}
