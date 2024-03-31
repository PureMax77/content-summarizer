import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  summary?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { keyword } = req.query;
  // console.log(11, keyword);
  if (!keyword) {
    return res.status(400).json({ error: "keyword is required" });
  }

  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // 환경변수에서 API 키를 가져옵니다.
  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
    keyword as string
  )}&key=${YOUTUBE_API_KEY}`;

  try {
    const youtubeResponse = await fetch(YOUTUBE_API_URL);
    const youtubeData = await youtubeResponse.json();

    if (youtubeResponse.ok) {
      res.status(200).json(youtubeData);
    } else {
      res
        .status(youtubeResponse.status)
        .json({ error: youtubeData.error.message });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
