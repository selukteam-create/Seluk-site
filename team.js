// ================= ПОЛУЧЕНИЕ TEAM =================
function getTeamKey() {
    const path = window.location.pathname;

    console.log("PATH:", path);

    // получаем имя файла
    const file = path.split("/").pop(); // dota-main.html

    if (!file) return "cs2-main";

    const team = file.replace(".html", "");

    return team;
}

// ================= КАПИТАН =================
function isCaptain(player) {
    return player?.role?.toLowerCase().includes("captain");
}

// ================= ИКОНКИ РОЛЕЙ =================
function getRoleIcon(role) {
    if (!role) return "";

    const r = role.toLowerCase();

    if (r.includes("carry")) return "./Media/Carry.png";
    if (r.includes("mid")) return "./Media/Mid.png";
    if (r.includes("offlane")) return "./Media/offlane.png";
    if (r.includes("support") && !r.includes("hard")) return "./Media/Support.png";
    if (r.includes("hard")) return "./Media/Hard_support.png";

    return "";
}

// ================= ЗАГРУЗКА =================
async function loadTeam() {
    try {
        const teamKey = getTeamKey();

        console.log("Загружается состав:", teamKey);

        const res = await fetch("./team-data.json");
        const data = await res.json();

        const container = document.getElementById("team");
        if (!container) {
            console.error("#team контейнер не найден");
            return;
        }

        let team = data[teamKey];

        if (!team) {
            container.innerHTML = "<h2 style='padding:40px'>Team not found</h2>";
            return;
        }

        // копия массива (чтобы не ломать JSON)
        team = [...team];

        // всегда 5 слотов
        while (team.length < 5) {
            team.push(null);
        }

        // капитан первый
        team.sort((a, b) => {
            return (isCaptain(b) ? 1 : 0) - (isCaptain(a) ? 1 : 0);
        });

        render(team, container);

    } catch (e) {
        console.error("Ошибка загрузки team-data.json:", e);
    }
}

// ================= РЕНДЕР =================
function render(team, container) {
    container.innerHTML = "";

    team.forEach(player => {
        const isCap = isCaptain(player);

        const card = document.createElement("div");
        card.className = "player" + (isCap ? " captain" : "");

        const name = player?.name && player.name !== "Player"
            ? player.name
            : "Not yet";

        const img = player?.img || "./Media/0one.png";
        const role = player?.role || "—";

        const roleIcon = getRoleIcon(role);

        card.innerHTML = `
            ${isCap ? `<img src="./Media/crown.png" class="crown">` : ""}

            <img src="${img}" class="avatar">

            <div class="name-role">
                <span class="name">${name}</span>

                <span class="role">
                    ${roleIcon ? `<img src="${roleIcon}" class="role-icon">` : ""}
                    ${role}
                </span>
            </div>
        `;

        container.appendChild(card);
    });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadTeam);