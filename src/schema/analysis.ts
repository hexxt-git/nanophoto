import { ObjectId } from "mongodb";
import { judgementSchema } from "./judgement";
import { z } from "zod";

export type Analysis = {
  _id: ObjectId;
  userId: string;
  analysisId: string;
  image: string;
  mode: string;
  constraints: string[];
  judgement: z.infer<typeof judgementSchema>;
  sketches: string[];
  createdAt: string;
};
