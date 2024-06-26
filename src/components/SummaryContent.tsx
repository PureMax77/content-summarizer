import { Spinner } from "@nextui-org/react";
import Markdown from "react-markdown";

type SummaryContentProps = {
  loadingMsg: string;
  content: string;
};

const SummaryContent: React.FC<SummaryContentProps> = ({
  loadingMsg,
  content,
}) => {
  return (
    <>
      {loadingMsg && (
        <div className="flex justify-center items-center flex-row my-5 w-full">
          <div className="flex justify-center items-center mr-3">
            {loadingMsg}
          </div>
          <Spinner size="sm" />
        </div>
      )}
      {!loadingMsg && content && (
        <div
          id="summary"
          className="summary-content bg-gray-100 p-4 mt-5 mb-10 rounded-lg shadow"
        >
          {/* <h2 className="text-lg font-semibold mb-2">요약</h2> */}
          {/* <p className="text-gray-700">{content}</p> */}
          <Markdown>{content}</Markdown>
          {/* <Markdown>{"# ㄴㅇㄹㅁㄴㅇ \n - ㄴㄹㄴㅁ"}</Markdown> */}
        </div>
      )}
    </>
  );
};

export default SummaryContent;
