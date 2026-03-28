async function loadRosters() {
    try {
        const res = await fetch("./rosters.json");
        if (!res.ok) throw new Error("rosters.json не найден");

        const rosters = await res.json();

        const grid = document.getElementById("grid");
        if (!grid) return;

        grid.innerHTML = "";

        const fragment = document.createDocumentFragment();

        rosters.forEach((team, index) => {

            const card = document.createElement("div");
            card.className = "card";

            card.setAttribute(
                "data-num",
                (index + 1).toString().padStart(2, "0")
            );

            card.innerHTML = `
                <div class="card-bg">
                    <img src="${team.image}" class="icon" alt="">
                </div>

                <div class="card-content">
                    <h2>${team.name || "Unknown"}</h2>
                </div>
            `;

            card.addEventListener("click", () => {
                if (team.link) {
                    window.location.href = team.link;
                }
            });

            fragment.appendChild(card);
        });

        grid.appendChild(fragment);

    } catch (e) {
        console.error("Ошибка загрузки:", e);
    }
}

document.addEventListener("DOMContentLoaded", loadRosters);