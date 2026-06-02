import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.5-flash'];

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const start = Date.now();
    const result = await model.generateContent('Say hello!');
    const duration = Date.now() - start;
    console.log(`✅ [${modelName}] Succeeded in ${duration}ms! Reply: ${result.response.text().trim()}`);
    return true;
  } catch (error) {
    console.log(`❌ [${modelName}] Failed with error: ${error.message}`);
    return false;
  }
}

async function run() {
  console.log('Testing model availability under your API key...');
  for (const m of modelsToTest) {
    await testModel(m);
  }
}

run();
