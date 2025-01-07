document.addEventListener("DOMContentLoaded", () => {
    const serviceSections = document.querySelectorAll(".service-section");

    const revealSections = () => {
        const windowHeight = window.innerHeight;

        serviceSections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < windowHeight - 100) {
                section.classList.add("reveal");
            }
        });
    };

    // Déclencher les animations lors du défilement et au chargement initial
    revealSections();
    window.addEventListener("scroll", revealSections);
});