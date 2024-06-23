/**
 * Creates a player with a name and a mark.
 * @param {string} name - The player's name.
 * @param {string} playerMark - The player's mark ("X" or "O").
 * @returns {object} - An object with methods to get the player's name and mark.
 */
function createPlayer(name, playerMark) {
    // Returns the player's name.
    function getPlayerName() {
        return name;
    }

    // Returns the player's mark.
    function getPlayerMark() {
        return playerMark;
    }

    return { getPlayerName, getPlayerMark };
}

const gameBoard = (function () {
    // Constants for the board dimensions.
    const rows = 3;
    const cols = 3;
    const totalCellCount = rows * cols;
    let filledCellCount = 0;

    // Initializes the game board with empty cells.
    const board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
    ];

    /**
     * Sets the player's mark at the specified cell number.
     * @param {number} cellNumber - The cell number (1-9).
     * @param {string} playerMark - The player's mark ("X" or "O").
     * @returns {boolean} - True if the position is set, false otherwise.
     */
    function setPlayerPosition(cellNumber, playerMark) {
        if (cellNumber < 1 || cellNumber > 9) {
            return false; // Invalid cell number.
        }

        let rowIndex = 0;
        let colIndex = 0;

        // Calculate the row and column index from the cell number.
        while (cellNumber > rows) {
            rowIndex++;
            cellNumber -= rows;
        }

        colIndex = cellNumber - 1;

        // Place the mark if the cell is empty.
        if (board[rowIndex][colIndex] === " ") {
            board[rowIndex][colIndex] = playerMark;
            filledCellCount++;
            return true;
        }

        return false; // Cell already occupied.
    }

    /**
     * Gets a copy of the current game board.
     * @returns {Array} - The game board.
     */
    function getBoard() {
        return [...board];
    }

    // Returns the number of rows in the game board.
    function getBoardRowCount() {
        return rows;
    }

    // Returns the number of columns in the game board.
    function getBoardColCount() {
        return cols;
    }

    // Returns the total number of cells in the game board.
    function getTotalCellCount() {
        return totalCellCount;
    }

    // Returns the count of filled cells in the game board.
    function getFilledCellCount() {
        return filledCellCount;
    }

    /**
     * Resets the game board to its initial empty state.
     */
    function resetBoard() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = " ";
            }
        }
        filledCellCount = 0; // Reset the filled cell count.
    }

    return {
        setPlayerPosition,
        getBoard,
        getBoardRowCount,
        getBoardColCount,
        getTotalCellCount,
        getFilledCellCount,
        resetBoard,
    };
})();

const render = (function () {
    /**
     * Renders the game board to the console.
     */
    function renderGameBoard() {
        const _gameBoard = gameBoard.getBoard();
        const gameBoardRowCount = gameBoard.getBoardRowCount();

        // Loop through each row of the game board.
        for (let row = 0; row < gameBoardRowCount; row++) {
            const [colValue1, colValue2, colValue3] = _gameBoard[row];
            console.log(` ${colValue1} | ${colValue2} | ${colValue3} `);

            // Print row separators.
            if (row === 0 || row === 1) {
                console.log(`---|---|---`);
            }
        }
        console.log(`\n`); // New line for better readability.
    }

    return { renderGameBoard };
})();

// Game module
const Game = (function () {
    // Predefined winning positions on the board.
    const winPositions = [
        [[0, 0], [0, 1], [0, 2]], // First row
        [[1, 0], [1, 1], [1, 2]], // Second row
        [[2, 0], [2, 1], [2, 2]], // Third row
        [[0, 0], [1, 0], [2, 0]], // First column
        [[0, 1], [1, 1], [2, 1]], // Second column
        [[0, 2], [1, 2], [2, 2]], // Third column
        [[0, 0], [1, 1], [2, 2]], // Diagonal from top-left to bottom-right
        [[0, 2], [1, 1], [2, 0]], // Diagonal from top-right to bottom-left
    ];

    let player1 = null;
    let player2 = null;

    /**
     * Prompts the user to set up player names.
     * Ensures that both players have different names.
     */
    function setupPlayer() {
        const name1 = prompt("Set player 1 name: ", "PLAYER-1");
        const name2 = prompt("Set player 2 name: ", "PLAYER-2");

        // Ensure player names are different
        if (name1 === name2) {
            alert("Both players' names cannot be the same.");
            setupPlayer(); // Recursively call setupPlayer to re-prompt
        }

        player1 = createPlayer(name1, "X");
        player2 = createPlayer(name2, "O");
    }

    /**
     * Starts the game.
     * Sets up players if not already set, and initiates the game loop.
     */
    function start() {
        if (player1 === null && player2 === null) {
            setupPlayer();
        }

        gameLoop();

        // Prompt to play again or exit
        if (confirm("Play again?")) {
            restart();
        } else {
            console.log("* * * GAME EXIT * * *");
        }
    }

    /**
     * Main game loop.
     * Alternates turns between players and checks for a winner or a tie.
     */
    function gameLoop() {
        const gameBoardTotalCellCount = gameBoard.getTotalCellCount();
        let gameBoardFilledCellCount = gameBoard.getFilledCellCount();

        console.log("* * * GAME STARTED * * *\n\n");

        // Continue the game until all cells are filled
        while (gameBoardFilledCellCount !== gameBoardTotalCellCount) {
            let curPlayer = gameBoardFilledCellCount % 2 === 0 ? player1 : player2;

            render.renderGameBoard();

            let cellNumber;

            // Prompt the current player for a valid cell number
            do {
                cellNumber = parseInt(prompt(`${curPlayer.getPlayerName()}'s turn:`));
            } while (!gameBoard.setPlayerPosition(cellNumber, curPlayer.getPlayerMark()));

            gameBoardFilledCellCount = gameBoard.getFilledCellCount();

            // Check if the current player has won
            if (checkWinner(curPlayer)) {
                render.renderGameBoard();
                alert(`${curPlayer.getPlayerName()} won!`);
                break;
            }

            // Check for a tie
            if (gameBoardFilledCellCount === gameBoardTotalCellCount) {
                render.renderGameBoard();
                alert("tie!");
                break;
            }
        }
    }

    /**
     * Restarts the game.
     * Optionally allows players to rename themselves.
     */
    function restart() {
        if (confirm("Do you want to rename players?")) {
            player1 = null;
            player2 = null;
        }

        gameBoard.resetBoard();
        start();
    }

    /**
     * Checks if the given player has won the game.
     * @param {object} player - The player to check.
     * @returns {boolean} - True if the player has won, false otherwise.
     */
    function checkWinner(player) {
        const _gameBoard = gameBoard.getBoard();

        // Check each winning position
        for (const pos of winPositions) {
            let positionMatched = 0;

            // Count matching positions for the player's mark
            for (const [row, col] of pos) {
                if (_gameBoard[row][col] === player.getPlayerMark()) {
                    positionMatched++;
                }
            }

            // If all positions match, the player wins
            if (positionMatched === 3) {
                return true;
            }
        }

        return false;
    }

    return { start };
})();

Game.start();

