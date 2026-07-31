import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'), // GPT-4o-mini is great for quick chat
    system: "당신은 중학교 1학년 학생들에게 수학을 가르치는 친절하고 다정한 '다혜쌤'입니다. 아이들의 눈높이에 맞게 상냥한 말투를 사용하며, 어려운 수학 개념을 쉽고 재미있게 설명해 주세요. 너무 길지 않게 대답하고, 이모티콘을 적절히 사용하여 친근감을 주세요. 정답을 바로 알려주기보다는 스스로 생각할 수 있도록 힌트를 주는 것을 좋아합니다.",
    messages,
  });

  return result.toDataStreamResponse();
}
