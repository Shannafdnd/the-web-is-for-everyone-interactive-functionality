const nav = document.querySelector("nav");
const menuButton = document.querySelector(".menu-button");
const sharesCounter = document.getElementById("shares");

menuButton.addEventListener("click", () => [
    nav.classList.toggle("closed")
])

function share(slug) {
    fetch(`/post/${slug}`, {method: "post"});
    sharesCounter.innerText++;
    window.navigator.share({url: window.top.location});
}

// new Date().toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric", year: "numeric"})