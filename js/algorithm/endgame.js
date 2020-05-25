const endgame = (game) => {
    if (game.failed || game.complete()) return;

    let board = game.board;
    let available = [];

    for (let row of board.board)
        for (let tile of row)
            if (tile.hidden && !tile.flagged)
                available.push(tile);

    if (available.length > 15) return;

    let permutations = boolCombo(available.length);
    let possible = [];

    for (let bools of permutations) {
        for (let b in bools) {
            available[b].testFlag = bools[b] == 1;
        }
        let total_flags = available.filter(item => item.testFlag).length;
        if (total_flags + game.flags != BOMBS) continue;

        let impossible = false;
        for (let tile of available) {
            let nums = tile.neighbors.filter(item => !item.hidden && !item.blank);
            for (let num of nums) {
                let count = num.neighbors.filter(item => item.flagged || item.testFlag).length;
                if (count != num.value) impossible = true;
                if (impossible) break;
            }
            if (impossible) break;
        }
        if (!impossible) possible.push(bools);
    }

    if (possible.length == 0) return;

    for (let i in available) {
        let sum = 0;
        for (let j in possible)
            if (possible[j][i]) sum++;
        let prob = sum / possible.length;
        available[i].probability = prob;
        if (prob == 1) game.flag(available[i].address);
        if (prob == 0) game.reveal(available[i].address);
        delete available[i].testFlag;
    }
};