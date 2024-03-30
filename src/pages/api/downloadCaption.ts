import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import OpenAI, { ClientOptions } from "openai";
import fs, { createReadStream } from "fs";
import { getVideoMP3Base64, getVideoMP3Binary } from "yt-get";
import { FileLikeImpl } from "@/types/audioFile.types";
import { File } from "buffer";
import { isFileLike } from "openai/uploads.mjs";
import { Readable } from "stream";
import axios from "axios";
import FormData from "form-data";
import ffmpeg from "fluent-ffmpeg";
import { Mp3FileName } from "@/constants/common";

type Data = {
  filename?: string;
  caption?: string;
  error?: string;
};

/**
 * MP3 파일의 음질을 변경합니다.
 * @param {string} inputPath - 원본 MP3 파일 경로
 * @param {string} outputPath - 결과 MP3 파일 경로
 * @param {number} bitrate - 설정할 비트레이트 (kbps)
 */
async function changeMP3Quality(
  inputPath: string,
  outputPath: string,
  bitrate: number
) {
  ffmpeg(inputPath)
    .audioCodec("libmp3lame") // 오디오 코덱 설정
    .audioBitrate(bitrate) // 비트레이트 설정
    .save(outputPath) // 출력 파일 경로
    .on("error", function (err: any) {
      console.log("An error occurred: " + err.message);
    })
    .on("end", function () {
      console.log("Processing finished !");
    });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    try {
      const { videoUrl } = req.query;
      const videoId = String(videoUrl).split("v=")[1].split("&")[0];

      const configuration: ClientOptions = {
        apiKey: process.env.OPENAI_API_KEY,
      };
      const client = new OpenAI(configuration);

      const newVideoURL = `https://www.youtube.com/watch?v=${videoId}`;

      console.log("start download mp3");
      const { title, mp3 } = await getVideoMP3Binary(newVideoURL);
      // const { base64 } = await getVideoMP3Base64(newVideoURL);
      // // // 비동기적으로
      console.log("start write : " + title);
      await fs.writeFileSync(Mp3FileName, mp3);

      // 음질 변경
      // await changeMP3Quality("./output3.mp3", "./output4.mp3", 96);

      console.log("start trans");
      const { text } = await client.audio.transcriptions.create({
        file: fs.createReadStream("./" + Mp3FileName),
        model: "whisper-1",
      });
      console.log("success", text); // 변환된 텍스트 출력

      // console.log("success", res.response); // 변환된 텍스트 출력

      // Google API 클라이언트 라이브러리 초기화
      // const youtube = google.youtube({
      //   version: "v3",
      //   auth: process.env.GOOGLE_API_KEY, // 여기에 YouTube Data API 키를 입력하세요
      // });

      // console.log("start get captionList");
      // // 캡션 목록 가져오기
      // const response = await youtube.captions.list({
      //   // part: ["snippet", "contentDetails", "statistics"],
      //   part: [],
      //   videoId: videoId,
      // });

      // console.log("res", response.data);

      // console.log("start download caption");
      // let captionsDownloadResponse: any;
      // // 캡션 다운로드 URL 구성 (실제 다운로드는 별도의 인증이 필요할 수 있음)
      // if (response.data && response.data.items) {
      //   const captionsId = response.data.items[0].id || "";
      //   captionsDownloadResponse = await youtube.captions.download({
      //     id: captionsId,
      //     tfmt: "srt", // 다운로드 포맷 설정 (예: 'srt')
      //   });
      // }
      // console.log("result ", captionsDownloadResponse);
      // 캡션 데이터를 클라이언트로 응답
      res.status(200).json({ caption: text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // GET 요청이 아닐 경우 405 Method Not Allowed 응답
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
