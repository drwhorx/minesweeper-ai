const run = async (game) => {
    let now, then;
    while (!game.failed && !game.complete()) {
        then = new state(game);
        simple(game);
        endgame(game);
        zone(game);
        now = new state(game);

        if (now.compare(then)) random(game);
        //await new Promise(resolve => setTimeout(resolve, 200));
    }
    if (game.failed) {
        document.getElementById("losses").innerText++;
        document.getElementById("result").innerText = "large oof";
    } else {
        document.getElementById("wins").innerText++;
        document.getElementById("result").innerText = "yeet";
    }
    let record = document.getElementById("wins").innerText / (parseInt(document.getElementById("wins").innerText) + parseInt(document.getElementById("losses").innerText));
    document.getElementById("record").innerText = Math.floor(record * 100) + "%";
};