const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.post('/api/validate', async (req, res) => {
    const {question, model, temperature, max_tokens, top_p} = req.body;
    let apiUrl;
    let headers;
    switch (model) {
        case 'claude':
            apiUrl = 'https://api.anthropic.com/v1/claude/completions';
            headers = {'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`};
            break;
        case 'gemini':
            apiUrl = 'https://api.google.com/v1/gemini/completions';
            headers = {'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`};
            break;
        default:
            apiUrl = `https://api.openai.com/v1/engines/${model}/completions`;
            headers = {'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`};
            break;
    }
    try {
        const response = await axios.post(apiUrl, {
            prompt: `Is the following cricket rule/question correct? ${question}`,
            max_tokens: max_tokens,
            temperature: temperature,
            top_p: top_p
        }, {headers});
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});