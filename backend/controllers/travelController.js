import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken';
import SearchHistory from '../models/SearchHistory.js';
import { getDestinationImages } from '../utils/imageUtil.js';
import { getDestinationWeather } from '../utils/weatherUtil.js';

// Initialize Gemini AI
const getGenAIModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY is not defined. Using mock data fallback.');
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
};

// Mock data generator for fallback
const getMockTravelData = (query) => {
  const q = query.toLowerCase().trim();
  const db = {
    paris: {
      overview: 'Paris, France’s capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond such landmarks as the Eiffel Tower and the 12th-century, Gothic Notre-Dame cathedral, the city is known for its cafe culture and designer boutiques along the Rue du Faubourg Saint-Honoré.',
      bestTime: 'The best time to visit Paris is from April to June and October to November, when the weather is mild and pleasant, and tourist crowds are smaller compared to summer.',
      attractions: ['Eiffel Tower', 'Louvre Museum', 'Cathédrale Notre-Dame de Paris', 'Arc de Triomphe', 'Champs-Élysées'],
      estimatedBudget: {
        backpacker: '$60 - $80 / day (Hostels, street food, public transport)',
        midRange: '$150 - $250 / day (3-star hotel, sit-down dinners, museum entries)',
        luxury: '$500+ / day (5-star hotels, fine dining Michelin restaurants, private tours)',
      }
    },
    tokyo: {
      overview: 'Tokyo, Japan’s bustling capital, mixes ultra-modern neon-lit skyscrapers with historic Shinto shrines and temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods. The Imperial Palace sits amid large public gardens. The city is also famous for its world-class food, anime culture, and incredibly efficient public transportation.',
      bestTime: 'March to April (Cherry Blossom season) and September to November (Autumn leaves) offer the most comfortable weather and scenic outdoor views.',
      attractions: ['Sensō-ji Temple', 'Shibuya Crossing', 'Tokyo Skytree', 'Meiji Jingu Shrine', 'Tsukiji Outer Market'],
      estimatedBudget: {
        backpacker: '$45 - $65 / day (Capsule hotels, ramen shops, day passes)',
        midRange: '$120 - $200 / day (Business hotels, sushi trains, moderate admissions)',
        luxury: '$450+ / day (Luxury Ryokans or 5-star hotels, Kaiseki dining, private guides)',
      }
    },
    bali: {
      overview: 'Bali, Indonesia, is a tropical paradise renowned for its forested volcanic mountains, iconic rice paddies, pristine beaches, and vibrant coral reefs. The island is home to highly spiritual religious sites such as cliffside Uluwatu Temple. With its rich cultural heritage, world-class yoga retreats, and lively surf scenes, Bali offers a perfect mix of relaxation and adventure.',
      bestTime: 'The dry season from April to October is the best time to visit Bali. The weather is warm, dry, and perfect for beach activities, hiking, and diving.',
      attractions: ['Uluwatu Temple', 'Ubud Monkey Forest', 'Mount Batur Sunrise Trek', 'Tegallalang Rice Terraces', 'Seminyak Beach'],
      estimatedBudget: {
        backpacker: '$25 - $35 / day (Homestays, local Warungs, rented scooters)',
        midRange: '$75 - $150 / day (Private villas, hipster cafes, guided day tours)',
        luxury: '$300+ / day (5-star beachside resorts, private infinity pools, fine dining)',
      }
    }
  };

  // Find exact or partial match
  for (const key of Object.keys(db)) {
    if (q.includes(key)) {
      return db[key];
    }
  }

  // Default generic fallback if no match
  return {
    overview: `${query} is an incredible travel destination offering visitors a unique cultural tapestry, breathtaking local landscapes, and warm hospitality. It features rich local history, spectacular scenic photo opportunities, and deep traditions waiting to be explored.`,
    bestTime: 'Spring (March to May) and Autumn (September to November) are generally ideal times to visit for pleasant weather, vibrant foliage, and comfortable sightseeing temperatures.',
    attractions: ['Historical City Center', 'Local Scenic Viewpoint', 'Traditional Culinary Market', 'Cultural Heritage Museum', 'Scenic Nature Park / Beach Area'],
    estimatedBudget: {
      backpacker: '$35 - $50 / day (Local hostels, street food, public transport)',
      midRange: '$100 - $180 / day (Standard hotels, local restaurants, entry tickets)',
      luxury: '$350+ / day (Premium resorts, upscale dining, private guides)',
    }
  };
};

// @desc    Search for a travel destination
// @route   POST /api/travel/search
// @access  Public (Optionally records history for authenticated users)
export const searchDestination = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Please enter a search destination' });
    }

    let resultData = null;
    const model = getGenAIModel();

    if (model) {
      try {
        const prompt = `
          Generate a detailed travel guide for the destination: "${query}".
          You MUST respond with only a valid JSON object matching the following structure. Do not include markdown code block formatting (like \`\`\`json) or any other text outside the JSON. Keep descriptions elegant and highly informative.

          Structure:
          {
            "overview": "A detailed, engaging, and premium overview of the destination.",
            "bestTime": "The absolute best months or seasons to visit, with a brief explanation of why.",
            "attractions": ["Top Attraction 1", "Top Attraction 2", "Top Attraction 3", "Top Attraction 4", "Top Attraction 5"],
            "estimatedBudget": {
              "backpacker": "Detailed budget range and description for backpackers.",
              "midRange": "Detailed budget range and description for mid-range travelers.",
              "luxury": "Detailed budget range and description for luxury travelers."
            }
          }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up formatting markdown wrappers if Gemini returns them
        let cleanJsonText = responseText.trim();
        if (cleanJsonText.startsWith('```json')) {
          cleanJsonText = cleanJsonText.substring(7);
        } else if (cleanJsonText.startsWith('```')) {
          cleanJsonText = cleanJsonText.substring(3);
        }
        if (cleanJsonText.endsWith('```')) {
          cleanJsonText = cleanJsonText.substring(0, cleanJsonText.length - 3);
        }
        cleanJsonText = cleanJsonText.trim();

        resultData = JSON.parse(cleanJsonText);
      } catch (geminiError) {
        console.error('Gemini API call failed. Falling back to mock data.', geminiError);
        resultData = getMockTravelData(query);
      }
    } else {
      // No API key, use premium mock data directly
      resultData = getMockTravelData(query);
    }

    // Dynamic Weather, Image, and Coordinate resolution
    try {
      const images = await getDestinationImages(query);
      const weatherData = await getDestinationWeather(query);

      resultData.images = images;
      resultData.weather = weatherData.current;
      resultData.forecast = weatherData.forecast;
      resultData.coordinates = weatherData.coordinates;
      resultData.displayName = weatherData.displayName || query;
      resultData.country = weatherData.country || '';
    } catch (enrichError) {
      console.error('Error enriching destination details:', enrichError);
    }

    // Try to extract user ID from JWT if logged in
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_travel_key_123456!');
        userId = decoded.id;
      } catch (authError) {
        // Silently skip saving search history if token fails
        console.log('Skipping history save: unauthenticated/invalid token');
      }
    }

    // Save search history in MongoDB if logged in
    if (userId) {
      try {
        await SearchHistory.create({
          userId,
          query,
          result: resultData,
        });
      } catch (dbError) {
        console.error('Failed to save search history:', dbError);
      }
    }

    res.json({ query, result: resultData });
  } catch (error) {
    console.error('Search Destination Error:', error);
    res.status(500).json({ message: 'Error processing travel search query' });
  }
};

// @desc    Conversational AI Travel Assistant
// @route   POST /api/travel/chat
// @access  Public
export const chatAssistant = async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Please enter a message' });
    }

    const model = getGenAIModel();

    if (!model) {
      // Friendly assistant response when API key is missing
      return res.json({
        reply: `Hello! I would love to help you plan your travels. To unlock my fully dynamic AI travel brains, please configure the \`GEMINI_API_KEY\` in the backend \`.env\` file! 

However, as a seasoned travel advisor, here is a quick tip: Always pack a light power bank, keep digital copies of your passport in the cloud, and try to learn at least 5 local words (Hello, Please, Thank you, How much, Excuse me) before landing. 

Where would you like to travel next? I can still give you guides on destinations like Paris, Tokyo, and Bali!`,
      });
    }

    // Build conversation context
    let contextPrompt = `You are a friendly, helpful, and highly knowledgeable travel assistant named WanderLust AI.
Your goal is to help users plan trips, suggest destinations, give packing lists, share cultural tips, and answer all travel queries in an inspiring, professional tone. 
Be concise but packed with exciting travel insights!

Conversation History:
`;

    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg) => {
        const role = msg.sender === 'user' ? 'User' : 'WanderLust AI';
        contextPrompt += `${role}: ${msg.text}\n`;
      });
    }

    contextPrompt += `User: ${message}\n`;
    contextPrompt += `WanderLust AI:`;

    const result = await model.generateContent(contextPrompt);
    const reply = result.response.text().trim();

    res.json({ reply });
  } catch (error) {
    console.error('Chat Assistant Error:', error);
    res.status(500).json({ message: 'Error communicating with Gemini Assistant' });
  }
};
