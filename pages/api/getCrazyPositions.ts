import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type Data = any;
type listOfPeople = string;

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAiConfiguration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.query);
  const listOfPeople = String(req.query.names);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(listOfPeople),
    max_tokens: 100,
    temperature: 0.2,
  });

  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.status(200).send(completion.data.choices[0].text);
}

function generatePrompt(listOfPeople: string) {
  return `Assign random company positions to the following people: ${String(
    listOfPeople
  )}`;
}
