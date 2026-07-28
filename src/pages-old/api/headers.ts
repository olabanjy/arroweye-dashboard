// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data: object;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const headers = req.headers;
  res.status(200).json({ data: headers });
}
