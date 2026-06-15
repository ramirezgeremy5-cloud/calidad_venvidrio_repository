// ===============================
// INDEX REDIRECT LOGIC
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");

    // simulación de carga (UX)
    setTimeout(() => {

        if (token && token !== "undefined") {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "login.html";
        }

    }, 800);

});