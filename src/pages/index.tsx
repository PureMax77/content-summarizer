import MainButton from "@/components/Button/MainButton";
import { PagePath } from "@/constants/common";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center w-screen">
      <div className="flex justify-center items-center mt-60">
        <MainButton
          content={"YouTube 검색 요약"}
          onClick={() => router.push(PagePath.SEARCH)}
        />
        <MainButton
          content={"YouTube URL 요약"}
          onClick={() => router.push(PagePath.DIRECTURL)}
        />
      </div>
    </div>
  );
}
