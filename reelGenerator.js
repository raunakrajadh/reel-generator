let attempt = 1;
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { getRandomVideo } from './videoService.js';
import { getRandomQuote } from './quoteService.js';
import { getRandomMusic } from './musicService.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateReel() {
    try {
        console.log(`TRY: ${attempt}`);

        const videoPath = await getRandomVideo();
        const quote = await getRandomQuote();
        const musicPath = await getRandomMusic();
        let flag = 0;
        
        const outputVideoPath = path.resolve(__dirname, 'output', '_reel.mp4');
        
        ffmpeg()
        .input(videoPath)
        .input(musicPath)
        .complexFilter([
            {
                filter: 'drawtext',
                options: {
                    fontfile: '/path/to/font.ttf', // Replace with the path to your font file
                    text: quote,
                    fontsize: 24,
                    fontcolor: 'white',
                    x: '(w-text_w)/2', // Center the text horizontally
                    y: '(h-text_h)/2', // Center the text vertically
                    shadowcolor: 'black',
                    shadowx: 2,
                    shadowy: 2
                }
            }
        ])
        .outputOptions('-shortest')
        .on('progress', function(progress) {
            if(flag == 0){
                console.log('Generating video with the following components:');
                console.log(`Video Path: ${videoPath}`);
                console.log(`Quote: ${quote}`);
                console.log(`Music Path: ${musicPath}`);                
                flag = 1;
            }
            console.log(`Processing: ${progress.percent}% done`);
        })
        .on('end', function() {
            console.log('Reel generation completed!');
        })
        .save(outputVideoPath);
    
    } catch (error) {
        console.error('Error generating reel:', error.message);
    }
    attempt++;
}

process.on('uncaughtException', (err) => {
    if(String(err).startsWith('Error: ffmpeg')){
        console.log(`Music is corrupted`)
    }
    generateReel();
})

export { generateReel };
