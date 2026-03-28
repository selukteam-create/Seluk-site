/* ================= LANG ================= */

const buttons = document.querySelectorAll(".lang-btn");

let translations = {};
let currentLang = "ru";

async function loadTranslations() {
    try {
        const res = await fetch("./translations.json");
        translations = await res.json();
    } catch (e) {
        console.error("Ошибка загрузки translations.json", e);
    }
}

function applyTranslations() {
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");

        if (translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    // ✅ фикс matches counter (без ломания DOM)
    const matchesText = document.querySelector(".matches-counter");
    const matchesNumEl = document.querySelector(".matches-num");

    if (matchesText && matchesNumEl && translations[currentLang].matches_played) {
        matchesText.innerHTML = `
            <span class="matches-num">${matchesNumEl.textContent}</span>
            ${translations[currentLang].matches_played}
        `;
    }
}

function setLanguage(lang) {
    if (!translations[lang]) return;

    currentLang = lang;
    localStorage.setItem("lang", lang);

    applyTranslations();

    // ✅ фикс активной кнопки
    buttons.forEach(b => b.classList.remove("active"));

    const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
    if (activeBtn) activeBtn.classList.add("active");
}

function initLang() {
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            setLanguage(btn.dataset.lang);
        });
    });
}

/* ================= PARALLAX ================= */

function initParallax() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 40;

        hero.style.transform = `translate(${x}px, ${y}px)`;
    });
}

/* ================= STATS ================= */

async function loadStats() {
    try {
        const res = await fetch("./data.json");
        const data = await res.json();

        const matches = document.querySelector(".matches-num");

        if (matches && data.matches) {
            matches.textContent = data.matches.length;
        }

    } catch (e) {
        console.error("Ошибка загрузки data.json:", e);
    }
}

/* ================= TEAM ================= */

function isCaptain(player) {
    if (!player || !player.role) return false;
    return player.role.toLowerCase().includes("captain");
}

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

function translateRole(role) {
    if (!role) return "—";

    const r = role.toLowerCase();

    if (r.includes("igl")) return translations[currentLang].igl;
    if (r.includes("short")) return translations[currentLang].short;
    if (r === "b") return translations[currentLang].b_anchor;
    if (r === "a") return translations[currentLang].a_anchor;
    if (r.includes("connector")) return translations[currentLang].connector;

    if (r.includes("carry")) return translations[currentLang].carry;
    if (r.includes("mid")) return translations[currentLang].mid;
    if (r.includes("offlane")) return translations[currentLang].offlane;
    if (r.includes("hard")) return translations[currentLang].hard_support;
    if (r.includes("support")) return translations[currentLang].support;

    return role;
}

async function loadTeam() {
    try {
        const res = await fetch("./team-data.json");
        const data = await res.json();

        const params = new URLSearchParams(window.location.search);
        const teamKey = params.get("team") || "cs2-main";

        const container = document.getElementById("team");
        if (!container) return;

        let team = data[teamKey];

        if (!team) throw new Error("TEAM NOT FOUND");

        while (team.length < 5) {
            team.push(null);
        }

        team.sort((a, b) => {
            return (isCaptain(b) ? 1 : 0) - (isCaptain(a) ? 1 : 0);
        });

        render(team, container);

    } catch (e) {
        console.error("Ошибка загрузки команды:", e);
    }
}

function render(team, container) {
    container.innerHTML = "";

    team.forEach(player => {
        const card = document.createElement("div");

        const isCap = isCaptain(player);
        card.className = "player" + (isCap ? " captain" : "");

        const name = (!player?.name || player.name === "Player")
            ? (translations?.[currentLang]?.not_yet || "Soon")
            : player.name;

        const img = player?.img || "./Media/0one.png";
        const role = player?.role || "—";

        const roleIcon = getRoleIcon(role);
        const translatedRole = translateRole(role);

        card.innerHTML = `
            ${isCap ? `<img src="./Media/crown.png" class="crown">` : ""}
            <img src="${img}" class="avatar">

            <div class="name-role">
                <span class="name">${name}</span>

                <span class="role">
                    ${roleIcon ? `<img src="${roleIcon}" class="role-icon">` : ""}
                    ${translatedRole}
                </span>
            </div>
        `;

        container.appendChild(card);
    });

    applyTranslations();
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", async () => {

    await loadTranslations();

    // ✅ ГЛАВНЫЙ ФИКС — язык берём ДО всего
    currentLang = localStorage.getItem("lang") || "ru";

    applyTranslations();
    initLang();
    initParallax();
    await loadStats();

    // ✅ сразу выставляем активную кнопку при загрузке
    const activeBtn = document.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
    if (activeBtn) {
        document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
        activeBtn.classList.add("active");
    }

    if (document.getElementById("team")) {
        loadTeam();
    }

    function initNavigation() {
        const links = document.querySelectorAll("[data-page]");

        links.forEach(link => {
            link.addEventListener("click", () => {
                const page = link.dataset.page;
                window.location.href = page + ".html";
            });
        });
    }
    if (typeof updateModalLanguage === "function") {
        updateModalLanguage();
    }

    initNavigation();
});