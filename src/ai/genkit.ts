import {genkit} from 'genkit';
import {googleAI as googleAIPlugin} from '@genkit-ai/googleai';

// Initialize the plugin, but do not export the helper instance.
// The global `ai` object will still have access to all registered plugins.
const googleAI = googleAIPlugin();

export const ai = genkit({
  plugins: [googleAI],
});
