import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type Data = string | undefined;
type SomeoneAskForSomething = string;

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAiConfiguration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const someoneAskForSomething = String(req.query.message);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(someoneAskForSomething),
    max_tokens: 100,
    temperature: 0.2,
  });

  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.status(200).send(completion.data.choices[0].text);
}

function generatePrompt(someoneAskForSomething: SomeoneAskForSomething) {
  return `Return a short, polite and very comfortable response for this request "${someoneAskForSomething}" that states we'll working on it soon.`;
}
