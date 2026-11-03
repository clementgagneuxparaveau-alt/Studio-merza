document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("pseudo-form");
    const input = document.getElementById("pseudo");

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const pseudo = input.value.trim();

        if (!pseudo) {
            input.focus();
            return;
        }

        localStorage.setItem("studioMerzaPseudo", pseudo);

        // Petite vérification
        const savedPseudo =
            localStorage.getItem("studioMerzaPseudo");

        if (savedPseudo === pseudo) {
            window.location.href = "index.html";
        }

    });

});