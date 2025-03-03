// Show Post on scroll
document.addEventListener("DOMContentLoaded", () => {
    const posts = document.querySelectorAll(".post");

    const observerOptions = {
        root: null,
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const revealPost = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(revealPost, observerOptions);

    posts.forEach((post) => {
        observer.observe(post);
    });
});


// Fly In effect when clicking on .top ul li
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".top ul a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId); // Select the section

            if (targetSection) {
                // Show section
                targetSection.style.display = "block";

                // Smoothly scroll to the section
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});


// Run video when .cursor is on .post
document.addEventListener("DOMContentLoaded", () => {
    const posts = document.querySelectorAll(".post");

    posts.forEach((post) => {
        const video = post.querySelector("video");

        if (video) {
            post.addEventListener("mouseenter", () => {
                video.play();
            });

            post.addEventListener("mouseleave", () => {
                video.pause();
                video.currentTime = 0; // Reset video when the cursor is not on it
            });
        }
    });
});


// SVG highlight .top ul li
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section, .col");
    const navLinks = document.querySelectorAll(".top ul li");

    function highlightNav() {
        let scrollPosition = window.scrollY;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop + 40;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach((link) => link.classList.remove("show"));
                navLinks[index]?.classList.add("show");
            }
        });
    }

    window.addEventListener("scroll", highlightNav);
    highlightNav();
});


// SVG highlight .minTopUl ul li
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".col"); // Detect only `.col` elements
    const menuItems = document.querySelectorAll(".minTopUl ul li .svg svg");

    function highlightMenu() {
        let scrollPosition = window.scrollY;

        sections.forEach((section, index) => {
            let rect = section.getBoundingClientRect();
            let sectionTop = rect.top + window.scrollY - 100; // Adjust offset
            let sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                menuItems.forEach((item) => (item.style.display = "none"));

                if (menuItems[index]) {
                    menuItems[index].style.display = "block";
                }
            }
        });
    }

    window.addEventListener("scroll", highlightMenu);
    highlightMenu(); // Run on page load
});


// Follow Cursor effect for .top ul li elements
document.querySelectorAll(".top > nav > ul > li").forEach((li) => {
    li.addEventListener("mousemove", (e) => {
        const rect = li.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);

        li.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        const svg = li.querySelector(".svg");
        if (svg) {
            svg.style.transform = `translate(${x * 0.40}px, ${y * 0.40}px)`;
        }
    });

    li.addEventListener("mouseleave", () => {
        li.style.transform = "translate(0, 0)";
        const svg = li.querySelector(".svg");
        if (svg) {
            svg.style.transform = "translate(0, 0)";
        }
    });
});



// Follow Cursor effect for .buttonGroup button
document.querySelectorAll(".buttonGroup button").forEach((btn) => {
    const textSpan = btn.querySelector("span");

    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.10;
        const y = (e.clientY - rect.top) / rect.height - 0.10;

        // Move button slightly in cursor direction
        btn.style.transform = `translate(${x * 10}px, ${y * 10}px)`;

        // Move font more in cursor direction
        textSpan.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
        textSpan.style.transform = "";
    });
});


// Show .intro on scroll
document.addEventListener("DOMContentLoaded", function () {
    const introSection = document.querySelector(".intro");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                introSection.classList.add("show");
            }
        });
    }, { threshold: 0.2 });

    observer.observe(introSection);
});


// Show .minTopUl on click
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".minTopUlbtn");
    const menu = document.querySelector(".minTopUl");

    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            menu.classList.toggle("show");
        });
    }
});

// Hiding .minTopUl on click
document.querySelector('.minTopUlClosingbtn').addEventListener('click', function () {
    document.querySelector('.minTopUl').classList.remove('show');
});

// Hiding .minTopUl when clicking on the li element links
const links = document.querySelectorAll('.minTopUl ul li a');

links.forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.minTopUl').classList.remove('show');
    });
});


// Custom Cursor
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor");
    document.body.appendChild(cursor);

    const postCursorCon = document.createElement("div");
    postCursorCon.classList.add("postCursorCon");

    const postCursor = document.createElement("div");
    postCursor.classList.add("postCursor");

    const postCursorToolTip = document.createElement("span");
    postCursorToolTip.classList.add("postCursorToolTip");

    postCursorCon.appendChild(postCursorToolTip);
    postCursorCon.appendChild(postCursor);
    document.body.appendChild(postCursorCon);

    let isHolding = false;
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const smoothFactor = 0.1;

    // Mouse movement
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX + 20;
        mouseY = e.clientY + 20;
    });

    document.addEventListener("mousedown", (e) => {
        isHolding = true;
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursor.style.transform = `scale(1.3)`;
    });

    document.addEventListener("mouseup", () => {
        isHolding = false;
        cursor.style.transform = `scale(1)`;
    });

    // Smooth movement function
    function animateCursor() {
        cursorX += (mouseX - cursorX) * smoothFactor;
        cursorY += (mouseY - cursorY) * smoothFactor;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        postCursorCon.style.left = `${cursorX}px`;
        postCursorCon.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.querySelectorAll(".post video").forEach(video => {
        video.addEventListener("mouseenter", (e) => {
            cursor.style.display = "none"; 
            postCursorCon.style.display = "flex";
            postCursorCon.style.opacity = "1";

            const post = video.closest(".post");
            if (post && post.dataset.text) {
                postCursorToolTip.textContent = post.dataset.text;
            } else {
                postCursorToolTip.textContent = "View Video";
            }
        });

        video.addEventListener("mouseleave", () => {
            cursor.style.display = "block";
            postCursorCon.style.opacity = "0";
            setTimeout(() => {
                postCursorCon.style.display = "none";
            }, 200)
        });
    });
});
