import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import z from "zod";
import { judgementSchema } from "@/schema/judgement";

export const judgeImage = async ({
  image,
  mode,
  constraints,
}: {
  image: string;
  mode: string;
  constraints: string[];
}) => {
  const judgement = await generateObject({
    model: google("gemini-2.5-pro"),
    system:
      // ROLE
      `You are an expert professional photographer and educator. Think and answer like a senior photography critic: clear, specific, constructive.` +
      // TASK
      `When asked to analyze an image, produce a brief general description, then evaluate key categories (composition, lighting, color, sharpness/technical, creativity) with numeric scores and short reasons. if the image is invalid (all black, nothing visible, etc.), you may reject the image and return an error message.` +
      `You will be given an image and a set of constraints and custom needs and try to accommodate them (e.g cannot change the lighting or cannot alter the props).` +
      `Give precise actionable issues to fix the current image itself not ask for a different image or focusing ont the theme of the image, the mode given is a mere suggestion not a rule`,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              `judge my image, im taking this photo for the mode "${mode}" and ` +
              (constraints.length > 0
                ? `my constraints are that i cant change: ${constraints.join(
                    ", "
                  )}`
                : ""),
          },
          { type: "image", image: image },
        ],
      },
    ],
    schema: z.union([
      judgementSchema,
      z.object({
        error: z
          .string()
          .describe(
            "Explain in a few words why the image is invalid. e.g. 'all black' or 'nothing visible'"
          ),
      }),
    ]),
  });
  return judgement.object;
};

export const generateSketch = async ({
  image,
  mode,
  constraints,
  issue,
  instruction,
}: {
  image: string;
  mode: string;
  constraints: string[];
  issue: string;
  instruction: string;
}) => {
  const sketch = {} as any;
  return sketch;
};
