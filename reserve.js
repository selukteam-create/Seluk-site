document.addEventListener("DOMContentLoaded", () => {

    const players = document.querySelectorAll(".player");

    players.forEach(player => {

        const nameEl = player.querySelector(".name");
        const roleEl = player.querySelector(".role");

        if (nameEl) nameEl.textContent = player.dataset.name || "Unknown";
        if (roleEl) roleEl.textContent = player.dataset.role || "—";

        const icons = player.querySelectorAll(".modal-socials img");

        icons.forEach(icon => {
            const type = icon.dataset.type;

            icon.addEventListener("click", (e) => {
                e.stopPropagation();

                const link = player.dataset[type];

                if (link) {
                    window.open(link, "_blank");
                } else {
                    alert("Нет ссылки");
                }
            });
        });

    });

});