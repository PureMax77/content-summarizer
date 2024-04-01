import { preprocessMarkdown } from "@/function/text";
import { useState } from "react";

export default function useSummarize() {
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

  const getCaptionData = async (searchTerm: string): Promise<string> => {
    setLoadingMsg("자막 데이터 추출 중...");
    setContent("");

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

  return { getSummarizedText, getCaptionData, content, setContent, loadingMsg };
}
