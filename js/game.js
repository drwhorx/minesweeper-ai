const Tile = function (value, board, address) {
    this.value = value;
    this.board = board;
    this.address = address;
    this.bomb = value === -1;
    this.blank = value === 0;
    this.hidden = true;
    this.flagged = false;
    this.display = null;

    this.neighbors = () => {
        let left = Math.max(0, this.address.col - 1);
        let right = Math.min(this.address.col + 1, this.board.cols - 1);
        let top = Math.max(0, this.address.row - 1);
        let bottom = Math.min(this.address.row + 1, this.board.rows - 1);

        let output = [];

        for (let row1 = top; row1 <= bottom; row1++) {
            for (let col1 = left; col1 <= right; col1++) {
                if (this.address.row !== row1 || this.address.col !== col1)
                    output.push(this.board.board[row1][col1]);
            }
        }

        return output;
    };

    this.completed = () => {
        let flagged = this.neighbors.map(tile => tile.flagged);
        let empty = this.neighbors.map(tile => tile.hidden && !tile.flagged);
        return this.blank || (flagged.length === this.value && empty.length === 0);
    };
};

const Board = function (rows, cols, bombs) {
    this.rows = rows;
    this.cols = cols;
    this.bombs = bombs;
    this.board = [];

    for (let row = 0; row < rows; row++) {
        this.board.push([]);
        for (let col = 0; col < cols; col++)
            this.board[row].push(null);
    }

    for (let i = 0; i < bombs; i++) {
        let row = 0, col = 0;
        while (this.board[row][col] != null) {
            row = Math.floor(Math.random() * rows);
            col = Math.floor(Math.random() * cols);
        }
        this.board[row][col] = new Tile(-1, this, {row: row, col: col});
    }

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (this.board[row][col] !== null) continue;
            this.board[row][col] = new Tile(0, this, {row: row, col: col});
            this.board[row][col].value = this.board[row][col].neighbors()
                .filter(tile => tile != null && tile.bomb).length;
        }
    }

    this.board.forEach(row =>
        row.forEach(tile =>
            tile.neighbors = tile.neighbors()
        )
    );

    this.copy = () => {
        let copy_board = new Board(this.rows, this.cols, this.bombs);
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                copy_board.board[row][col] = new Tile(this.board[row][col].value, copy_board, this.board[row][col].address)
            }
        }

        copy_board.board.forEach(row =>
            row.forEach(tile =>
                tile.neighbors = tile.neighbors()
            )
        );

        return copy_board;
    };
};

const Game = function (board, div) {
    this.board = board;
    this.div = div;
    this.failed = false;
    this.flags = 0;
    this.score = 0;

    board.game = this;

    this.flag = (address) => {
        if (this.failed) return;
        let tile = this.board.board[address.row][address.col];
        if (!tile.hidden && tile.value !== 0 && tile.neighbors.filter(tile1 => tile1.flagged).length === tile.value) {
            tile.hidden = false;
            tile.display.classList.remove("hidden");
            return tile.neighbors.filter(tile1 => tile1.hidden).map(tile1 => tile1.address).forEach(this.reveal);
        }
        if (!tile.flagged && tile.hidden) {
            tile.flagged = true;
            tile.display.classList.add("flagged");
            this.flags++;
            this.score++;
        } else if (tile.flagged) {
            tile.flagged = false;
            tile.display.classList.remove("flagged");
            this.flags--;
            this.score--;
        }
    };

    this.reveal = (address) => {
        if (this.failed) return;
        let tile = this.board.board[address.row][address.col];
        if (tile.flagged) return;
        if (tile.bomb) this.failed = true;
        if (!tile.blank && tile.neighbors.filter(tile1 => tile1.flagged).length == tile.value) {
            if (tile.hidden) this.score++;
            tile.hidden = false;
            tile.display.classList.remove("hidden");
            return tile.neighbors.filter(tile1 => tile1.hidden).map(tile1 => tile1.address).forEach(this.reveal);
        }
        if (!tile.hidden) return;
        this.score++;
        tile.hidden = false;
        tile.display.classList.remove("hidden");
        if (tile.value === 0) {
            tile.neighbors.map(tile1 => tile1.address).forEach(this.reveal);
        }
    };

    this.display = () => {
        let table = document.createElement("table");
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        table.cellSpacing = 0;
        table.classList.add("board");
        for (let row of this.board.board) {
            let tableRow = table.insertRow();
            row.forEach(tile => {
                let cell = tableRow.insertCell();
                cell.classList.add("tile", tile.value === -1 ? "bomb" : "tile" + tile.value, "hidden");

                let onclick = function (e) {
                    this.game.reveal(this.tile.address);
                };
                onclick = onclick.bind({tile: tile, game: this});
                cell.addEventListener('click', onclick);

                let onrightclick = function (e) {
                    e.preventDefault();
                    this.game.flag(this.tile.address);
                    return false;
                };
                onrightclick = onrightclick.bind({tile: tile, game: this});
                cell.addEventListener('contextmenu', onrightclick);

                tile.display = cell;
            });
        }

        this.div.innerHTML = "";
        this.div.appendChild(table);
    };

    this.complete = () => this.score === ROWS * COLS;
};