import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  ANTHROPIC_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.post("/parse", async (c) => {
  const body = await c.req.json<{ image: string; mimeType: string }>();

  if (!body.image || !body.mimeType) {
    return c.json({ error: "image and mimeType are required" }, 400);
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": c.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: body.mimeType,
                data: body.image,
              },
            },
            {
              type: "text",
              text: `Extract transaction data from this receipt/screenshot. Return ONLY a JSON object with these fields:
{
  "amount": number (total amount),
  "currency": "EUR" or "CAD",
  "description": "short description of the purchase",
  "category": "best matching category from: Rent, Groceries, Utilities, Transport, Dining, Entertainment, Health, Shopping, Subscriptions, Education, Travel, Gifts, Insurance, Savings, Investments, Other",
  "date": "YYYY-MM-DD" (if visible, otherwise null)
}

If you cannot extract the data, return: {"error": "Could not parse receipt"}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return c.json({ error: "Anthropic API error", details: err }, 500);
  }

  const result = (await response.json()) as {
    content: { type: string; text: string }[];
  };
  const text = result.content?.[0]?.text ?? "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const parsed = JSON.parse(jsonMatch[0]);
    return c.json(parsed);
  } catch {
    return c.json({ error: "Failed to parse response", raw: text }, 500);
  }
});

export default app;
