export function preprocessMarkdown(markdownText: string): string {
  // 줄 바꿈(\n)을 <br>로 변환할 필요가 있으면 아래 코드 사용
  // markdownText = markdownText.replace(/\n/g, '  \n');

  // 또는, 줄 바꿈 문자를 기준으로 텍스트를 분할하고, 마지막에 공백 두 개를 추가하여 재결합
  // 이 방법은 마크다운 파서가 줄 바꿈을 인식하지 못할 때 유용
  markdownText = markdownText.split("\n").join("  \n");
  // 모든 마크다운 제목 문법을 찾아서 올바르게 공백을 추가
  markdownText.replace(/^(#+)([^\s#])/gm, "$1 $2");

  return markdownText;
}
