class state {
    constructor(game) {
        this.state = [];

        let board = game.board.board;

        for (let row of board) {
            for (let tile of row) {
                if (tile.flagged) this.state.push(-1);
                else if (tile.hidden) this.state.push(0);
                else this.state.push(1);
            }
        }
    }

    compare(state) {
        for (let i in this.state)
            if (state.state[i] !== this.state[i])
                return false;
        return true;
    }
}