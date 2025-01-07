document.addEventListener("DOMContentLoaded", () => {
    // Récupérer le formulaire d'abonnement
    const newsletterForm = document.getElementById("newsletterForm");

    // Vérifier si le formulaire existe avant d'ajouter un événement
    if (!newsletterForm) {
        console.error("Le formulaire d'abonnement à la newsletter n'a pas été trouvé.");
        return;
    }

    newsletterForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        const emailInput = newsletterForm.querySelector('input[name="email"]');

        // Vérifier si le champ email existe
        if (!emailInput) {
            console.error("Le champ email n'a pas été trouvé dans le formulaire.");
            return;
        }

        const email = emailInput.value.trim(); // Récupérer la valeur du champ email

        // Vérification de la validité de l'email avant l'envoi
        if (!email || !validateEmail(email)) {
            alert("Veuillez saisir une adresse email valide.");
            return;
        }

        try {
            // Envoyer la requête POST au backend
            const response = await fetch("/subscribe-newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                // Afficher un message de succès et réinitialiser le formulaire
                alert(result.message || "Inscription réussie. Merci de vous être abonné !");
                newsletterForm.reset();
            } else {
                // Gérer les erreurs renvoyées par le serveur
                alert(result.message || "Une erreur s'est produite lors de l'inscription.");
            }
        } catch (error) {
            // Gérer les erreurs côté client (ex: problème réseau)
            console.error("Erreur lors de l'inscription :", error);
            alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
        }
    });

    // Fonction pour valider un email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});