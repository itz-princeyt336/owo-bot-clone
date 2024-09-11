const axios = require('axios');

async function getGif(tag) {
    const apiKey = process.env.GIPHY_API_KEY;
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${tag}&rating=g`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.data && data.data.images) {
            return data.data.images.original.url;
        } else {
            throw new Error('No GIF found');
        }
    } catch (error) {
        console.error('Error fetching GIF:', error);
        return null;
    }
}

module.exports = { getGif };
