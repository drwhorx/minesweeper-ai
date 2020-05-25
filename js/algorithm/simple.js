const simple = (game) => {
    if (game.failed || game.complete()) return;

    let now, then;

    while (!then || !now || !now.compare(then)) {
        then = new state(game);

        for (let row of game.board.board) {
            for (let tile of row) {
                if (tile.hidden || tile.blank) continue;
                let possible = tile.neighbors.filter(item => item.hidden && !item.flagged);
                let flagged = tile.neighbors.filter(item => item.flagged);
                if (flagged.length == tile.value) {
                    possible.forEach(item => game.reveal(item.address));
                } else if (flagged.length + possible.length == tile.value) {
                    possible.forEach(item => game.flag(item.address));
                }
            }
        }

        now = new state(game);
    }
};