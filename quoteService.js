import axios from 'axios';

async function getRandomQuote() {
    try {
        const apiKey = require('./config.json').favqs_api;
        const response = await axios.get('https://favqs.com/api/quotes/', {
            params: {
                filter: require('./config.json').quote_filter,
                type: 'tag'
            },
            headers: {
                Authorization: `Token token=${apiKey}`
            }
        });
        const quotes = response.data.quotes;
        if (!quotes || quotes.length === 0) {
            throw new Error('No quotes found');
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex].body;
    } catch (error) {
        console.error('Error fetching quotes:', error.message);
    }
}

export { getRandomQuote };
