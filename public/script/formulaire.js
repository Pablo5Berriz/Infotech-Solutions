document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Empêche la soumission classique du formulaire

        const formData = new FormData(contactForm);

        try {
            const response = await fetch("/submit-form", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                formMessage.style.display = "block";
                formMessage.textContent = result.message || "Message envoyé avec succès.";
                formMessage.style.color = "green";
                contactForm.reset();
            } else {
                formMessage.style.display = "block";
                formMessage.textContent = result.message || "Erreur lors de l'envoi.";
                formMessage.style.color = "red";
            }
        } catch (error) {
            formMessage.style.display = "block";
            formMessage.textContent = "Erreur réseau. Réessayez plus tard.";
            formMessage.style.color = "red";
        }
    });
});