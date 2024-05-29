import fs from 'fs';
import path from 'path';
import youtubeSearch from 'youtube-search';
import ytdl from 'ytdl-core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getRandomMusic() {
    try {
        const opts = {
            maxResults: 100,
            key: require('./config.json').youtube_api,
            type: 'video'
        };

        const searchQuery = require('./config.json').music_search;
        const searchResults = await youtubeSearch(searchQuery, opts);

        const videos = searchResults.results;

        if (!Array.isArray(videos) || videos.length === 0) {
            throw new Error('No search results found');
        }

        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        const videoId = randomVideo.id;

        const videoInfo = await ytdl.getInfo(videoId);

        const audioFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audioonly' });

        const musicPath = path.resolve(__dirname, 'temp', 'music.mp3');

        await ytdl(videoId, { format: audioFormat })
            .pipe(fs.createWriteStream(musicPath));

        return musicPath;
    } catch (error) {
        console.error('Error fetching music:', error.message);
        throw error;
    }
}

export { getRandomMusic };
