const express = require('express');

// Dynamically import node-fetch as an ES module
import('node-fetch').then(async (fetch) => {
    const app = express();
    const PORT = 4000;

    // Define a route for handling POST requests
    app.post('/chatbot', async (req, res) => {
        const body = await req.body;
        const dialogHistory = body.dialogHistory;

        // Call the Rinna API using node-fetch
        try {
            const response = await fetch('https://api.rinna.co.jp/models/chitchat-generation', {
                method: 'POST',
                body: JSON.stringify({ dialogHistory }),
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': 'fe69ad2a7d6e49c4967ec62c89cadc15'
                }
            });

            if (response.ok) {
                const data = await response.json();
                res.json(data); // Send the response from Rinna API back to the client
            } else {
                throw new Error('Failed to fetch data from Rinna API');
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Error importing node-fetch:', err);
});
