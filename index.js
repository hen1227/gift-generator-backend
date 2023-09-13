import express from 'express';
import cors from 'cors';
import {generateInitialPrompt, initialContextPrompt} from "./prompts.js";
import bodyParser from "express";
import {OpenAI} from "openai";
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION_ID
});


app.post('/api/sendInitialMessage', async (req, res) => {
    console.log(req.body.data)

    const context = initialContextPrompt;
    const prompt = generateInitialPrompt(req.body.data);

    let messages = []
    messages.push({
        role: "system",
        content: context,
    });

    messages.push({
        role: "user",
        content: prompt,
    });

    const completion = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo',
        temperature: 1.5 // TODO: Test this to find best value, it is the level of creativity 0-2
    });

    console.log(completion.choices[0])

    const jsonData = JSON.parse(completion.choices[0].message.content);

    return res.status(200).send(jsonData);
});


app.listen(3001, () => {
    console.log('Example app listening on port 3001!');
});