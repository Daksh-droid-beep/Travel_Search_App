import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY is not defined in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listAllModels() {
  try {
    const response = await genAI.listModels();
    console.log('--- AVAILABLE MODELS ---');
    for (const m of response.models) {
      console.log(m.name);
    }
    console.log('------------------------');
  } catch (error) {
    console.error('Error fetching models:', error);
  }
}

listAllModels();
