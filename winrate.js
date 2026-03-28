async function loadWinrate() {
    try {
        const params = new URLSearchParams(window.location.search);
        const team = params.get("team"); // 🔥 cs2-main

        const res = await fetch("./data.json");
        const data = await res.json();

        // 🔥 фильтр по составу
        const matches = data.matches.filter(m => m.roster === team);

        let wins = 0;

        matches.forEach(m => {
            if (m.result === "win") wins += 1;
            if (m.result === "draw") wins += 0.5;
        });

        const total = matches.length;
        const winrate = total ? ((wins / total) * 100).toFixed(1) : "0.0";

        renderWinrate(winrate);

    } catch (e) {
        console.error("Ошибка винрейта:", e);
    }
}

function renderWinrate(winrate) {
    const el = document.createElement("div");
    el.className = "global-winrate";
    el.textContent = `${winrate}% WR`;

    const value = parseFloat(winrate);

    if (value > 50) el.classList.add("win");
    else if (value < 50) el.classList.add("lose");
    else el.classList.add("mid");

    document.body.appendChild(el);
}

document.addEventListener("DOMContentLoaded", loadWinrate);