document.addEventListener("DOMContentLoaded", () => {


    /* ================================= */
    /* RÉCUPÉRATION DU FILM */
    /* ================================= */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const filmId =
        params.get("id");


    let films = [];


    try {

        films =
            JSON.parse(
                localStorage.getItem(
                    "studioMerzaFilms"
                )
            ) || [];

    } catch (error) {

        console.error(error);

        films = [];

    }


    const film =
        films.find(
            item =>
                item.id === filmId
        );



    /* ================================= */
    /* ÉLÉMENTS */
    /* ================================= */

    const filmPlayer =
        document.getElementById(
            "film-player"
        );


    const placeholder =
        document.getElementById(
            "video-placeholder"
        );


    const filmTitle =
        document.querySelector(
            ".film-main-info h1"
        );


    const filmDescription =
        document.querySelector(
            ".film-main-info .description"
        );


    const filmLabel =
        document.querySelector(
            ".film-main-info .film-label"
        );


    const director =
        document.querySelector(
            ".film-main-info .director strong"
        );


    const pageTitle =
        document.querySelector(
            ".film-nav-title"
        );


    const trailerSection =
        document.getElementById(
            "trailer-section"
        );


    const trailerPlayer =
        document.getElementById(
            "trailer-player"
        );



    /* ================================= */
    /* FILM INTROUVABLE */
    /* ================================= */

    if (!film) {

        document.title =
            "Film introuvable — STUDIO MERZA";


        if (pageTitle) {

            pageTitle.textContent =
                "FILM INTROUVABLE";

        }


        if (filmTitle) {

            filmTitle.textContent =
                "Film introuvable";

        }


        if (filmDescription) {

            filmDescription.textContent =
                "Ce film n'existe pas ou n'est plus disponible.";

        }


        if (filmLabel) {

            filmLabel.textContent =
                "STUDIO MERZA";

        }


        if (director) {

            director.textContent =
                "STUDIO MERZA";

        }


        if (filmPlayer) {

            filmPlayer.innerHTML = `

                <div
                    class="video-placeholder"
                    style="display:flex;"
                >

                    <div class="placeholder-play">
                        ×
                    </div>

                    <p>
                        FILM INTROUVABLE
                    </p>

                    <span>
                        Ce film n'est plus disponible.
                    </span>

                </div>

            `;

        }


        if (trailerSection) {

            trailerSection.style.display =
                "none";

        }


        return;

    }



    /* ================================= */
    /* INFORMATIONS */
    /* ================================= */

    document.title =
        `${film.title || "Film"} — STUDIO MERZA`;


    if (pageTitle) {

        pageTitle.textContent =
            "COURT-MÉTRAGE";

    }


    if (filmTitle) {

        filmTitle.textContent =
            film.title ||
            "Sans titre";

    }


    if (filmLabel) {

        filmLabel.textContent =
            `STUDIO MERZA • ${film.number || "01"}`;

    }


    if (director) {

        director.textContent =
            film.director ||
            "STUDIO MERZA";

    }


    if (filmDescription) {

        filmDescription.textContent =
            film.description ||
            "Aucune description disponible.";

    }



    /* ================================= */
    /* MINIATURE */
    /* ================================= */

    if (
        film.thumbnail &&
        filmPlayer
    ) {

        filmPlayer.style.backgroundImage =
            `url("${film.thumbnail}")`;

        filmPlayer.style.backgroundSize =
            "cover";

        filmPlayer.style.backgroundPosition =
            "center";

    }



    /* ================================= */
    /* CONVERSION LIEN YOUTUBE */
    /* ================================= */

    function getYouTubeId(url) {

        if (!url) {

            return null;

        }


        try {

            const parsedUrl =
                new URL(url);


            /* youtube.com/watch?v= */

            if (
                parsedUrl.hostname.includes(
                    "youtube.com"
                ) &&
                parsedUrl.searchParams.get("v")
            ) {

                return parsedUrl.searchParams.get(
                    "v"
                );

            }


            /* youtu.be/xxxxx */

            if (
                parsedUrl.hostname ===
                "youtu.be"
            ) {

                return parsedUrl.pathname
                    .substring(1)
                    .split("/")[0];

            }


            /* youtube.com/shorts/xxxxx */

            if (
                parsedUrl.pathname.startsWith(
                    "/shorts/"
                )
            ) {

                return parsedUrl.pathname
                    .split("/")[2];

            }


            /* youtube.com/embed/xxxxx */

            if (
                parsedUrl.pathname.startsWith(
                    "/embed/"
                )
            ) {

                return parsedUrl.pathname
                    .split("/")[2];

            }

        } catch (error) {

            console.error(
                "Lien YouTube invalide :",
                error
            );

        }


        return null;

    }



    /* ================================= */
    /* CRÉATION LECTEUR YOUTUBE */
    /* ================================= */

    function createYouTubePlayer(
        url,
        container,
        autoplay = false
    ) {

        if (
            !url ||
            !container
        ) {

            return false;

        }


        const videoId =
            getYouTubeId(url);


        if (!videoId) {

            return false;

        }


        const autoplayValue =
            autoplay
                ? "1"
                : "0";


        container.innerHTML = `

            <iframe
                src="https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&autoplay=${autoplayValue}"
                title="STUDIO MERZA"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
            ></iframe>

        `;


        container.style.backgroundImage =
            "none";


        return true;

    }



    /* ================================= */
    /* FILM PRINCIPAL */
    /* ================================= */

    const videoUrl =
        film.videoUrl ||
        film.video ||
        "";


    const youtubeLoaded =
        createYouTubePlayer(
            videoUrl,
            filmPlayer
        );


    if (!youtubeLoaded) {

        if (filmPlayer) {

            filmPlayer.innerHTML = `

                <div
                    class="video-placeholder"
                    style="display:flex;"
                >

                    <div class="placeholder-play">
                        ▶
                    </div>

                    <p>
                        FILM INDISPONIBLE
                    </p>

                    <span>
                        La vidéo YouTube n'est pas disponible.
                    </span>

                </div>

            `;

        }

    }



    /* ================================= */
    /* BANDE-ANNONCE */
    /* ================================= */

    const trailerUrl =
        film.trailerUrl ||
        film.trailer ||
        "";


    if (
        trailerUrl &&
        trailerPlayer &&
        createYouTubePlayer(
            trailerUrl,
            trailerPlayer
        )
    ) {

        if (trailerSection) {

            trailerSection.style.display =
                "block";

        }

    } else {

        if (trailerSection) {

            trailerSection.style.display =
                "none";

        }

    }



    /* ================================= */
    /* VUES */
    /* ================================= */

    const viewsNumber =
        document.querySelector(
            ".views .stat-number"
        );


    let views =
        Number(
            film.views
        ) || 0;


    views++;


    film.views =
        views;


    const filmIndex =
        films.findIndex(
            item =>
                item.id === film.id
        );


    if (filmIndex !== -1) {

        films[filmIndex] =
            film;


        try {

            localStorage.setItem(
                "studioMerzaFilms",
                JSON.stringify(
                    films
                )
            );

        } catch (error) {

            console.error(error);

        }

    }


    if (viewsNumber) {

        viewsNumber.textContent =
            views;

    }



    /* ================================= */
    /* PSEUDO */
    /* ================================= */

    const pseudo =
        localStorage.getItem(
            "studioMerzaPseudo"
        ) || "Visiteur";


    const commentPseudo =
        document.getElementById(
            "comment-pseudo"
        );


    if (commentPseudo) {

        commentPseudo.textContent =
            pseudo;

    }



    /* ================================= */
    /* LIKES */
    /* ================================= */

    const likeButton =
        document.getElementById(
            "like-button"
        );


    const likeIcon =
        document.getElementById(
            "like-icon"
        );


    const likeCount =
        document.getElementById(
            "like-count"
        );


    const likeStorageKey =
        `studioMerzaLiked_${film.id}`;


    let liked =
        localStorage.getItem(
            likeStorageKey
        ) === "true";


    let likes =
        Number(
            film.likes
        ) || 0;


    function updateLikes() {

        if (likeCount) {

            likeCount.textContent =
                likes;

        }


        if (
            !likeButton ||
            !likeIcon
        ) {

            return;

        }


        if (liked) {

            likeButton.classList.add(
                "liked"
            );

            likeIcon.textContent =
                "♥";

        } else {

            likeButton.classList.remove(
                "liked"
            );

            likeIcon.textContent =
                "♡";

        }

    }


    updateLikes();


    if (likeButton) {

        likeButton.addEventListener(
            "click",
            () => {

                if (liked) {

                    liked = false;

                    likes =
                        Math.max(
                            0,
                            likes - 1
                        );

                } else {

                    liked = true;

                    likes++;

                }


                film.likes =
                    likes;


                const currentFilms =
                    JSON.parse(
                        localStorage.getItem(
                            "studioMerzaFilms"
                        )
                    ) || [];


                const currentIndex =
                    currentFilms.findIndex(
                        item =>
                            item.id === film.id
                    );


                if (currentIndex !== -1) {

                    currentFilms[currentIndex] =
                        film;


                    localStorage.setItem(
                        "studioMerzaFilms",
                        JSON.stringify(
                            currentFilms
                        )
                    );

                }


                localStorage.setItem(
                    likeStorageKey,
                    liked
                );


                updateLikes();

            }
        );

    }



    /* ================================= */
    /* COMMENTAIRES */
    /* ================================= */

    const form =
        document.getElementById(
            "comment-form"
        );


    const textarea =
        document.getElementById(
            "comment-text"
        );


    const commentsList =
        document.getElementById(
            "comments-list"
        );


    const commentCount =
        document.getElementById(
            "comment-count"
        );


    const commentsStorageKey =
        `studioMerzaComments_${film.id}`;


    let comments = [];


    try {

        comments =
            JSON.parse(
                localStorage.getItem(
                    commentsStorageKey
                )
            ) || [];

    } catch (error) {

        comments = [];

    }



    function displayComments() {

        if (commentCount) {

            commentCount.textContent =
                comments.length;

        }


        if (!commentsList) {

            return;

        }


        if (comments.length === 0) {

            commentsList.innerHTML = `

                <div class="empty-comments">

                    <span>
                        Aucun commentaire pour le moment.
                    </span>

                    <p>
                        Sois le premier à donner ton avis.
                    </p>

                </div>

            `;

            return;

        }


        commentsList.innerHTML =
            comments
                .map(
                    comment => {

                        return `

                            <article class="comment">

                                <div class="comment-author">
                                    ${escapeHtml(
                                        comment.pseudo ||
                                        "Visiteur"
                                    )}
                                </div>

                                <p>
                                    ${escapeHtml(
                                        comment.text ||
                                        ""
                                    )}
                                </p>

                            </article>

                        `;

                    }
                )
                .join("");

    }



    displayComments();



    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (!textarea) {

                    return;

                }


                const text =
                    textarea.value.trim();


                if (!text) {

                    textarea.focus();

                    return;

                }


                comments.push({

                    pseudo:
                        pseudo,

                    text:
                        text,

                    date:
                        new Date().toISOString()

                });


                localStorage.setItem(
                    commentsStorageKey,
                    JSON.stringify(
                        comments
                    )
                );


                film.comments =
                    comments.length;


                const currentFilms =
                    JSON.parse(
                        localStorage.getItem(
                            "studioMerzaFilms"
                        )
                    ) || [];


                const currentIndex =
                    currentFilms.findIndex(
                        item =>
                            item.id === film.id
                    );


                if (currentIndex !== -1) {

                    currentFilms[currentIndex] =
                        film;


                    localStorage.setItem(
                        "studioMerzaFilms",
                        JSON.stringify(
                            currentFilms
                        )
                    );

                }


                textarea.value =
                    "";


                displayComments();

            }
        );

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

});