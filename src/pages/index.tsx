import VideoSearcher from "@/components/VideoSearcher";
import { preprocessMarkdown } from "@/function/text";
import { Input, Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import OpenAI, { ClientOptions } from "openai";
import { FormEvent, useState } from "react";
import Markdown from "react-markdown";

// const VideoSlider = dynamic(() => import("@/components/VideoSlider"), {
//   ssr: false,
// });

export default function Home() {
  const [searchTerm, setSearchTerm] = useState(
    "https://www.youtube.com/watch?v=uyuA11PDDHE"
  );
  const [content, setContent] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");

  const getSummarizedText = async (caption: string) => {
    setLoadingMsg("데이터 분석 요약 중...");

    try {
      const response = await fetch("/api/summarizer", {
        method: "POST", // HTTP 메소드를 POST로 설정
        headers: {
          "Content-Type": "application/json", // 콘텐츠 타입을 JSON으로 지정
        },
        body: JSON.stringify({
          caption, // 전송할 데이터
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      const markDonwText = preprocessMarkdown(result.summary);

      setContent(markDonwText);
    } catch (err) {
      console.error("요약 요청 중 에러 발생:", err);
    } finally {
      setLoadingMsg("");
    }
  };

  const getCaptionData = async (): Promise<string> => {
    setLoadingMsg("자막 데이터 추출 중...");

    let caption: string = "";

    try {
      const response = await fetch(
        `/api/downloadCaption?videoUrl=${encodeURIComponent(searchTerm)}`
      );
      caption = (await response.json()).caption;
    } catch (err) {
      console.error("자막 데이터 요청 중 에러 발생:", err);
    } finally {
      setLoadingMsg("");
      return caption;
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 자막 데이터 받아오기
    const captionText = await getCaptionData();

    // 요약
    if (captionText) getSummarizedText(captionText);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <VideoSearcher />
        <div className="flex flex-col max-w-screen-sm w-full">
          <h2 className="mt-10 mb-5">YouTube URL 직접 요약</h2>
          <form onSubmit={handleSearch} className="flex w-full">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="faded"
              label="URL Search"
              color="primary"
              size="lg"
            />
            {/* 버튼은 시각적으로 보여주기 위해 남겨둠. 실제 검색 기능은 폼 제출로 처리 */}
            {/* <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
          >
            검색
          </button> */}
          </form>
          {loadingMsg && (
            <div className="flex flex-row my-5">
              <div className="flex justify-center items-center mr-3">
                {loadingMsg}
              </div>
              <Spinner size="sm" />
            </div>
          )}
          {content && (
            <div className="summary-content bg-gray-100 p-4 mt-5 rounded-lg shadow">
              {/* <h2 className="text-lg font-semibold mb-2">요약</h2> */}
              {/* <p className="text-gray-700">{content}</p> */}
              <Markdown>{content}</Markdown>
              {/* <Markdown>{"# ㄴㅇㄹㅁㄴㅇ \n - ㄴㄹㄴㅁ"}</Markdown> */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
