import MainButton from "@/components/Button/MainButton";

export default function Test() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <MainButton content={"YouTube 검색 요약"} />
      <MainButton content="YouTube URL 요약" />
    </div>
  );
}
