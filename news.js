async function loadNews() {
    try {
        const res = await fetch('./news.json');
        if (!res.ok) throw new Error("Ошибка загрузки JSON");

        const news = await res.json();
        const container = document.getElementById('news-container');
        if (!container) return;

        container.innerHTML = "";

        if (!news.length) {
            container.innerHTML = `<p>${translations[currentLang]["no_news"]}</p>`;
            return;
        }

        const fragment = document.createDocumentFragment();

        [...news].reverse().forEach(item => {
            const title = item.title?.[currentLang] || item.title?.ru || item.title || "";
            const text = item.text?.[currentLang] || item.text?.ru || item.text || "";

            const card = document.createElement('div');
            card.className = 'news-card';

            card.innerHTML = `
                <img src="${item.image}" alt="${title}">
                <div class="news-content">
                    <h2>${title}</h2>
                    <span class="date">${item.date || ""}</span>
                    <p>${text}</p>
                </div>
            `;

            fragment.appendChild(card);
        });

        container.appendChild(fragment);

    } catch (err) {
        console.error(err);

        const container = document.getElementById('news-container');
        if (container) {
            container.innerHTML = `<p>${translations[currentLang]["error"]}</p>`;
        }
    }
}

document.addEventListener("DOMContentLoaded", loadNews);