import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

router.post("/ai/describe", async (req, res) => {
  const { serviceName } = req.body as { serviceName: string };
  if (!serviceName) return res.status(400).json({ error: "serviceName required" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 150,
      messages: [
        {
          role: "system",
          content: "You write brief, helpful quote request descriptions for Irish homeowners. Write 1-2 sentences describing a realistic job scenario for the given service. Be specific and practical. No greetings or sign-offs.",
        },
        {
          role: "user",
          content: `Write a sample quote request description for: ${serviceName}`,
        },
      ],
    });
    const suggestion = completion.choices[0]?.message?.content?.trim() ?? "";
    res.json({ suggestion });
  } catch (err) {
    console.error("AI describe error:", err);
    res.status(500).json({ error: "Failed to generate suggestion" });
  }
});

export default router;
