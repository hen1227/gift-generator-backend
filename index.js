import express, {json} from 'express';
import cors from 'cors';
import {generateFollowUpPrompt, generateInitialPrompt, initialContextPrompt} from "./prompts.js";
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
    console.log(req.body.data);

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
        temperature: 1.25 // TODO: Test this to find best value, it is the level of creativity 0-2
    });

    console.log(completion.choices[0])

    const jsonData = JSON.parse(completion.choices[0].message.content);

    return res.status(200).send(jsonData);
});


app.post('/api/sendFollowUpMessage', async (req, res) => {
    const data = req.body.data;

    console.log(data);
    console.log(data.previousPrompts[0]);
    try {

        const initialPrompt = data.previousPrompts[0].promptInfo;

        const context = initialContextPrompt;
        const prompt = generateInitialPrompt(initialPrompt);

        let messages = []
        messages.push({
            role: "system",
            content: context,
        });

        messages.push({
            role: "user",
            content: prompt,
        });

        messages.push({
            role: "assistant",
            content: JSON.stringify(data.previousPrompts[0].gifts),
        });

        for(let i = 1; i < data.previousPrompts.length; i++) {
            messages.push({
                role: "user",
                content: generateFollowUpPrompt(data.previousPrompts[i].promptInfo),
            });
            messages.push({
                role: "assistant",
                content: JSON.stringify(data.previousPrompts[i].gifts),
            });
        }

        messages.push({
            role: "user",
            content: generateFollowUpPrompt(data.formData),
        });

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-3.5-turbo',
            temperature: 1.15 // TODO: Test this to find best value, it is the level of creativity 0-2
        });

        console.log(completion.choices[0])

        const jsonData = JSON.parse(completion.choices[0].message.content);
        let responseData = {
            gifts: jsonData.gifts || jsonData,
            title: jsonData.title || null,
        }

        return res.status(200).send(responseData);
    } catch (error) {
        console.error('Error sending notifications:', error);
        return res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Example app listening on port 3001!');
});
