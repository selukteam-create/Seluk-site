let currentPlayer = null;
let playersData = {};

async function loadPlayers() {
    try {
        const res = await fetch("./players.json");
        if (!res.ok) throw new Error("players.json не найден");

        playersData = await res.json();
        initClicks();

    } catch (e) {
        console.error("КРИТИЧЕСКАЯ ОШИБКА:", e);
    }
}

function initClicks() {
    const cards = document.querySelectorAll(".player");

    cards.forEach(card => {
        card.addEventListener("click", (e) => {
            e.stopPropagation();

            const id = card.dataset.player;
            if (!id) return;

            const player = playersData[id];
            if (!player) return;

            openModal(player);
        });
    });
}

function openModal(player) {
    currentPlayer = player;

    const modal = document.getElementById("player-modal");
    if (!modal) return;

    const avatar = document.getElementById("modal-avatar");
    const name = document.getElementById("modal-name");
    const bioEl = document.getElementById("modal-bio");
    const lang = localStorage.getItem("lang") || "ru";

    const bioText =
        typeof player.bio === "object"
            ? (player.bio[lang] || player.bio.ru || "")
            : player.bio || "";

    if (bioEl) bioEl.textContent = bioText;
    if (avatar) avatar.src = player.img || "";
    if (name) name.textContent = player.name || "";

    const birthStr = player.birth || player.birthday;

    if (birthStr) {
        const birth = new Date(birthStr);
        const now = new Date();

        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
            age--;
        }

        const ageEl = document.getElementById("modal-age");
        if (ageEl) {
            ageEl.textContent = age + " y.o.";
            ageEl.title = birthStr;
        }

        const isBirthday =
            now.getDate() === birth.getDate() &&
            now.getMonth() === birth.getMonth();

        const cake = document.getElementById("birthday-cake");

        if (cake) {
            if (isBirthday) {
                cake.style.display = "block";
                modal.classList.add("birthday-mode");
            } else {
                cake.style.display = "none";
                modal.classList.remove("birthday-mode");
            }
        }
    }

    const faceitBtn = document.getElementById("modal-faceit");

    if (faceitBtn) {
        if (player.faceit) {
            faceitBtn.style.display = "inline-block";
            faceitBtn.onclick = () => window.open(player.faceit);
        } else {
            faceitBtn.style.display = "none";
        }
    }

    const csBtn = document.getElementById("modal-csstats");

    if (csBtn) {
        if (player.csstats) {
            csBtn.style.display = "block";
            csBtn.onclick = () => window.open(player.csstats);
        } else {
            csBtn.style.display = "none";
        }
    }

    document.querySelectorAll(".modal-socials img").forEach(icon => {
        const type = icon.dataset.type;
        if (!type) return;

        const link = player[type];

        if (link) {
            icon.style.display = "inline-block";
            icon.onclick = () => window.open(link);
        } else {
            icon.style.display = "none";
        }
    });

    modal.classList.remove("hidden");
}

function closeModal() {
    const modal = document.getElementById("player-modal");
    if (modal) modal.classList.add("hidden");
}

document.addEventListener("click", (e) => {
    const modal = document.getElementById("player-modal");
    const content = document.querySelector(".modal-content");

    if (!modal || modal.classList.contains("hidden")) return;

    if (content && !content.contains(e.target)) {
        closeModal();
    }
});

function updateModalLanguage() {
    if (currentPlayer) {
        openModal(currentPlayer);
    }
}

document.addEventListener("DOMContentLoaded", loadPlayers);