(function () {
    const game = document.getElementById('game');
    const testingBoard = document.getElementById('testingBoard');

    // Generate the 9 boards
    for (let b = 0; b < 9; b++) {
        let board = document.createElement('div');
        board.classList.add('board');
        board.dataset.board = b;
        // Generate the 9 cells in each board
        for (let c = 0; c < 9; c++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.cell = c;
            board.appendChild(cell);
        }
        game.appendChild(board);
    }

    // Generate the testing board
    for (let c = 0; c < 9; c++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.cell = c;
        cell.addEventListener('click', handleTestingCellClick);
        testingBoard.appendChild(cell);
    }

    // Game state variables
    let currentPlayer = 'X';
    let gameActive = true;
    let boardStatus = Array(9).fill(null); // Stores 'X' or 'O' if board is won
    let boards = Array(9).fill(null).map(() => Array(9).fill(null)); // 9 boards, each with 9 cells
    let nextBoard = null; // The board index the next player must play in

    // Click event handler
    function handleCellClick(event) {
        const cell = event.target;
        const boardDiv = cell.parentElement;
        const boardIndex = parseInt(boardDiv.dataset.board);
        const cellIndex = parseInt(cell.dataset.cell);

        // Check if cell is already filled or game is inactive
        if (
            !gameActive ||
            cell.textContent !== '' ||
            (nextBoard !== null && nextBoard !== boardIndex)
        ) {
            return;
        }

        // Update cell content and add played class
        cell.textContent = currentPlayer;
        cell.classList.add('played');

        // Set color based on player
        if (currentPlayer === 'X') {
            cell.style.color = '#ff6347'; // Red for 'X'
        } else {
            cell.style.color = '#1e90ff'; // Blue for 'O'
        }

        // Additional game logic
        cell.classList.remove('ghost', 'ghost-x', 'ghost-o');
        delete cell.dataset.ghost;
        boards[boardIndex][cellIndex] = currentPlayer;

        // Check if the small board is won
        if (checkWin(boards[boardIndex], currentPlayer)) {
            boardStatus[boardIndex] = currentPlayer;
            boardDiv.classList.add('won');

            // Display the winner of the small board
            let overlay = document.createElement('div');
            overlay.classList.add('overlay');
            overlay.textContent = currentPlayer;

            // Set overlay color
            overlay.style.color = currentPlayer === 'X' ? '#ff6347' : '#1e90ff';
            overlay.style.textShadow = `0 0 10px rgba(${currentPlayer === 'X' ? '255, 99, 71' : '30, 144, 255'}, 0.8)`;
            boardDiv.appendChild(overlay);

            // Create particle effect
            createEnhancedParticles(boardDiv, currentPlayer);
        }

        // Check if the main game is won
        if (checkWin(boardStatus, currentPlayer)) {
            gameActive = false;
            showVictoryScreen(currentPlayer);
            return;
        }

        // Update nextBoard and switch player
        nextBoard = boardStatus[cellIndex] === null ? cellIndex : null;
        updateActiveBoards();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    // Handle mouse enter for ghost symbol
    function handleCellMouseEnter(event) {
        const cell = event.target;
        if (
            cell.textContent === '' &&
            !cell.classList.contains('disabled') &&
            gameActive
        ) {
            cell.dataset.ghost = currentPlayer;
            cell.classList.add('ghost');
            if (currentPlayer === 'X') {
                cell.classList.add('ghost-x');
            } else {
                cell.classList.add('ghost-o');
            }
        }
    }

    // Handle mouse leave to remove ghost symbol
    function handleCellMouseLeave(event) {
        const cell = event.target;
        if (cell.classList.contains('ghost')) {
            delete cell.dataset.ghost;
            cell.classList.remove('ghost', 'ghost-x', 'ghost-o');
        }
    }

    // Add event listeners to all cells
    const cells = document.querySelectorAll('#game .cell');
    cells.forEach((cell) => {
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('mouseenter', handleCellMouseEnter);
        cell.addEventListener('mouseleave', handleCellMouseLeave);
    });

    // Function to update active boards
    function updateActiveBoards() {
        const boardsDivs = document.querySelectorAll('.board');
        boardsDivs.forEach((boardDiv) => {
            const boardIndex = parseInt(boardDiv.dataset.board);
            if (boardStatus[boardIndex] !== null) {
                boardDiv.classList.remove('active');
                boardDiv
                    .querySelectorAll('.cell')
                    .forEach((cell) => cell.classList.add('disabled'));
            } else if (nextBoard === null || nextBoard === boardIndex) {
                boardDiv.classList.add('active');
                boardDiv.querySelectorAll('.cell').forEach((cell) => {
                    if (cell.textContent === '') {
                        cell.classList.remove('disabled');
                    } else {
                        cell.classList.add('disabled');
                    }
                });
            } else {
                boardDiv.classList.remove('active');
                boardDiv
                    .querySelectorAll('.cell')
                    .forEach((cell) => cell.classList.add('disabled'));
            }
        });
    }

    // Function to check for a win
    function checkWin(board, player) {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // columns
            [0, 4, 8],
            [2, 4, 6], // diagonals
        ];
        return winConditions.some((condition) => {
            return condition.every((index) => board[index] === player);
        });
    }

    // Enhanced Particle Effect Function
    function createEnhancedParticles(boardDiv, player) {
        const numParticles = 100; // Increased number of particles
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('enhanced-particle');

            // Random size between 5px and 15px
            const size = Math.random() * 10 + 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            // Center the particles
            particle.style.left = '99px';
            particle.style.top = '99px';

            // Random trajectory
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 150 + 50;
            const dx = Math.cos(angle) * distance + 'px';
            const dy = Math.sin(angle) * distance + 'px';
            particle.style.setProperty('--dx', dx);
            particle.style.setProperty('--dy', dy);

            // Set particle color based on player
            if (player === 'X') {
                particle.style.backgroundColor = '#ff6347'; // Tomato for 'X'
            } else {
                particle.style.backgroundColor = '#1e90ff'; // DodgerBlue for 'O'
            }

            boardDiv.appendChild(particle);

            // Remove particle after animation
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }

    // Show Victory Screen
    function showVictoryScreen(player) {
        const victoryScreen = document.getElementById('victoryScreen');
        const victoryMessage = document.getElementById('victoryMessage');
        victoryMessage.textContent = 'PLAYER ' + player + ' WINS!';
        victoryScreen.style.display = 'flex';
    }

    // Restart Game Function
    function restartGame() {
        // Reset game state variables
        currentPlayer = 'X';
        gameActive = true;
        boardStatus = Array(9).fill(null);
        boards = Array(9).fill(null).map(() => Array(9).fill(null));
        nextBoard = null;

        // Clear all cells
        const gameCells = document.querySelectorAll('#game .cell');
        gameCells.forEach((cell) => {
            cell.textContent = '';
            cell.classList.remove('played', 'disabled', 'ghost', 'ghost-x', 'ghost-o');
            delete cell.dataset.ghost;
        });

        // Clear testing board
        const testingCells = document.querySelectorAll('#testingBoard .cell');
        testingCells.forEach((cell) => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });

        // Remove all overlays and reset board styles
        const boardsDivs = document.querySelectorAll('.board');
        boardsDivs.forEach((boardDiv) => {
            boardDiv.classList.remove('won');
            boardDiv.classList.remove('active');
            boardDiv.style.backgroundColor = ''; // Remove background color
            // Remove overlay
            const overlay = boardDiv.querySelector('.overlay');
            if (overlay) {
                overlay.remove();
            }
        });

        // Hide victory screen if visible
        document.getElementById('victoryScreen').style.display = 'none';

        // Initialize active boards
        updateActiveBoards();
    }

    // Add event listener to restart button
    document.getElementById('restartButton').addEventListener('click', restartGame);

    // Add event listener to 'Play Again' button
    document.getElementById('playAgainButton').addEventListener('click', () => {
        restartGame();
    });

    // Handle testing board cell clicks
    function handleTestingCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.dataset.cell);

        // Remove existing popup if any
        const existingPopup = testingBoard.querySelector('.options-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create options popup
        const optionsPopup = document.createElement('div');
        optionsPopup.classList.add('options-popup');

        const message = document.createElement('p');
        message.textContent = '';
        optionsPopup.appendChild(message);

        // Create button group container
        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('button-group');

        const xButton = document.createElement('button');
        xButton.textContent = 'X';
        xButton.classList.add('x-button');
        xButton.addEventListener('click', () => {
            cell.textContent = 'X';
            cell.classList.add('x'); // Add class for color
            setBoardWinner(cellIndex, 'X');
            optionsPopup.remove();
        });
        buttonGroup.appendChild(xButton);

        const oButton = document.createElement('button');
        oButton.textContent = 'O';
        oButton.classList.add('o-button');
        oButton.addEventListener('click', () => {
            cell.textContent = 'O';
            cell.classList.add('o'); // Add class for color
            setBoardWinner(cellIndex, 'O');
            optionsPopup.remove();
        });
        buttonGroup.appendChild(oButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'CANCEL';
        cancelButton.classList.add('cancel-button');
        cancelButton.addEventListener('click', () => {
            optionsPopup.remove();
        });
        buttonGroup.appendChild(cancelButton);

        optionsPopup.appendChild(buttonGroup);

        // Append the popup to the testing board
        testingBoard.appendChild(optionsPopup);
    }

    // Function to set the board winner for testing
    function setBoardWinner(boardIndex, player) {
        // Update board status
        boardStatus[boardIndex] = player;

        // Update the main game board
        const boardDiv = document.querySelector(`.board[data-board='${boardIndex}']`);

        // Clear existing overlay if any
        const existingOverlay = boardDiv.querySelector('.overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        boardDiv.classList.add('won');

        // Display the winner of the small board
        let overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.textContent = player;

        // Set color based on player
        if (player === 'X') {
            overlay.style.color = '#ff6347'; // Tomato color for 'X'
            overlay.style.textShadow = '0 0 10px rgba(255, 99, 71, 0.8)';
        } else {
            overlay.style.color = '#1e90ff'; // DodgerBlue color for 'O'
            overlay.style.textShadow = '0 0 10px rgba(30, 144, 255, 0.8)';
        }

        boardDiv.appendChild(overlay);

        // Create enhanced particles effect
        createEnhancedParticles(boardDiv, player);

        // Check if the game is won
        if (checkWin(boardStatus, player)) {
            gameActive = false;
            showVictoryScreen(player);
            return;
        }

        updateActiveBoards();
    }

    // Initialize active boards
    updateActiveBoards();
})();
