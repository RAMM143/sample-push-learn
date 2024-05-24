const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const TIMEOUT = 500; // 500 milliseconds

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ error: 'Please provide at least one URL as query parameter.' });
    }

    try {
        const fetchNumbers = async (url) => {
            try {
                const response = await axios.get(url, { timeout: TIMEOUT });
                if (response.data && Array.isArray(response.data.numbers)) {
                    return response.data.numbers;
                }
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error.message);
                return [];
            }
        };

        const results = await Promise.all(urls.map(fetchNumbers));
        const mergedNumbers = Array.from(new Set(results.flat())).sort((a, b) => a - b);

        res.json({ numbers: mergedNumbers });
    } catch (error) {
        console.error('Error processing URLs:', error.message);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(PORT, () => {
    console.log(`Number Management Service running on port ${PORT}`);
});
