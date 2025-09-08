import { generateObject, generateText } from "ai";
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
      `When asked to analyze an image, produce a brief general description, then evaluate key categories (composition, lighting, color, sharpness/technical, creativity) with numeric scores and short reasons. if the image is invalid (all black, nothing visible, not a photograph like a drawing or animation, etc.), you may reject the image and return an error message.` +
      `You will be given an image and a set of constraints and custom needs and try to accommodate them (e.g cannot change the lighting or cannot alter the props).` +
      `Give precise actionable issues to fix the current image itself not ask for a different image or focusing ont the mode of the image, the mode given is a mere suggestion not a rule.` +
      `Treat each image accordingly like if the image is a selfie do not suggest photography gear or if the image is taken by an amateur do not suggest things out of reach.\n` +
      `you very much can like the photo, praise it and say that it is good. you do not need to find issues if there are none.`,
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
            "Explain in a few words why the image is invalid. e.g. 'all black' or 'nothing visible' or 'not a photograph'"
          ),
      }),
    ]),
  });
  return judgement.object;
};

export const generateSketch = async ({
  image,
  issue,
}: {
  image: string;
  issue: object;
}) => {
  const result = await generateText({
    model: google("gemini-2.5-flash-image-preview"),
    providerOptions: {
      google: { responseModalities: ["IMAGE"] },
    },
    system:
      "Your task is to be given an image and a set of instructions to sketch over it with a RED #FF2D55 sharpie. you have no creative liberty and you must follow the instructions exactly. the result should be exactly the same original image not altered or changed only overlayed with a thick red sharpie. do not make the instructions chaotic or overwhelming, the lines should not be threatening and be educational and helpful.",
    messages: [
      {
        role: "user",
        content: [
          { type: "image", image: image },
          {
            type: "text",
            text: `given these instructions in JSON: ${JSON.stringify(
              issue
            )}. draw an overlay over the image with a RED sharpie or thick pen with dynamic lines, arrows and hand written text. the image underneath should not change. do not make the instructions chaotic or overwhelming`,
          },
        ],
      },
    ],
    temperature: 0.2,
  });

  return result.files[0].base64;
};
