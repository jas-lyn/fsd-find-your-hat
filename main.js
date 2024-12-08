const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.playerPosition = { row: 0, col: 0 }; // Start at the top-left corner
  }

  // Print the field to the console
  print() {
    this.field.forEach(row => console.log(row.join('')));
  }

  // Update the player's position
  updatePosition(newRow, newCol) {
    if (this.isOutOfBounds(newRow, newCol)) {
      console.log("Out of bounds! You lose.");
      return false;
    }

    const cell = this.field[newRow][newCol];

    if (cell === hole) {                                                // if user falls in hole
      console.log("Oops, you fell into a hole!");                       // print "Oops, you fell into a hole!"
    } else if (cell === hat) {                                          // if user gets to hat position
      console.log("Congratulations, you found your hat!");              //print "Congrats..
    } else {
      this.playerPosition = { row: newRow, col: newCol };
      this.field[newRow][newCol] = pathCharacter;                       // Mark the new position
      return true;
    }
  }

  // Check if a position is out of bounds
  isOutOfBounds(row, col) {
    return row < 0 || row >= this.field.length || col < 0 || col >= this.field[0].length;
  }

  // Move the player based on input direction
  movePlayer(direction) {
    const { row, col } = this.playerPosition;

    switch (direction.toLowerCase()) {              //make case-insensitive
      case 'u':
        return this.updatePosition(row - 1, col);   // decrease row by 1 when 'u' is keyed in
      case 'd':
        return this.updatePosition(row + 1, col);   // increase row by 1 when 'd' is keyed in
      case 'l':
        return this.updatePosition(row, col - 1);   // decrease col by 1 when 'l' is keyed in
      case 'r':
        return this.updatePosition(row, col + 1);   // increase col by 1 when 'r' is keyed in
      default:
        console.log("Invalid input!");              // for any other inputs, print "Invalid input"
        return false;
    }
  }

  // Static method to generate a random field
  static generateField(rows, cols, holePercentage = 0.2) {
    const field = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () =>
        Math.random() < holePercentage ? hole : fieldCharacter
      )
    );

    // Place the starting position and the hat
    field[0][0] = pathCharacter;
    const hatRow = Math.floor(Math.random() * rows);
    const hatCol = Math.floor(Math.random() * cols);

    // Ensure the hat doesn't appear at the starting position
    while (hatRow === 0 && hatCol === 0) {
      hatRow = Math.floor(Math.random() * rows);
      hatCol = Math.floor(Math.random() * cols);
    }
    field[hatRow][hatCol] = hat;      //place the hat on the field
    return field;
  }
}

// Game logic
function playGame() {
  const rows = 4;               // Setup 4 rows
  const cols = 3;               //Setup 3 columns
  const holePercentage = 0.2;   // 20% of field should be filled with holes

  const field = new Field(Field.generateField(rows, cols, holePercentage));   // initialize the field

  console.log("Use 'u' (up), 'd' (down), 'l' (left), 'r' (right) to move.");
  console.log("Find your hat (^) while avoiding the holes (O)!\n");

  let playing = true;   // start the game loop

  while (playing) {
    field.print();      //display current state of the grid
    const direction = prompt("Which way? ");
    playing = field.movePlayer(direction);
  }
}

// Start the game
playGame();