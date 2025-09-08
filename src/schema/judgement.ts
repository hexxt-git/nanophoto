import { z } from "zod";

export const judgementScoreSchema = z.object({
  score: z.enum(["major issue", "bad", "decent", "good", "great", "excellent"]),
  reason: z.string().describe("A short reason for the score."),
});

export const judgementSchema = z.object({
  imageTitle: z
    .string()
    .describe(
      "A title for the image. e.g. 'photo of a person in a park' or 'photo of a dog in a forest'"
    ),
  visualDescription: z
    .string()
    .describe(
      "A visual description of exactly what you see in the image. no judgment or critique, just a description of at least 500 words. detailing where each item, character, object, etc. is located. and their properties an relationships."
    ),
  scores: z.object({
    composition: z
      .object({
        placement: judgementScoreSchema,
        balanceAndWeight: judgementScoreSchema,
        depthAndPerspective: judgementScoreSchema,
      })
      .describe(
        "The composition of the image. how the elements are placed and how they relate to each other."
      ),
    lighting: z
      .object({
        exposure: judgementScoreSchema,
        directionAndQuality: judgementScoreSchema,
        contrastAndShadows: judgementScoreSchema,
      })
      .describe(
        "The lighting of the image. how the light is used to create the mood and atmosphere."
      ),
    color: z
      .object({
        whiteBalance: judgementScoreSchema,
        colorHarmony: judgementScoreSchema,
        moodAndAtmosphere: judgementScoreSchema,
      })
      .describe(
        "The color of the image. how the colors are used to create the mood and atmosphere."
      ),
    technique: z
      .object({
        sharpnessAndFocus: judgementScoreSchema,
        noiseAndGrain: judgementScoreSchema,
        warpingAndBlurring: judgementScoreSchema,
      })
      .describe(
        "The technique of the image. how the technique is used to create the mood and atmosphere."
      ),
    creativity: z
      .object({
        originality: judgementScoreSchema,
        storytelling: judgementScoreSchema,
        emotionalImpact: judgementScoreSchema,
      })
      .describe(
        "The creativity of the image. what the image does and why it should exist."
      ),
  }),
  actionableIssues: z
    .array(
      z.object({
        issue: z
          .string()
          .describe("what is wrong or lacking in the image not how to fix it"),
        location: z.union([
          z.object({
            type: z.literal("area"),
            area: z
              .string()
              .describe("e.g. 'left third', 'under the nose', 'center'"),
          }),
          z.object({
            type: z.literal("settings"),
            settings: z.string().describe("e.g. 'exposure setting'"),
          }),
          z.object({
            type: z.literal("framing"),
            framing: z
              .string()
              .describe("e.g. 'bottom of the frame', 'right side'"),
          }),
        ]),
        visual_guidance: z
          .string()
          .describe(
            "A specific and detailed visual guidance for fixing the issue. (e.g. 'move the subjects arm to the left' or 'increase the exposure by 0.7 stops') the visual guidance should be 100% about the taking of the image so not post processing and it should be objectively to the point not a story telling or an argument"
          ),
      })
    )
    .describe(
      "Actionable issues to fix the current image itself not ask for a different image or focusing ont the theme of the image"
    ),
  verdict: z.string().describe("A short verdict on the image. and why"),
});
