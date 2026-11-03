document.addEventListener("DOMContentLoaded", () => {


    /* ================================= */
    /* ÉLÉMENTS */
    /* ================================= */

    const loginScreen =
        document.getElementById("login-screen");

    const dashboard =
        document.getElementById("dashboard");

    const loginForm =
        document.getElementById("login-form");

    const passwordInput =
        document.getElementById("admin-password");

    const loginError =
        document.getElementById("login-error");

    const logoutButton =
        document.getElementById("logout-button");



    /* ================================= */
    /* MOT DE PASSE */
    /* ================================= */

    const ADMIN_PASSWORD =
        "merza2026";



    /* ================================= */
    /* SESSION */
    /* ================================= */

    const adminConnected =
        sessionStorage.getItem(
            "studioMerzaAdmin"
        ) === "true";


    if (adminConnected) {

        showDashboard();

    }



    /* ================================= */
    /* CONNEXION */
    /* ================================= */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const password =
                    passwordInput.value;


                if (
                    password ===
                    ADMIN_PASSWORD
                ) {

                    sessionStorage.setItem(
                        "studioMerzaAdmin",
                        "true"
                    );


                    loginError.classList.remove(
                        "visible"
                    );


                    showDashboard();

                } else {

                    loginError.classList.add(
                        "visible"
                    );


                    passwordInput.value =
                        "";


                    passwordInput.focus();

                }

            }
        );

    }



    /* ================================= */
    /* AFFICHER DASHBOARD */
    /* ================================= */

    function showDashboard() {

        if (loginScreen) {

            loginScreen.style.display =
                "none";

        }


        if (dashboard) {

            dashboard.classList.add(
                "visible"
            );

        }


        updateDashboard();

    }



    /* ================================= */
    /* DONNÉES FILMS */
    /* ================================= */

    function getFilms() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "studioMerzaFilms"
                )
            ) || [];

        } catch (error) {

            console.error(
                "Impossible de récupérer les films :",
                error
            );

            return [];

        }

    }



    /* ================================= */
    /* DASHBOARD */
    /* ================================= */

    function updateDashboard() {

        const films =
            getFilms();


        const totalFilms =
            document.getElementById(
                "total-films"
            );


        const filmCount =
            document.getElementById(
                "film-count"
            );


        const dashboardFilms =
            document.getElementById(
                "dashboard-films"
            );


        const dashboardEmpty =
            document.getElementById(
                "dashboard-empty"
            );


        if (totalFilms) {

            totalFilms.textContent =
                films.length;

        }


        if (filmCount) {

            filmCount.textContent =
                films.length +
                (
                    films.length <= 1
                        ? " film"
                        : " films"
                );

        }


        if (
            !dashboardFilms ||
            !dashboardEmpty
        ) {

            return;

        }


        if (films.length === 0) {

            dashboardFilms.innerHTML =
                "";

            dashboardEmpty.style.display =
                "flex";

        } else {

            dashboardEmpty.style.display =
                "none";

            displayFilms(films);

        }


        updateStatistics();

    }



    /* ================================= */
    /* AFFICHER LES FILMS */
    /* ================================= */

    function displayFilms(films) {

        const container =
            document.getElementById(
                "dashboard-films"
            );


        if (!container) {

            return;

        }


        container.innerHTML =
            films.map(
                (film, index) => {

                    return `

                        <article
                            class="dashboard-film"
                            data-film-id="${escapeHtml(film.id)}"
                        >

                            <div
                                class="dashboard-thumbnail"
                                style="
                                    background-image:
                                    linear-gradient(
                                        to top,
                                        rgba(0,0,0,.65),
                                        rgba(0,0,0,.05)
                                    ),
                                    url('${film.thumbnail || ""}');
                                "
                            >

                                <span>
                                    ${String(
                                        index + 1
                                    ).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>

                                <div>
                                    ▶
                                </div>

                            </div>


                            <div class="dashboard-film-info">

                                <p class="film-type">
                                    COURT-MÉTRAGE
                                </p>


                                <h3>
                                    ${escapeHtml(
                                        film.title ||
                                        "Sans titre"
                                    )}
                                </h3>


                                <p class="film-date">

                                    ${escapeHtml(
                                        film.year ||
                                        "2026"
                                    )}

                                    •

                                    ${escapeHtml(
                                        film.director ||
                                        "STUDIO MERZA"
                                    )}

                                </p>


                                <div class="dashboard-film-stats">

                                    <span>
                                        👁
                                        <strong>
                                            ${film.views || 0}
                                        </strong>
                                        vues
                                    </span>


                                    <span>
                                        ♥
                                        <strong>
                                            ${film.likes || 0}
                                        </strong>
                                        likes
                                    </span>


                                    <span>
                                        💬
                                        <strong>
                                            ${film.comments || 0}
                                        </strong>
                                        commentaires
                                    </span>

                                </div>

                            </div>


                            <div class="film-actions">

                                <a
                                    href="film.html?id=${encodeURIComponent(
                                        film.id
                                    )}"
                                    target="_blank"
                                >
                                    Voir
                                </a>


                                <button
                                    type="button"
                                    class="delete-film"
                                    data-id="${escapeHtml(
                                        film.id
                                    )}"
                                >
                                    Supprimer
                                </button>

                            </div>

                        </article>

                    `;

                }
            ).join("");


        document
            .querySelectorAll(
                ".delete-film"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            deleteFilm(
                                button.dataset.id
                            );

                        }
                    );

                }
            );

    }



    /* ================================= */
    /* STATISTIQUES */
    /* ================================= */

    function updateStatistics() {

        const films =
            getFilms();


        let totalLikes =
            0;

        let totalViews =
            0;

        let totalComments =
            0;


        films.forEach(
            film => {

                totalLikes +=
                    Number(
                        film.likes
                    ) || 0;


                totalViews +=
                    Number(
                        film.views
                    ) || 0;


                totalComments +=
                    Number(
                        film.comments
                    ) || 0;

            }
        );


        const totalLikesElement =
            document.getElementById(
                "total-likes"
            );


        const totalViewsElement =
            document.getElementById(
                "total-views"
            );


        const totalCommentsElement =
            document.getElementById(
                "total-comments"
            );


        if (totalLikesElement) {

            totalLikesElement.textContent =
                totalLikes;

        }


        if (totalViewsElement) {

            totalViewsElement.textContent =
                totalViews;

        }


        if (totalCommentsElement) {

            totalCommentsElement.textContent =
                totalComments;

        }


        displayRecentComments(
            films
        );

    }



    /* ================================= */
    /* COMMENTAIRES RÉCENTS */
    /* ================================= */

    function displayRecentComments(
        films
    ) {

        const container =
            document.getElementById(
                "recent-comments"
            );


        if (!container) {

            return;

        }


        let allComments = [];


        films.forEach(
            film => {

                const key =
                    `studioMerzaComments_${film.id}`;


                try {

                    const comments =
                        JSON.parse(
                            localStorage.getItem(
                                key
                            )
                        ) || [];


                    comments.forEach(
                        comment => {

                            allComments.push({

                                ...comment,

                                filmTitle:
                                    film.title ||
                                    "Sans titre"

                            });

                        }
                    );

                } catch (error) {

                    console.error(
                        error
                    );

                }

            }
        );


        if (allComments.length === 0) {

            container.innerHTML = `

                <div class="no-comments">

                    <span>
                        💬
                    </span>

                    <p>
                        Aucun commentaire pour le moment.
                    </p>

                    <small>
                        Les commentaires des visiteurs
                        apparaîtront ici.
                    </small>

                </div>

            `;

            return;

        }


        const recent =
            allComments
                .slice(-5)
                .reverse();


        container.innerHTML =
            recent.map(
                comment => {

                    return `

                        <div
                            style="
                                padding:25px;
                                border-bottom:1px solid #171717;
                            "
                        >

                            <strong
                                style="
                                    font-size:11px;
                                "
                            >
                                ${escapeHtml(
                                    comment.pseudo
                                )}
                            </strong>


                            <small
                                style="
                                    display:block;
                                    margin-top:6px;
                                    color:#555;
                                    font-size:9px;
                                "
                            >
                                ${escapeHtml(
                                    comment.filmTitle
                                )}
                            </small>


                            <p
                                style="
                                    margin-top:10px;
                                    color:#777;
                                    font-size:11px;
                                    line-height:1.6;
                                "
                            >
                                ${escapeHtml(
                                    comment.text
                                )}
                            </p>

                        </div>

                    `;

                }
            ).join("");

    }



    /* ================================= */
    /* MODALE */
    /* ================================= */

    const filmModal =
        document.getElementById(
            "film-modal"
        );


    const addFilmButton =
        document.getElementById(
            "add-film-button"
        );


    const emptyAddFilm =
        document.getElementById(
            "empty-add-film"
        );


    const closeFilmModal =
        document.getElementById(
            "close-film-modal"
        );


    const cancelFilm =
        document.getElementById(
            "cancel-film"
        );


    const filmModalOverlay =
        document.getElementById(
            "film-modal-overlay"
        );


    function openFilmModal() {

        if (!filmModal) {

            return;

        }


        filmModal.classList.add(
            "visible"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeFilmModalFunction() {

        if (!filmModal) {

            return;

        }


        filmModal.classList.remove(
            "visible"
        );


        document.body.style.overflow =
            "";

    }


    if (addFilmButton) {

        addFilmButton.addEventListener(
            "click",
            openFilmModal
        );

    }


    if (emptyAddFilm) {

        emptyAddFilm.addEventListener(
            "click",
            openFilmModal
        );

    }


    if (closeFilmModal) {

        closeFilmModal.addEventListener(
            "click",
            closeFilmModalFunction
        );

    }


    if (cancelFilm) {

        cancelFilm.addEventListener(
            "click",
            closeFilmModalFunction
        );

    }


    if (filmModalOverlay) {

        filmModalOverlay.addEventListener(
            "click",
            closeFilmModalFunction
        );

    }



    /* ================================= */
    /* FORMULAIRE FILM */
    /* ================================= */

    const addFilmForm =
        document.getElementById(
            "add-film-form"
        );


    if (addFilmForm) {

        /* Choix de la catégorie : film publié ou projet à venir */
        if (!document.getElementById("film-status")) {

            const statusField = document.createElement("div");
            statusField.className = "form-group";
            statusField.style.marginBottom = "18px";
            statusField.innerHTML = `
                <label for="film-status" style="display:block;margin-bottom:8px;">
                    Type de publication
                </label>
                <select id="film-status" name="film-status" style="width:100%;padding:12px;border-radius:8px;">
                    <option value="published">Mes films (film disponible)</option>
                    <option value="coming">À venir (affiche + bande-annonce)</option>
                </select>
                <small style="display:block;margin-top:7px;opacity:.75;">
                    Pour un projet à venir, le lien du film complet n'est pas nécessaire.
                </small>
            `;

            const saveButtonBefore = addFilmForm.querySelector(".save-film");
            if (saveButtonBefore) {
                addFilmForm.insertBefore(statusField, saveButtonBefore);
            } else {
                addFilmForm.appendChild(statusField);
            }
        }

        /* Les champs YouTube obligatoires changent selon le type choisi. */
        const filmStatusInput = document.getElementById("film-status");
        const filmVideoInput = document.getElementById("film-video-url");
        const filmTrailerInput = document.getElementById("film-trailer-url");

        function updateFilmRequiredFields() {
            const isComingProject = filmStatusInput && filmStatusInput.value === "coming";

            if (filmVideoInput) {
                filmVideoInput.required = !isComingProject;
            }

            if (filmTrailerInput) {
                filmTrailerInput.required = Boolean(isComingProject);
            }
        }

        if (filmStatusInput) {
            filmStatusInput.addEventListener("change", updateFilmRequiredFields);
            updateFilmRequiredFields();
        }

        addFilmForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                /* ----------------------------- */
                /* RÉCUPÉRATION */
                /* ----------------------------- */

                const title =
                    document.getElementById(
                        "film-title"
                    ).value.trim();


                const year =
                    document.getElementById(
                        "film-year"
                    ).value;


                const director =
                    document.getElementById(
                        "film-director"
                    ).value.trim();


                const description =
                    document.getElementById(
                        "film-description"
                    ).value.trim();


                const thumbnailFile =
                    document.getElementById(
                        "film-thumbnail"
                    ).files[0];


                const videoUrl =
                    document.getElementById(
                        "film-video-url"
                    ).value.trim();


                const trailerUrl =
                    document.getElementById(
                        "film-trailer-url"
                    ).value.trim();

                const status =
                    document.getElementById("film-status").value;


                /* ----------------------------- */
                /* VÉRIFICATION */
                /* ----------------------------- */

                if (
                    !title ||
                    !year ||
                    !director ||
                    !description ||
                    !thumbnailFile ||
                    (status === "published" && !videoUrl) ||
                    (status === "coming" && !trailerUrl)
                ) {

                    alert(
                        status === "coming"
                            ? "Pour un projet à venir, ajoute au minimum son affiche et le lien de sa bande-annonce."
                            : "Remplis tous les champs obligatoires avant d'ajouter le film."
                    );

                    return;

                }


                /* ----------------------------- */
                /* VÉRIFICATION YOUTUBE */
                /* ----------------------------- */

                if (videoUrl && !isYouTubeUrl(videoUrl)) {

                    alert(
                        "Le lien du film doit être un lien YouTube valide."
                    );

                    return;

                }

                if (status === "coming" && !isYouTubeUrl(trailerUrl)) {

                    alert(
                        "Ajoute un lien YouTube valide pour la bande-annonce."
                    );

                    return;

                }


                if (
                    trailerUrl &&
                    !isYouTubeUrl(trailerUrl)
                ) {

                    alert(
                        "Le lien de la bande-annonce doit être un lien YouTube valide."
                    );

                    return;

                }



                /* ----------------------------- */
                /* MINIATURE */
                /* ----------------------------- */

                const MAX_IMAGE_SIZE =
                    2 * 1024 * 1024;


                if (
                    thumbnailFile.size >
                    MAX_IMAGE_SIZE
                ) {

                    alert(
                        "La miniature est trop lourde. Utilise une image de moins de 2 Mo."
                    );

                    return;

                }



                /* ----------------------------- */
                /* BOUTON */
                /* ----------------------------- */

                const saveButton =
                    addFilmForm.querySelector(
                        ".save-film"
                    );


                if (saveButton) {

                    saveButton.disabled =
                        true;

                    saveButton.innerHTML =
                        "Ajout en cours…";

                }



                try {

                    /* ------------------------- */
                    /* MINIATURE */
                    /* ------------------------- */

                    const thumbnail =
                        await fileToDataURL(
                            thumbnailFile
                        );


                    /* ------------------------- */
                    /* FILMS EXISTANTS */
                    /* ------------------------- */

                    const films =
                        getFilms();


                    /* ------------------------- */
                    /* CRÉATION FILM */
                    /* ------------------------- */

                    const film = {

                        id:
                            "film-" +
                            Date.now(),

                        number:
                            String(
                                films.length + 1
                            ).padStart(
                                2,
                                "0"
                            ),

                        title:
                            title,

                        year:
                            year,

                        director:
                            director,

                        description:
                            description,

                        status:
                            status,

                        thumbnail:
                            thumbnail,

                        /*
                         * LIEN YOUTUBE
                         */

                        videoUrl:
                            videoUrl,

                        /*
                         * BANDE-ANNONCE YOUTUBE
                         */

                        trailerUrl:
                            trailerUrl,

                        views:
                            0,

                        likes:
                            0,

                        comments:
                            0

                    };



                    /* ------------------------- */
                    /* SAUVEGARDE */
                    /* ------------------------- */

                    films.push(
                        film
                    );


                    try {

                        localStorage.setItem(
                            "studioMerzaFilms",
                            JSON.stringify(
                                films
                            )
                        );

                    } catch (storageError) {

                        films.pop();


                        console.error(
                            storageError
                        );


                        alert(
                            "Impossible de sauvegarder le film. La miniature est peut-être trop lourde."
                        );


                        return;

                    }



                    /* ------------------------- */
                    /* TERMINÉ */
                    /* ------------------------- */

                    addFilmForm.reset();


                    closeFilmModalFunction();


                    updateDashboard();


                    alert(
                        "Le film a bien été ajouté à STUDIO MERZA."
                    );


                } catch (error) {

                    console.error(
                        "Erreur pendant l'ajout du film :",
                        error
                    );


                    alert(
                        "Une erreur est survenue pendant l'ajout du film."
                    );

                } finally {

                    if (saveButton) {

                        saveButton.disabled =
                            false;

                        saveButton.innerHTML =
                            `
                                Ajouter le film
                                <span>→</span>
                            `;

                    }

                }

            }
        );

    }



    /* ================================= */
    /* VÉRIFIER LIEN YOUTUBE */
    /* ================================= */

    function isYouTubeUrl(url) {

        try {

            const parsedUrl =
                new URL(url);


            const hostname =
                parsedUrl.hostname
                    .toLowerCase()
                    .replace(
                        "www.",
                        ""
                    );


            return (
                hostname ===
                    "youtube.com" ||

                hostname ===
                    "youtu.be" ||

                hostname ===
                    "m.youtube.com"
            );

        } catch (error) {

            return false;

        }

    }



    /* ================================= */
    /* FICHIER → DATA URL */
    /* ================================= */

    function fileToDataURL(file) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();


                reader.onload =
                    () => {

                        resolve(
                            reader.result
                        );

                    };


                reader.onerror =
                    () => {

                        reject(
                            reader.error
                        );

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }



    /* ================================= */
    /* SUPPRIMER FILM */
    /* ================================= */

    function deleteFilm(id) {

        const confirmed =
            confirm(
                "Supprimer définitivement ce film ?"
            );


        if (!confirmed) {

            return;

        }


        const films =
            getFilms();


        const updatedFilms =
            films.filter(
                film =>
                    film.id !== id
            );


        localStorage.setItem(
            "studioMerzaFilms",
            JSON.stringify(
                updatedFilms
            )
        );


        updateDashboard();

    }



    /* ================================= */
    /* SÉCURITÉ HTML */
    /* ================================= */

    function escapeHtml(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            String(text);


        return div.innerHTML;

    }



    /* ================================= */
    /* DÉCONNEXION */
    /* ================================= */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                sessionStorage.removeItem(
                    "studioMerzaAdmin"
                );


                if (dashboard) {

                    dashboard.classList.remove(
                        "visible"
                    );

                }


                if (loginScreen) {

                    loginScreen.style.display =
                        "flex";

                }


                if (passwordInput) {

                    passwordInput.value =
                        "";

                }

            }
        );

    }

});