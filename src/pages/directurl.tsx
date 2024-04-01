import SummaryContent from "@/components/SummaryContent";
import useSummarize from "@/hooks/useSummarize";
import { Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";

export default function DirectUrl() {
  const { getCaptionData, getSummarizedText, content, loadingMsg } =
    useSummarize();

  const [searchTerm, setSearchTerm] = useState(
    "https://www.youtube.com/watch?v=fqH-L5Y_iV0"
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
    <div className="flex flex-col items-center justify-center ">
      <main className="flex flex-col items-center justify-center w-full px-5 text-center">
        <div className="flex flex-col sm:max-w-screen-lg max-w-screen-sm w-full">
          <h2 className="mt-10 mb-5">YouTube URL 검색</h2>
          <form
            onSubmit={handleSearch}
            className="flex justify-center items-center w-full"
          >
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="faded"
              label="URL Search"
              color="primary"
              size="lg"
              className="w-full sm:w-2/3 md:w-1/2"
            />
          </form>
          <SummaryContent loadingMsg={loadingMsg} content={content} />
        </div>
      </main>
    </div>
  );
}
