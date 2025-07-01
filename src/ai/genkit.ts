import {genkit} from 'genkit';
import {googleAI as googleAIPlugin} from '@genkit-ai/googleai';

// Create and export the Google AI plugin helper instance.
// This will be the single source of truth for model referencing.
export const googleAI = googleAIPlugin();

export const ai = genkit({
  plugins: [googleAI],
});
