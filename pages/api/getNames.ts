import type { NextApiRequest, NextApiResponse } from "next";
import { uniqueNamesGenerator, Config, names } from "unique-names-generator";
import americanSurnames from "../../data/surnames.json";
import { Configuration, OpenAIApi } from "openai";

type Data = any;

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAiConfiguration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const config: Config = {
    dictionaries: [names, americanSurnames],
    separator: " ",
  };

  const listOfPeople = [];

  for (let index = 0; index < 5; index++) {
    listOfPeople.push(uniqueNamesGenerator(config));
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(listOfPeople),
    max_tokens: 200,
    temperature: 0.2,
  });

  console.log(completion.data.choices);

  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.status(200).send(completion.data.choices[0].text);
}

function generatePrompt(listOfPeople: Array<string>) {
  return `Assign random company positions to the following people: ${String(
    listOfPeople
  )}`;
}
