import SummaryContent from "@/components/SummaryContent";
import VideoSearcher from "@/components/VideoSearcher";
import useSummarize from "@/hooks/useSummarize";

export default function Search() {
  const { getCaptionData, getSummarizedText, content, loadingMsg } =
    useSummarize();

  const onSummarize = async (searchTerm: string) => {
    // 자막 데이터 받아오기
    const captionText = await getCaptionData(searchTerm);

    // 요약
    if (captionText) getSummarizedText(captionText);
    else alert("자막데이터를 받아오는데 실패했습니다.");
  };

  return (
    <div className="flex flex-col items-center justify-centern">
      <main className="flex flex-col items-center justify-center w-full px-5 text-center">
        <VideoSearcher onSummarize={onSummarize} />
        <div className="flex flex-col sm:max-w-screen-lg max-w-screen-sm w-full">
          <SummaryContent loadingMsg={loadingMsg} content={content} />
        </div>
      </main>
    </div>
  );
}
