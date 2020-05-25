class clump {
    constructor(tile) {
        this.nums = [];
        this.border = [];

        let recur = (tile) => {
            if (tile.hidden) return;
            let _border = tile.neighbors.filter(item => item.hidden && !item.flagged);
            _border.forEach(_border_tile => {
                if (!this.border.includes(_border_tile)) this.border.push(_border_tile);
                let _nums = _border_tile.neighbors.filter(item => !item.hidden && !item.completed());
                _nums.forEach(_num_tile => {
                    if (this.nums.includes(_num_tile)) return;
                    this.nums.push(_num_tile);
                    recur(_num_tile);
                })
            })
        };

        recur(tile);
    }

    compare(clump) {
        if (this.nums.length != clump.nums.length) return false;
        for (let tile of this.nums)
            if (!clump.nums.includes(tile)) return false;
        return true;
    }
}