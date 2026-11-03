document.addEventListener("DOMContentLoaded", () => {


    /* ========================================= */
    /* ÉLÉMENTS */
    /* ========================================= */

    const intro =
        document.getElementById("intro");

    const site =
        document.getElementById("site");

    const menuButton =
        document.getElementById("menu-button");

    const sideMenu =
        document.getElementById("side-menu");

    const closeMenu =
        document.getElementById("close-menu");

    const menuOverlay =
        document.getElementById("menu-overlay");

    const fixedLogo =
        document.querySelector(".fixed-logo");

    const heroContent =
        document.querySelector(".hero-content");

    const filmsGrid =
        document.getElementById("films-grid");

    const filmsEmpty =
        document.getElementById("films-empty");

    const filmCount =
        document.getElementById("film-count");

    const comingGrid =
        document.getElementById("coming-grid");

    const comingEmpty =
        document.getElementById("coming-empty");

    const comingCount =
        document.getElementById("coming-count");



    /* ========================================= */
    /* INTRO */
    /* ========================================= */

    document.body.style.overflow = "hidden";


    setTimeout(() => {

        if (intro) {

            intro.style.opacity = "0";

        }

    }, 4000);


    setTimeout(() => {

        if (intro) {

            intro.style.display = "none";

        }

        if (site) {

            site.style.opacity = "1";

        }

        document.body.style.overflow = "auto";

    }, 5000);



    /* ========================================= */
    /* MENU */
    /* ========================================= */

    function openMenu() {

        if (!sideMenu || !menuOverlay) {

            return;

        }

        sideMenu.classList.add("open");

        menuOverlay.classList.add("open");

        document.body.style.overflow = "hidden";

    }


    function closeSideMenu() {

        if (!sideMenu || !menuOverlay) {

            return;

        }

        sideMenu.classList.remove("open");

        menuOverlay.classList.remove("open");

        document.body.style.overflow = "auto";

    }


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            openMenu
        );

    }


    if (closeMenu) {

        closeMenu.addEventListener(
            "click",
            closeSideMenu
        );

    }


    if (menuOverlay) {

        menuOverlay.addEventListener(
            "click",
            closeSideMenu
        );

    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeSideMenu();

            }

        }
    );


    const menuLinks =
        document.querySelectorAll(
            ".side-menu nav a"
        );


    menuLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                closeSideMenu();

            }
        );

    });



    /* ========================================= */
    /* SCROLL */
    /* ========================================= */

    function handleScroll() {

        const scroll =
            window.scrollY;


        /* ------------------------------------- */
        /* GROS LOGO */
        /* ------------------------------------- */

        if (heroContent) {

            const opacity =
                Math.max(
                    0,
                    1 - scroll / 500
                );


            const translate =
                Math.min(
                    80,
                    scroll * 0.15
                );


            heroContent.style.opacity =
                opacity;

            heroContent.style.transform =
                `translateY(${translate}px)`;

        }


        /* ------------------------------------- */
        /* PETIT LOGO FIXE */
        /* ------------------------------------- */

        if (fixedLogo) {

            if (scroll > 100) {

                fixedLogo.style.transform =
                    "translateX(-50%) scale(.92)";

                fixedLogo.style.opacity =
                    "0.85";

            } else {

                fixedLogo.style.transform =
                    "translateX(-50%) scale(1)";

                fixedLogo.style.opacity =
                    "1";

            }

        }

    }


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );


    handleScroll();



    /* ========================================= */
    /* RÉCUPÉRATION DES FILMS */
    /* ========================================= */

    let films = [];


    try {

        films =
            JSON.parse(
                localStorage.getItem(
                    "studioMerzaFilms"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Erreur lors de la récupération des films :",
            error
        );

        films = [];

    }



    /* ========================================= */
    /* STATUT DES FILMS */
    /* ========================================= */

    function isComingSoon(film) {

        const status =
            String(
                film.status ||
                film.type ||
                film.category ||
                ""
            ).toLowerCase();


        return (
            status === "coming" ||
            status === "coming-soon" ||
            status === "a-venir" ||
            status === "à venir" ||
            status === "avenir" ||
            status === "project" ||
            status === "projet"
        );

    }



    /* ========================================= */
    /* FENÊTRE BANDE-ANNONCE DES PROJETS */
    /* ========================================= */

    let comingTrailerModal = null;

    function getYouTubeVideoId(url) {

        try {
            const parsed = new URL(url);
            const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

            if (host === "youtu.be") {
                return parsed.pathname.split("/").filter(Boolean)[0] || null;
            }

            if (host === "youtube.com" || host === "m.youtube.com") {
                if (parsed.pathname === "/watch") {
                    return parsed.searchParams.get("v");
                }

                const parts = parsed.pathname.split("/").filter(Boolean);
                if (["shorts", "embed", "live"].includes(parts[0])) {
                    return parts[1] || null;
                }
            }

        } catch (error) {
            return null;
        }

        return null;
    }

    function closeComingTrailer() {
        if (!comingTrailerModal) return;
        const frame = comingTrailerModal.querySelector("iframe");
        if (frame) frame.src = "about:blank";
        comingTrailerModal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    function openComingTrailer(project) {

        const videoId = getYouTubeVideoId(project.trailerUrl || "");

        if (!videoId) {
            alert("La bande-annonce de ce projet n'a pas de lien YouTube valide.");
            return;
        }

        if (!comingTrailerModal) {
            comingTrailerModal = document.createElement("div");
            comingTrailerModal.id = "coming-trailer-modal";
            comingTrailerModal.style.cssText = "position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:22px;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);";
            comingTrailerModal.innerHTML = `
                <div style="position:relative;width:min(100%,900px);background:#101010;border:1px solid rgba(212,175,55,.35);border-radius:14px;padding:18px;box-shadow:0 20px 80px rgba(0,0,0,.6);">
                    <button type="button" aria-label="Fermer" style="position:absolute;right:12px;top:8px;z-index:2;border:0;background:transparent;color:white;font-size:30px;cursor:pointer;">×</button>
                    <h2 class="coming-trailer-title" style="color:#d6b45c;font-size:20px;margin:0 42px 14px 0;"></h2>
                    <div style="position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:8px;overflow:hidden;">
                        <iframe title="Bande-annonce STUDIO MERZA" style="position:absolute;inset:0;width:100%;height:100%;border:0;" src="about:blank" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                </div>
            `;
            document.body.appendChild(comingTrailerModal);
            comingTrailerModal.querySelector("button").addEventListener("click", closeComingTrailer);
            comingTrailerModal.addEventListener("click", (event) => {
                if (event.target === comingTrailerModal) closeComingTrailer();
            });
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") closeComingTrailer();
            });
        }

        comingTrailerModal.querySelector(".coming-trailer-title").textContent = project.title || "Bande-annonce";
        comingTrailerModal.querySelector("iframe").src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
        comingTrailerModal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }


    /* ========================================= */
    /* SÉPARATION DES FILMS */
    /* ========================================= */

    const publishedFilms =
        films.filter(
            film => !isComingSoon(film)
        );


    const comingProjects =
        films.filter(
            film => isComingSoon(film)
        );



    /* ========================================= */
    /* AFFICHER MES FILMS */
    /* ========================================= */

    function displayFilms() {

        if (!filmsGrid) {

            return;

        }


        filmsGrid.innerHTML = "";


        if (publishedFilms.length === 0) {

            if (filmsEmpty) {

                filmsEmpty.classList.add(
                    "visible"
                );

            }


            if (filmCount) {

                filmCount.textContent =
                    "0 films";

            }

            return;

        }


        if (filmsEmpty) {

            filmsEmpty.classList.remove(
                "visible"
            );

        }


        if (filmCount) {

            filmCount.textContent =
                `${publishedFilms.length} film${
                    publishedFilms.length > 1
                        ? "s"
                        : ""
                }`;

        }


        publishedFilms.forEach(
            (film, index) => {

                const card =
                    document.createElement("a");


                card.className =
                    "film-card";


                /* ========================================= */
                /* LIEN VERS LE FILM */
                /* ========================================= */

                card.href =
                    `film.html?id=${encodeURIComponent(
                        film.id
                    )}`;


                /* ========================================= */
                /* CONTENU DE LA CARTE */
                /* ========================================= */

                card.innerHTML = `

                    <div class="film-thumbnail">

                        ${
                            film.thumbnail
                                ? `
                                    <img
                                        src="${escapeHtml(
                                            film.thumbnail
                                        )}"
                                        alt="${escapeHtml(
                                            film.title ||
                                            "Film STUDIO MERZA"
                                        )}"
                                    >
                                  `
                                : ""
                        }

                        <div class="play-button">
                            ▶
                        </div>

                    </div>


                    <div class="film-info">

                        <p class="film-number">
                            ${String(
                                index + 1
                            ).padStart(2, "0")}
                        </p>


                        <h3>
                            ${escapeHtml(
                                film.title ||
                                "Sans titre"
                            )}
                        </h3>


                        <p>
                            Réalisé par
                            ${escapeHtml(
                                film.director ||
                                "STUDIO MERZA"
                            )}
                        </p>


                        <div class="film-stats">

                            <span>
                                ${escapeHtml(
                                    film.year ||
                                    "2026"
                                )}
                            </span>

                            <span>
                                COURT-MÉTRAGE
                            </span>

                        </div>

                    </div>

                `;


                filmsGrid.appendChild(
                    card
                );


                card.style.opacity =
                    "0";

                card.style.transform =
                    "translateY(30px)";

                card.style.transition =
                    "all .7s ease";


                setTimeout(
                    () => {

                        card.style.opacity =
                            "1";

                        card.style.transform =
                            "translateY(0)";

                    },
                    150 * index
                );

            }
        );

    }



    /* ========================================= */
    /* AFFICHER À VENIR */
    /* ========================================= */

    function displayComingProjects() {

        if (!comingGrid) {

            return;

        }


        comingGrid.innerHTML = "";


        if (comingProjects.length === 0) {

            if (comingEmpty) {

                comingEmpty.classList.add(
                    "visible"
                );

            }


            if (comingCount) {

                comingCount.textContent =
                    "0 projets";

            }

            return;

        }


        if (comingEmpty) {

            comingEmpty.classList.remove(
                "visible"
            );

        }


        if (comingCount) {

            comingCount.textContent =
                `${comingProjects.length} projet${
                    comingProjects.length > 1
                        ? "s"
                        : ""
                }`;

        }


        comingProjects.forEach(
            (project, index) => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "coming-card";

                card.setAttribute("role", "button");
                card.setAttribute("tabindex", "0");
                card.setAttribute("aria-label", `Voir la bande-annonce de ${project.title || "ce projet"}`);
                card.style.cursor = "pointer";
                card.addEventListener("click", () => openComingTrailer(project));
                card.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openComingTrailer(project);
                    }
                });


                card.innerHTML = `

                    <div class="coming-thumbnail">

                        ${
                            project.thumbnail
                                ? `
                                    <img
                                        src="${escapeHtml(
                                            project.thumbnail
                                        )}"
                                        alt="${escapeHtml(
                                            project.title ||
                                            "Projet à venir"
                                        )}"
                                    >
                                  `
                                : ""
                        }

                        <div class="coming-overlay">

                            <span>
                                ▶ VOIR LA BANDE-ANNONCE
                            </span>

                        </div>

                    </div>


                    <div class="coming-info">

                        <span class="coming-year">

                            ${escapeHtml(
                                project.year ||
                                "À VENIR"
                            )}

                        </span>


                        <h3>

                            ${escapeHtml(
                                project.title ||
                                "Nouveau projet"
                            )}

                        </h3>


                        <p>

                            Réalisé par
                            ${escapeHtml(
                                project.director ||
                                "STUDIO MERZA"
                            )}

                        </p>

                    </div>

                `;


                comingGrid.appendChild(
                    card
                );


                card.style.opacity =
                    "0";

                card.style.transform =
                    "translateY(30px)";

                card.style.transition =
                    "all .7s ease";


                setTimeout(
                    () => {

                        card.style.opacity =
                            "1";

                        card.style.transform =
                            "translateY(0)";

                    },
                    150 * index
                );

            }
        );

    }



    /* ========================================= */
    /* AFFICHAGE */
    /* ========================================= */

    displayFilms();

    displayComingProjects();



    /* ========================================= */
    /* SÉCURITÉ HTML */
    /* ========================================= */

    function escapeHtml(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            String(text);


        return div.innerHTML;

    }

});