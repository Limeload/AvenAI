/*
You are given coordinates, a string that represents the coordinates of a square of the chessboard. Below is a chessboard for your reference.



Return true if the square is white, and false if the square is black.

The coordinate will always represent a valid chessboard square. The coordinate will always have the letter first, and the number second.


 */

class Solution {
    public boolean squareIsWhite(String coordinates) {
         char letter = Character.toLowerCase(coordinates.charAt(0));
    int row = Character.getNumericValue(letter) - 9;
    int column = Integer.parseInt(coordinates.substring(1));

    int sum = row + column;
    return sum % 2 == 1;
    }
}
