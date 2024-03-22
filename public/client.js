const nav = document.querySelector("nav");
const menuButton = document.querySelector(".menu-button");
const sharesCounter = document.getElementById("shares");
const link = encodeURI(window.location.href);

menuButton.addEventListener("click", () => [
    nav.classList.toggle("closed")
])

function share(slug) {
    fetch(`/post/${slug}`, {method: "post"});
    sharesCounter.innerText++;
    navigator.clipboard.writeText(link);
    alert("Copied link");
}

// new Date().toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric", year: "numeric"})