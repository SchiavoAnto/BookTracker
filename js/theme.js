let headerEl;
let pageTitleEl;
let pageTitleHeaderEl;

(() => {
    document.addEventListener("scroll", () => {
        if (!pageTitleEl) return;
        const titleRect = pageTitleEl.getBoundingClientRect();
        if ((titleRect.y + titleRect.height) < header.getBoundingClientRect().height) {
            pageTitleHeaderEl.style.opacity = "1";
        } else {
            pageTitleHeaderEl.style.opacity = "0";
        }
    });
})();

window.addEventListener("load", () => {
    headerEl = document.getElementById("header");
    pageTitleEl = document.getElementById("page-title");
    pageTitleHeaderEl = document.getElementById("page-title-header");
});