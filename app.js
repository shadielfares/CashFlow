const express = require('express');
const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

const openai = new OpenAI(process.env.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);

app.use(express.json());

app.post('/api/openai', async (req, res) => {
    try {
        const file1 = await openai.files.create({
            file: fs.createReadStream('./ideachunks/chunk_1.csv'),
            purpose: "assistants",
        });
        const file2 = await openai.files.create({
            file: fs.createReadStream('./ideachunks/chunk_2.csv'),
            purpose: "assistants",
        });
        const file3 = await openai.files.create({
            file: fs.createReadStream('./ideachunks/chunk_3.csv'),
            purpose: "assistants",
        });
        const file4 = await openai.files.create({
            file: fs.createReadStream('./ideachunks/chunk_4.csv'),
            purpose: "assistants",
        });
        const file5 = await openai.files.create({
            file: fs.createReadStream('./ideachunks/chunk_5.csv'),
            purpose: "assistants",
        });
        const file6 = await openai.files.create({
            file: fs.createReadStream('./ideachunks/chunk_6.csv'),
            purpose: "assistants",
        });
        const assistant = await openai.beta.assistants.create({
            name: "Brilliant Entrepreneur",
            model: "gpt-3.5-turbo-1106",
            instructions:
                "You are a brilliant entrepreneur. When asked a question, think of a unique business idea.",
            tools: [{ type: "code_interpreter" }],
            file_ids: [file1.id, file2.id, file3.id, file4.id, file5.id, file6.id]
        });

        const thread = await openai.beta.threads.create();
        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: "Please give me unique ideas for a business.",
            file_ids: [file1.id, file2.id, file3.id, file4.id, file5.id, file6.id]
        });

        const run = await openai.beta.threads.runs.create(thread.id, { 
            assistant_id: assistant.id,
        });

        await checkStatus(thread.id, run.id);
        const messages = await openai.beta.threads.messages.list(thread.id);
        res.status(200).json({
            answer: messages.body.data[0].content[0].text.value,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function checkStatus(threadId, runId) {
    let isComplete = false;
    while(!isComplete) {
        const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
        if(runStatus.status === 'completed') {
            isComplete = true;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
