import axios from 'axios';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PEXELS_API_KEY = require('./config.json').pixels_api;

async function getRandomVideo() {
    try {
        const response = await axios.get('https://api.pexels.com/videos/search', {
            headers: { Authorization: PEXELS_API_KEY },
            params: { query: require('./config.json').video_query, per_page: 1, page: Math.floor(Math.random() * 100) }
        });

        if (!response.data.videos || response.data.videos.length === 0) {
            throw new Error('No videos found');
        }

        const videoUrl = response.data.videos[0].video_files[0].link;
        const videoPath = path.resolve(__dirname, 'temp', 'video.mp4');
        
        const videoResponse = await fetch(videoUrl);
        const fileStream = fs.createWriteStream(videoPath);
        await new Promise((resolve, reject) => {
            videoResponse.body.pipe(fileStream);
            videoResponse.body.on("error", reject);
            fileStream.on("finish", resolve);
        });

        return videoPath;
    } catch (error) {
        console.error('Error fetching video:', error.message);
        throw error;
    }
}

export { getRandomVideo };
