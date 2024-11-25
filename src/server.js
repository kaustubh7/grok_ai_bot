import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Use the CORS middleware
app.use(cors());

app.use(bodyParser.json());

app.post('/api/validate', async (req, res) => {
    const { question, model, temperature } = req.body;

    try {
        console.log('API Key:', process.env.XAI_API_KEY); // Debugging: Log the API key
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' // Hardcoded API key
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a cricket bot, only capable of answering cricket-related questions. If you are being asked a question not related to cricket, then you need to respond sarcastically everytime.'
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ],
                model: model,
                stream: false,
                temperature: temperature
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while validating the rule/question.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
