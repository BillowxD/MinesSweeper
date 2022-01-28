const ASSETS = {
    DEFAULT: "images/default.png",
    FLAGGED: "images/flagged.png",
    BOMB:    "images/bomb.png"
};
/*
    Defining useful constants
    LEFT_CLICK - used to detect click of the left mouse click
    RIGHT_CLICK - used to detect click of the right mouse click
    GAME_WIDTH - used to set fixed size for our game table
*/
const LEFT_CLICK = 0,
      RIGHT_CLICK = 2,
      GAME_WIDTH = 500;

/*
    gBoard - is an array that stores all our game cells inside of it
*/
var gBoard = [];

/*
    gLevels - an object that holds all the gLevels objects in it.
*/
var gLevels = [
    { // Easy gLevel
        NAME: "Easy",
        SIZE: 4,
        MINES: 3
    }, { // Medium gLevel
        NAME: "Medium",
        SIZE: 8,
        MINES: 10
    }, { // Hard gLevel
        NAME: "Hard",
        SIZE: 16,
        MINES: 20
    }, { // Hard gLevel
        NAME: "Extreme",
        SIZE: 18,
        MINES: 40
    }
];

/*
    -- INFO
        gGame is the main object of the game.
        It includes all the information of our game.
    -- PARAMS
        @ gameLevel - hold the gameLevel we chose from the gLevels array
        @ isOn - indicates if the game has started
        @ shownCount - how many cells are opened
        @ MarkedCount - how many cells are marked with flags
        @ secsPassed - how many seconds passed from the moment we started the game
*/
var gGame = {
    gameLevel: {},
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

/*
    gameTable - used to access gameTable on DOM
    gameLevels - used to access gameLevels on DOM
    gameOptions - used to access gameOptions on DOM
    gameBoard - used to access gameBoard on DOM
*/
var gameTable, gameLevels, gameOptions, gameBoard;

/*
    -- INFO
        initGame is called whenever the page is loaded.
        1. It will define our gameLevels and gameBoard variables
            and give us access to them for later use.
        2. It calls a function that renders our Levels buttons in the game
*/

function initGame() {
    gameTable = document.getElementById("gameTable");
    gameLevels = document.getElementById("gameLevels");
    gameOptions = document.getElementById("gameOptions");
    gameBoard = document.getElementById("gameBoard");
    gameBoard.addEventListener('contextmenu', event => event.preventDefault());
    renderGameTable();
}

/*
    renderGameTable
    --INFO
        Generates the game levels
        Generates the gameOptions (Flags count, reset button, timer)
        Adding style to our gameBoard
*/
function renderGameTable() {
    renderLevels();
    renderGameOptions();
    performStyle();
}

/*
    performStyle()
    -- INFO
        Performing style to our gameBoard
*/
function performStyle() {
    gameTable.style.width = GAME_WIDTH+"px";
    gameTable.style.fontFamily = "arial";
    gameTable.style.border = "0";
    gameBoard.style.width = GAME_WIDTH+"px";
    gameOptions.style.height = "65px";
    gameOptions.style.textAlign = "center";
    var gameOptionsTDs = gameOptions.querySelectorAll("td");
    for (td of gameOptionsTDs) {
        td.style.width = Math.floor(100 / gameOptionsTDs.length) + "%";
        td.style.fontSize = "2rem";
        td.style.verticalAlign = "middle";
    }
}

/*
    renderLevels()
    -- INFO
        This function is rendering our game levels has buttons on DOM
*/
function renderLevels() {
    var td, levelBtn;
    td = document.createElement("td");
    td.setAttribute("colspan", "100%");
    for (var i = 0; i < gLevels.length; i++) {
        var gLevel = gLevels[i];
        levelBtn = document.createElement("button");
        levelBtn.innerText = gLevel.NAME;
        levelBtn.setAttribute("level", i);
        levelBtn.onclick = function(event) {
            var level = this.getAttribute("level");
            startGame(gLevels[level]);
        }
        td.appendChild(levelBtn);
    }
    gameLevels.appendChild(td);
}

/*
    renderGameOptions
    -- INFO
        Adding to our game board the game options which are flags count, reset button, timer
*/
function renderGameOptions() {
    var td;
    td = document.createElement("td");
        td.setAttribute("id", "flags");
        td.className = "gameInfo";
    gameOptions.appendChild(td);
        td = document.createElement("td");
            button = document.createElement("button");
            button.innerText = "Reset";
            button.setAttribute("id", "reset");
            button.style.display = "none";
            button.onclick = function(e) {
                startGame(gGame.gameLevel);
            };
        td.appendChild(button);
    gameOptions.appendChild(td);
        td = document.createElement("td");
        td.setAttribute("id", "timer");
        td.className = "gameInfo";
    gameOptions.appendChild(td);
}

/*
    startGame()
    -- PARAMS
        @ gameLevel - gLevel object that contains the SIZE and MINES
    -- INFO
        This method is used inorder to generate the game by the information
        we recevied from our gameLevel
*/

function initGameDefaults(gameLevel) {
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.gameLevel = gameLevel;
    if (typeof gGame.timer !== typeof undefined) {
        clearInterval(gGame.timer);
    }
    gGame.timer = setInterval(function() {
        gGame.secsPassed++;
        document.getElementById("timer").innerText = gGame.secsPassed;
    }, 1000);
    document.getElementById("timer").innerText = gGame.secsPassed;
    document.getElementById("flags").innerHTML = gGame.gameLevel.MINES - gGame.markedCount + `<img src="${ASSETS.FLAGGED}" width="20px" height="20" />`;
}

/*
    startGame()
    -- PARAMS
        @gameLevel - indicates our game information, amount of mines and board size
    -- INFO
        Inits a new game,
        generates game board,
        sperading the mines on the board
        calls renderGame()
*/

function startGame(gameLevel) {
    if (gameLevel == null || typeof gameLevel === typeof undefined) return;
    setResetHidden(true);
    initGameDefaults(gameLevel);
    gBoard = [];
    for (var y = 0; y < gameLevel.SIZE; y++)
        for (var x = 0; x < gameLevel.SIZE; x++) {
            var CELL = {
                minesAroundCount: 0,
                isShown: false,
                isMine: gBoard.length < gameLevel.MINES,
                isMarked: false
            };
            gBoard.push(CELL);
        }
    gBoard.sort((a, b) => {
        return 0.5 - Math.random();
    });
    renderGame();
}

/*
    renderGame()
    -- INFO
        rendering our game board to the DOM
*/
function renderGame() {
    gameBoard.innerHTML = "";
    var gameBoardTD, table, tr, td;
    gameBoardTD = document.createElement("td");
    gameBoardTD.setAttribute("colspan", "100%");
        table = document.createElement("table");
        for (var y = 0; y < gGame.gameLevel.SIZE; y++) {
            tr = document.createElement("tr");
            for (var x = 0; x < gGame.gameLevel.SIZE; x++) {
                var index = (y * gGame.gameLevel.SIZE) + x;
                gBoard[index].index = index;
                gBoard[index].minesAroundCount = calculateMinesAround(gBoard[index]);
                td = document.createElement("td");
                td.appendChild(createCell(gBoard[index]));
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        gameBoardTD.appendChild(table);
    gameBoard.appendChild(gameBoardTD);
}

/*
    calculateMinesAround
    -- PARAMS
        @cell - gBoard cell
    -- INFO
        calculate the mines around the speicifc given cell
*/
function calculateMinesAround(cell) {
    var mines = 0;
    for (var nearCell of getCellsAroundCell(cell)) {
        if (nearCell.isMine) mines++;
    }
    return mines;
}

/*
    getCellsAroundCell
    -- PARAMS
        @cell - gBoard cell
    -- INFO
        getting all the cells around the specific given cell
*/
function getCellsAroundCell(cell) {
    var myPos = (cell.index+1) / gGame.gameLevel.SIZE;
    myPos = myPos - Math.floor(myPos);
    if (myPos == 0) myPos = 1;
    myPos = Math.floor(myPos * gGame.gameLevel.SIZE);
    var cells = [];
    if (cell.index - gGame.gameLevel.SIZE >= 0) // TOP
        cells.push(gBoard[cell.index - gGame.gameLevel.SIZE]);
    if (myPos > 1 && cell.index - (gGame.gameLevel.SIZE+1) >= 0) // TOP LEFT
        cells.push(gBoard[cell.index - (gGame.gameLevel.SIZE+1)]);
    if (myPos < gGame.gameLevel.SIZE && cell.index - (gGame.gameLevel.SIZE-1) >= 0) // TOP RIGHT
        cells.push(gBoard[cell.index - (gGame.gameLevel.SIZE-1)]);
    if (myPos > 1) // LEFT
        cells.push(gBoard[cell.index-1]);
    if (myPos < gGame.gameLevel.SIZE && cell.index+1 < gBoard.length) // RIGHT
        cells.push(gBoard[cell.index+1]);
    if (cell.index + gGame.gameLevel.SIZE < gBoard.length) // BOTTOM
        cells.push(gBoard[cell.index + gGame.gameLevel.SIZE]);
    if (myPos > 1 && cell.index + (gGame.gameLevel.SIZE-1) < gBoard.length) // BOTTOM LEFT
        cells.push(gBoard[cell.index + (gGame.gameLevel.SIZE-1)]);
    if (myPos < gGame.gameLevel.SIZE && cell.index + (gGame.gameLevel.SIZE+1) < gBoard.length) // BOTTOM RIGHT
        cells.push(gBoard[cell.index + (gGame.gameLevel.SIZE+1)]);

    return cells;
}

/*
    createCell()
    -- PARAMS
        @cell - gBoard cell
    -- INFO
        Creating the cell on the gameBoard DOM
*/
function createCell(cell) {
    var tile = document.createElement("img");
        tile.setAttribute("width", "100%");
        tile.setAttribute("height", "100%");
        tile.src = ASSETS.DEFAULT;
        tile.onmousedown = function(e) {
            if (cell.isShown || !gGame.isOn) return;
            if (e.button == RIGHT_CLICK) flagTile(cell);
            else if (e.button == LEFT_CLICK) openTile(cell);
            if (gGame.shownCount+gGame.markedCount == gGame.gameLevel.SIZE * gGame.gameLevel.SIZE) endGame(true);
        }
        cell.tile = tile;
    return tile;
}

/*
    flagTile()
    -- PARAMS
        @cell - gBoard cell
    -- INFO
        Flagging the cell on DOM
        Updating the model that a new cell is now flagged
*/
function flagTile(cell) {
    if (!cell.isMarked && gGame.markedCount == gGame.gameLevel.MINES) return;
    if (cell.isMarked) cell.tile.src = ASSETS.DEFAULT;
    else cell.tile.src = ASSETS.FLAGGED;
    cell.isMarked = !cell.isMarked;
    if (cell.isMarked) gGame.markedCount++;
    else gGame.markedCount--;
    document.getElementById("flags").innerHTML = gGame.gameLevel.MINES - gGame.markedCount + `<img src="${ASSETS.FLAGGED}" width="20px" height="20" />`;
}

/*
    openTile
    -- PARAMS
        @cell - gBoard cell
    -- RECURSIVE
    -- INFO
        Opening the cell tile
        if it's mine it will end the game.
        if it have 0 mines around it will open the around cells aswell
*/
function openTile(cell) {
    if (cell.isMarked || cell.isShown) return;
    cell.isShown = true;
    gGame.shownCount++;
    if (cell.isMine) return endGame();
    cell.tile.src = "images/"+cell.minesAroundCount+".png";
    if (cell.minesAroundCount == 0) {
        for (var nearCell of getCellsAroundCell(cell)) {
            openTile(nearCell);
        }
    }
}

/*
    endGame
    -- PARAMS
        @win - boolean param that indicates if the player have won
    -- INFO
        this method is used inorder to end the game.
*/
function endGame(win = false) {
    gGame.isOn = false;
    clearInterval(gGame.timer);
    if (win) alert("You won");
    else {
        for (cell of gBoard) {
            if (cell.isMine) {
                cell.tile.src = ASSETS.BOMB;
            }
        }
        alert("You lost..");
    }
    setResetHidden(false);
}

/*
    toggleReset
    -- INFO
        this method is toggeling wheter the reset buttons is shown or not
*/
function toggleReset() {
    document.getElementById("reset").style.display == "block" ? document.getElementById("reset").style.display = "none" : document.getElementById("reset").style.display = "block";
}

/*
    setResetHidden
    -- PARAMS
        @hidden - boolean that indicates the display state of the reset button, true = hidden, false = block
    -- INFO
        this method is used to update the DOM wheter to show the reset button or not
*/
function setResetHidden(hidden) {
    if (hidden) document.getElementById("reset").style.display = "none";
    else document.getElementById("reset").style.display = "block";
}
