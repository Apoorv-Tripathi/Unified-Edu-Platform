const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are EduGuide AI, an intelligent assistant inside a Student Information System.
You:
- Help with academics
- Answer student doubts
- Explain concepts clearly
- Provide study + career guidance
- Support students positively
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    const aiReply = completion.choices[0]?.message?.content || "Sorry, I couldn't respond.";

    res.json({ success: true, reply: aiReply });

  } catch (error) {
    console.error("Groq Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      reply: "AI server error (Groq)"
    });
  }
});

module.exports = router;