'use server';
/**
 * @fileOverview An AI content moderation agent.
 *
 * - aiContentModeration - A function that handles the AI content moderation process.
 * - AiContentModerationInput - The input type for the aiContentModeration function.
 * - AiContentModerationOutput - The return type for the aiContentModeration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiContentModerationInputSchema = z.object({
  content: z
    .string()
    .describe('The text content of a post or comment to be moderated.'),
});
export type AiContentModerationInput = z.infer<
  typeof AiContentModerationInputSchema
>;

const FlaggedCategoryEnum = z.enum([
  'HATE_SPEECH',
  'SEXUALLY_EXPLICIT',
  'HARASSMENT',
  'DANGEROUS_CONTENT',
  'VIOLENCE',
  'PROFANITY',
  'OTHER_INAPPROPRIATE_CONTENT',
]);

const AiContentModerationOutputSchema = z.object({
  isFlagged: z
    .boolean()
    .describe(
      'True if the content is flagged as potentially inappropriate, toxic, or violates community guidelines.'
    ),
  flaggedCategories: z
    .array(FlaggedCategoryEnum)
    .describe(
      'A list of categories for which the content was flagged. Empty if not flagged.'
    ),
  moderationExplanation: z
    .string()
    .describe(
      'A brief explanation of why the content was flagged, referencing specific community guidelines or harmful aspects. Empty if not flagged.'
    ),
});
export type AiContentModerationOutput = z.infer<
  typeof AiContentModerationOutputSchema
>;

export async function aiContentModeration(
  input: AiContentModerationInput
): Promise<AiContentModerationOutput> {
  return aiContentModerationFlow(input);
}

const moderationPrompt = ai.definePrompt({
  name: 'moderationPrompt',
  input: {schema: AiContentModerationInputSchema},
  output: {schema: AiContentModerationOutputSchema},
  prompt: `You are an AI content moderator for a university community website named "Daegu Pulse".
Your primary role is to ensure a safe, respectful, and appropriate online environment for all verified students.

Analyze the provided text content carefully for any violations of community guidelines, including but not limited to:
- Hate speech, discrimination, or bigotry against any group or individual.
- Sexually explicit, suggestive, or inappropriate content.
- Harassment, bullying, threats, or personal attacks.
- Dangerous content, promoting self-harm, illegal activities, or violence.
- Glorification of violence or depicting graphic violence.
- Excessive profanity or offensive language.
- Any other content deemed inappropriate for a university student community.

Based on your analysis, determine if the content should be flagged.

If the content should be flagged:
- Set 'isFlagged' to true.
- Identify ALL relevant categories from the following list that apply to the content: ${FlaggedCategoryEnum.options
    .map(val => `'${val}'`)
    .join(', ')}.
- Provide a concise but clear 'moderationExplanation' explaining why the content was flagged and which specific guidelines it might violate.

If the content is appropriate and does not violate any guidelines:
- Set 'isFlagged' to false.
- Ensure 'flaggedCategories' is an empty array.
- Ensure 'moderationExplanation' is an empty string.

Content to moderate: """{{{content}}}"""`,
});

const aiContentModerationFlow = ai.defineFlow(
  {
    name: 'aiContentModerationFlow',
    inputSchema: AiContentModerationInputSchema,
    outputSchema: AiContentModerationOutputSchema,
  },
  async input => {
    const {output} = await moderationPrompt(input);
    return output!;
  }
);
