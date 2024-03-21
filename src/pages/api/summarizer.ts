import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI, { ClientOptions } from "openai";

type Data = {
  summary?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const configuration: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
  };
  const client = new OpenAI(configuration);

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // 사용할 모델을 지정하세요.
      messages: [
        {
          role: "system",
          content:
            "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair.",
        },
        {
          role: "user",
          content:
            "Compose a poem that explains the concept of recursion in programming.",
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    res.status(200).json({ summary: String(completion.choices[0].message) });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "OpenAI 요청 중 에러 발생" });
  }
}
