const nav = document.querySelector("nav");
const menuButton = document.querySelector(".menu-button");

menuButton.addEventListener("click", () => [
    nav.classList.toggle("closed")
])

new Date().toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric", year: "numeric"})