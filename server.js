const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;


const avisFilePath = path.join(__dirname, "avis.json");

// Middleware pour configurer le header Content-Type pour les réponses JSON
app.use((req, res, next) => {
    if (req.method === "POST" && req.url === "/submit-form") {
        res.setHeader("Content-Type", "application/json");
    }
    next();
});

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour traiter les données des formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/site.webmanifest', (req, res) => {
    res.sendFile(path.join(__dirname, 'site.webmanifest'));
});

// Configurer Multer pour gérer les fichiers téléversés
const upload = multer({ dest: 'uploads/' });

// Route pour récupérer les avis
app.get("/avis", (req, res) => {
    try {
        const avis = JSON.parse(fs.readFileSync(avisFilePath, "utf8"));
        res.json(avis);
    } catch (error) {
        console.error("Erreur lors de la lecture de avis.json :", error);
        res.status(500).json({ error: "Impossible de charger les avis" });
    }
});

// Route pour ajouter un avis
app.post("/avis", (req, res) => {
    try {
        const { name, message, date } = req.body;

        if (!name || !message || !date) {
            return res.status(400).json({ error: "Champs obligatoires manquants" });
        }

        const avis = JSON.parse(fs.readFileSync(avisFilePath, "utf8"));
        const newAvis = { name, message, date };

        avis.push(newAvis);
        fs.writeFileSync(avisFilePath, JSON.stringify(avis, null, 2));

        res.status(201).json({ message: "Avis ajouté avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'avis :", error);
        res.status(500).json({ error: "Impossible d'ajouter l'avis" });
    }
});


// Route pour envoyer le formulaire
app.post('/submit-form', upload.single('attachment'), async (req, res) => {
    const { lastname, firstname, email, message } = req.body;
    const attachment = req.file;

    // Configurez Nodemailer
    require('dotenv').config();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Construire le message
    const mailOptions = {
        from: `"${firstname} ${lastname}" <${email}>`,
        to: 'solutionsinfos2023@gmail.com', // Votre adresse Gmail pour recevoir les emails
        subject: 'Nouveau message via le formulaire de contact',
        text: `
            Vous avez reçu un nouveau message :

            Nom : ${lastname}
            Prénom : ${firstname}
            Email : ${email}
            Message : ${message}
        `,
        attachments: attachment
            ? [
                  {
                      filename: attachment.originalname,
                      path: attachment.path,
                  },
              ]
            : [],
    };

    try {
        // Envoyer l'email
        await transporter.sendMail(mailOptions);
        
        // Supprimer le fichier téléversé après envoi de l'email si nécessaire
        res.status(200).json({ message: "Email envoyé avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
    }
});

// Route pour gérer l'inscription à la newsletter
app.post("/subscribe-newsletter", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email manquant' });
    }

    // Charger ou créer un fichier JSON pour stocker les emails
    const filePath = "./subscribers.json";
    let subscribers = [];

    if (fs.existsSync(filePath)) {
        subscribers = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    // Vérifier si l'email est déjà enregistré
    if (subscribers.includes(email)) {
        return res.status(400).json({ message: "Cet email est déjà abonné." });
    }

    // Ajouter l'email à la liste et sauvegarder dans le fichier
    subscribers.push(email);
    fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));

    return res.status(200).json({ message: "Merci de vous être abonné à notre newsletter." });
});

// Lancez le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});