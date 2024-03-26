const nav = document.querySelector("nav.categories-nav");
const menuButton = document.querySelector(".menu-button");
const sharesCounter = document.getElementById("shares");
const link = encodeURI(window.location.href);
const alertContainer = document.getElementById("alert-container");
const alertMessage = document.getElementById("alert-message");

menuButton.addEventListener("click", () => {
    console.log("x")
    nav.classList.toggle("closed");
})

function share(e) { //e is event
    e.preventDefault(); // niet refreshen
    fetch(window.top.location, {method: "POST"});
    sharesCounter.innerText++;

    if (navigator.share) {
        navigator.share({url: window.top.location});
    } else {
        navigator.clipboard.writeText(window.top.location);
        alertContainer.classList.remove("hidden");
        alertMessage.innerText = "URL Gekopieërd!";
        setTimeout(() => alertContainer.classList.add("hidden"), 2000);
    }
}

// new Date().toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric", year: "numeric"})