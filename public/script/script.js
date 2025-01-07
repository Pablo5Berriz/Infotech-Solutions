document.addEventListener("DOMContentLoaded", async () => {
    const avisUl = document.getElementById("avisUl");
    const avisForm = document.getElementById("avisForm");

    // Charger et afficher les avis existants
    async function loadAvis() {
        try {
            const response = await fetch("/avis");
            const avis = await response.json();

            avisUl.innerHTML = ""; // Vider la liste avant de la remplir
            avis.forEach(({ name, message, date }) => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${name}</strong> <em>(${new Date(date).toLocaleDateString()})</em><br>${message}`;
                avisUl.appendChild(li);
            });
        } catch (error) {
            console.error("Erreur lors du chargement des avis :", error);
        }
    }

    // Soumettre un nouvel avis
    avisForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !message) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const response = await fetch("/avis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, message, date: new Date() })
            });

            if (response.ok) {
                alert("Votre avis a été ajouté avec succès !");
                avisForm.reset();
                loadAvis(); // Recharger les avis
            } else {
                alert("Une erreur est survenue lors de l'envoi de votre avis.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'avis :", error);
        }
    });

    // Charger les avis au chargement de la page
    loadAvis();
});
    