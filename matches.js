const ICONS = {
    cs2: "./Media/cs2.webp",
    dota2: "./Media/dota2.webp"
};

const RESULT_TAG = {
    win: "W",
    lose: "L",
    draw: "D"
};

async function loadMatches() {
    try {
        const res = await fetch("./data.json");
        if (!res.ok) throw new Error("data.json не найден");

        const data = await res.json();
        const matches = data.matches || [];

        const container = document.getElementById("matches");
        if (!container) return;

        container.innerHTML = "";

        const fragment = document.createDocumentFragment();

        matches.forEach((match, i) => {
            const div = document.createElement("div");
            div.className = `match ${match.result || "draw"}`;

            const icon = ICONS[match.game] || ICONS.dota2;
            const tag = RESULT_TAG[match.result] || "D";

            div.innerHTML = `
                <img src="${icon}" class="match-icon" alt="game">

                <div class="result-tag ${match.result}">
                    ${tag}
                </div>

                <div class="teams">
                    <span class="our">${match.our || "Unknown"}</span>
                    <span class="enemy"> — ${match.enemy || "Unknown"}</span>
                </div>

                <div class="score ${match.result}">
                    ${match.score || "0:0"}
                </div>
            `;

            div.addEventListener("mouseenter", () => {
                if (typeof showHint === "function") {
                    showHint(
                        match.game === "cs2"
                            ? "Клик — открыть матч"
                            : "Клик — скопировать ID"
                    );
                }
            });

            div.addEventListener("click", () => {
                if (match.game === "cs2" && match.link) {
                    window.open(match.link, "_blank");
                } else if (match.matchId) {
                    navigator.clipboard.writeText(match.matchId);
                    if (typeof showHint === "function") {
                        showHint("ID скопирован");
                    }
                }
            });

            div.style.animationDelay = `${i * 0.06}s`;

            fragment.appendChild(div);
        });

        container.appendChild(fragment);

    } catch (e) {
        console.error("Ошибка матчей:", e);
    }
}

document.addEventListener("DOMContentLoaded", loadMatches);