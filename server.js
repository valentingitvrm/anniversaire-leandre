import express from "express";
import { Resend } from "resend";

if (process.env.NODE_ENV !== 'production') {
  const dotenv = await import('dotenv');
  dotenv.config();
}

const app = express();
app.use(express.json());
app.use(express.static("public"));

const resend = new Resend(process.env.RESEND_API_KEY);
app.post("/repondre", async (req, res) => {
  const { prenom, reponse } = req.body;

  const emoji = reponse === "oui" ? "🎉" : "😢";
  const texte = reponse === "oui"
    ? `${prenom} sera présent(e) à l'anniversaire de Léandre !`
    : `${prenom} ne pourra pas venir à l'anniversaire de Léandre.`;

  try {
    await resend.emails.send({
      from: "Anniversaire Léandre <onboarding@resend.dev>",
      to: "valentin.vermet@hec.ca",
      subject: `${emoji} Réponse de ${prenom} — Anniversaire Léandre`,
      html: `<h2>${emoji} Nouvelle réponse</h2><p>${texte}</p>`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Erreur email:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur le port ${PORT}`));