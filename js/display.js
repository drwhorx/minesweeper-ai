const play = async () => {
    let board = new Board(ROWS, COLS, BOMBS);
    let game = new Game(board.copy(), $("#game_div")[0]);
    game.display();
    document.game = game;
    document.getElementById("result").innerText = "";
    let solution = new Game(board, $("#solution")[0]);
    solution.display();
    for (let cell of Array.from($("#solution td")))
        cell.classList.remove("hidden");
    await run(game);
};
window.onload = async () => {
    for (let i = 0; i < 1000; i++) {
        await play();
        await new Promise(resolve => setTimeout(resolve, 100));
    }
};