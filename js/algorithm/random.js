const random = (game) => {
    if (game.failed || game.complete()) return;

    let board = game.board;
    let available = [];

    for (let row of board.board)
        for (let tile of row)
            if (tile.hidden && !tile.flagged)
                available.push(tile);

    let index = Math.floor(Math.random() * available.length);
    game.reveal(available[index].address);
};