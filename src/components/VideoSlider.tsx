import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import YouTube, { YouTubeProps } from "react-youtube";
import { VideoType } from "./VideoSearcher";
import { Button } from "@nextui-org/react";
import { YouTubeWatchURL } from "@/constants/common";

type VideoSlierProps = {
  videos: VideoType[];
  onSummarize: Function;
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
};

const VideoSlider: React.FC<VideoSlierProps> = ({ videos, onSummarize }) => {
  const threeVideos = videos.slice(0, 3);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    height: "180", // 16:9 비율
    width: "320",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (
    <div className="flex flex-row my-5">
      {threeVideos.map((video, index) => (
        <div key={index} className="mx-3">
          <div className="mb-3">
            <YouTube
              videoId={video.videoId}
              opts={opts}
              onReady={onPlayerReady}
            />
          </div>
          <Button
            color="primary"
            variant="bordered"
            onPress={(e) => onSummarize(YouTubeWatchURL + video.videoId)}
          >
            요약하기
          </Button>
        </div>
      ))}
    </div>
  );

  // return (
  //   <Slider {...sliderSettings}>
  //     {videos.map((video) => (
  //       <div key={video.id}>
  //         {/* <ReactPlayer url={video.url} width="500px" height="400px" /> */}
  //         <YouTube videoId={video.url} opts={opts} onReady={onPlayerReady} />
  //       </div>
  //     ))}
  //   </Slider>
  // );
};

export default VideoSlider;
