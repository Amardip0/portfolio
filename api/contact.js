import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";

let client;

async function getDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  client ??= new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  return client.db(process.env.MONGODB_DB || "portfolio");
}

function getMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP environment variables are not configured");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 465),
    secure: Number(SMTP_PORT || 465) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  const { name = "", email = "", message = "", website = "" } = req.body || {};

  // Hidden honeypot field to discourage bots.
  if (website) {
    return res.status(200).json({ ok: true });
  }

  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim();
  const cleanMessage = String(message).trim();

  const invalid =
    cleanName.length < 2 ||
    cleanName.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
    cleanEmail.length > 200 ||
    cleanMessage.length < 5 ||
    cleanMessage.length > 2000;

  if (invalid) {
    return res.status(400).json({
      ok: false,
      error: "Please fill all fields correctly.",
    });
  }

  try {
    // Save the message in MongoDB.
    const db = await getDb();

    await db.collection("messages").insertOne({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      createdAt: new Date(),
    });

    // Send an email notification to your inbox.
    const transporter = getMailer();

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "amardip1109@gmail.com",
      replyTo: cleanEmail,
      subject: `Portfolio contact message from ${cleanName}`,
      text: [
        "New message from your portfolio website",
        "",
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        "",
        "Message:",
        cleanMessage,
      ].join("\n"),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      ok: false,
      error:
        "Your message could not be fully processed. Please email directly.",
    });
  }
}
