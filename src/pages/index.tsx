import Head from "next/head";
import OpenAI, { ClientOptions } from "openai";
import { FormEvent, useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [content, setContent] = useState("");

  const getSummarizedText = async (caption: string) => {
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

      setContent(result.summary);
    } catch (error) {
      console.error("요약 요청 중 에러 발생:", error);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 자막 데이터 받아오기
    const response = await fetch(
      `/api/downloadCaption?videoUrl=${encodeURIComponent(searchTerm)}`
    );
    const { caption } = await response.json();

    // 요약
    await getSummarizedText(caption);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        {/* <img src="/google-logo.png" alt="Google Logo" className="w-60 mb-8" /> */}
        <form onSubmit={handleSearch} className="flex w-full max-w-md">
          <input
            type="text"
            className="w-full h-12 px-4 border rounded-lg focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Youtube URL search"
          />
          {/* 버튼은 시각적으로 보여주기 위해 남겨둠. 실제 검색 기능은 폼 제출로 처리 */}
          {/* <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
          >
            검색
          </button> */}
        </form>
        {content && (
          <div className="summary-content bg-gray-100 p-4 mt-5 rounded-lg shadow">
            {/* <h2 className="text-lg font-semibold mb-2">요약</h2> */}
            <p className="text-gray-700">{content}</p>
          </div>
        )}
      </main>
    </div>
  );
}
