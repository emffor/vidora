import dotenv from 'dotenv';

dotenv.config();

export const youtubeConfig = {
  apiKey: process.env.YOUTUBE_API_KEY || '',
  baseURL: 'https://www.googleapis.com/youtube/v3',
  maxResults: 25,
  timeout: 5000
};

export const validateYoutubeConfig = () => {
  if (!youtubeConfig.apiKey) {
    throw new Error('YOUTUBE_API_KEY não configurada no .env');
  }
};