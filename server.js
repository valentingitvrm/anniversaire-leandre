import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Configuration de l'envoi d'email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route qui reçoit la réponse d'un invité
app.post("/repondre", async (req, res) => {
  const { prenom, reponse } = req.body;

  const emoji = reponse === "oui" ? "🎉" : "😢";
  const texte = reponse === "oui"
    ? `${prenom} sera présent(e) à l'anniversaire de Léandre !`
    : `${prenom} ne pourra pas venir à l'anniversaire de Léandre.`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `${emoji} Réponse de ${prenom} — Anniversaire Léandre`,
      html: `
        <h2>${emoji} Nouvelle réponse</h2>
        <p>${texte}</p>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Erreur email:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur le port ${PORT}`));