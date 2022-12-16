import type { NextApiRequest, NextApiResponse } from "next";
import { uniqueNamesGenerator, Config, names } from "unique-names-generator";
import americanSurnames from "../../data/surnames.json";

type Data = Array<string>;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const config: Config = {
    dictionaries: [names, americanSurnames],
    separator: " ",
  };

  const listOfPeople = [];

  for (let index = 0; index < 200; index++) {
    listOfPeople.push(uniqueNamesGenerator(config));
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.status(200).json(listOfPeople);
}
