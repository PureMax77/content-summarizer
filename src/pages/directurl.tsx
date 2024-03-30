import SummaryContent from "@/components/SummaryContent";
import useSummarize from "@/hooks/useSummarize";
import { Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";

export default function DirectUrl() {
  const { getCaptionData, getSummarizedText, content, loadingMsg } =
    useSummarize();

  const [searchTerm, setSearchTerm] = useState(
    "https://www.youtube.com/watch?v=uyuA11PDDHE"
  );

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 자막 데이터 받아오기
    const captionText = await getCaptionData(searchTerm);

    // 요약
    if (captionText) getSummarizedText(captionText);
    else alert("자막데이터를 받아오는데 실패했습니다.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
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
          <SummaryContent loadingMsg={loadingMsg} content={content} />
        </div>
      </main>
    </div>
  );
}
