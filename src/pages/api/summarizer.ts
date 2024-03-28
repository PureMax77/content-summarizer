import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI, { ClientOptions } from "openai";
import fs from "fs";

type Data = {
  summary?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    // 요청 본문에서 데이터 추출
    const { caption } = req.body;
    // const caption = await fs.readFileSync("./caption.txt", {
    //   encoding: "utf8",
    // });

    const configuration: ClientOptions = {
      apiKey: process.env.OPENAI_API_KEY,
    };
    const client = new OpenAI(configuration);

    try {
      console.log("start Summarize");
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo-0125", // 사용할 모델을 지정하세요.
        messages: [
          {
            role: "system",
            content:
              "You are a smart assistant skilled in summarizing information into a concise format directly in Korean. Please organize the summary in neat paragraphs, each paragraph discussing a distinct point or idea. Present the summary in Markdown format, using appropriate headings, bullet points, and formatting to structure the content clearly.",
          },
          {
            role: "user",
            content: `Summarize the following text : ${caption}`,
          },
        ],
        temperature: 0.3, // 창의성 표현 0~1
        max_tokens: 1000,
        top_p: 0.7, // 다양한 가능성?을 고려하는 정도 0~1
        frequency_penalty: 0.0, // 자주 반복되는 단어 사용을 줄이기 위해
        presence_penalty: 0.0, // 이미 나온 내용을 반복하는 것을 줄이기 위해
      });

      console.log("Finished Summarize");
      console.log(completion.choices[0].message);

      res
        .status(200)
        .json({ summary: completion.choices[0].message.content || "" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "OpenAI 요청 중 에러 발생" });
    }
  } else {
    // POST 요청이 아닐 경우, 405 Method Not Allowed 응답
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
