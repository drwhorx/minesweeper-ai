const boolCombo = size => {
    const buf = Array(1 << size);
    for (let i = buf.length; i--;) {
        buf[i] = Array(size);
        for (let j = size; j--;)
            buf[i][j] = +!!(i & 1 << j)
    }
    return buf
};

const zone = (game) => {
    if (game.failed || game.complete()) return;

    let board = game.board;

    for (let row of board.board) {
        for (let tile of row) {
            if (tile.hidden || tile.value == 0) continue;
            if (game.failed) break;
            let border = tile.neighbors.filter(item => item.hidden && !item.flagged);
            let shared = [];
            for (let _tile of border)
                shared = shared.concat(
                    _tile.neighbors.filter(item => !shared.includes(item) && !item.hidden && !item.completed())
                );
            let permutations = boolCombo(border.length);
            let possible = [];

            for (let bools of permutations) {
                for (let b in bools) {
                    border[b].testFlag = bools[b] == 1;
                }
                let count = tile.neighbors.filter(item => item.flagged || item.testFlag).length;
                if (count != tile.value) continue;
                let impossible = false;
                for (let num of shared) {
                    let count = num.neighbors.filter(item => item.flagged || item.testFlag).length;
                    let unshared = num.neighbors.filter(item => item.hidden && !item.flagged && !border.includes(item)).length;
                    if (count > num.value || count + unshared < num.value) impossible = true;
                    if (impossible) break;
                }
                if (!impossible) possible.push(bools);
            }
            if (possible.length == 0) continue;

            for (let i in border) {
                let sum = 0;
                for (let j in possible)
                    if (possible[j][i]) sum++;
                let prob = sum / possible.length;
                border[i].probability = prob;
                if (prob == 1) game.flag(border[i].address);
                if (prob == 0) game.reveal(border[i].address);
                delete border[i].testFlag;
            }
        }
    }
};