import { Input } from "@nextui-org/react";
import VideoSlider from "./VideoSlider";
import { FormEvent, useState } from "react";

export type VideoType = {
  videoId: string;
};

type VideoSearcherProps = {
  onSummarize: Function;
};

const VideoSearcher: React.FC<VideoSearcherProps> = ({ onSummarize }) => {
  const [keyword, setKeyword] = useState<string>("BlockChain");
  const [videos, setVideos] = useState<VideoType[]>([]);

  const onChangeKeyword = (e: any) => {
    setKeyword(e.target.value);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    const response = await fetch(
      `/api/videoSearch?keyword=${encodeURIComponent(keyword)}`
    );
    const data = await response.json();

    // 결과에서 videoId만 추출
    const idResult = data.items.map((item: any) => {
      const idPickItem: VideoType = { videoId: item.id.videoId };
      return idPickItem;
    });
    setVideos(idResult);
  };

  return (
    <div className="sm:max-w-screen-lg max-w-screen-sm w-full">
      <h2 className="mt-10 mb-5">YouTube 검색</h2>
      <form
        onSubmit={handleSearch}
        className="flex justify-center items-center"
      >
        <Input
          type="text"
          value={keyword}
          onChange={onChangeKeyword}
          variant="faded"
          label="Keyword Search"
          // placeholder="BlockChain"
          color="primary"
          size="lg"
          className="w-full sm:w-2/3 md:w-1/2"
        />
      </form>
      {videos.length > 0 && (
        <VideoSlider videos={videos} onSummarize={onSummarize} />
      )}
    </div>
  );
};

export default VideoSearcher;
