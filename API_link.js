document.getElementById('moving-yes').addEventListener('click', async () => {
    const businessIdeas = await fetchBusinessIdeas(); // Fetch business ideas from .csv files
    const uniqueIdea = await generateUniqueIdea(businessIdeas); // Generate unique business idea using OpenAI's API
    displayResult(uniqueIdea); // Display the generated business idea
});

async function fetchBusinessIdeas() {
    const files = ['./Data/chunk_1.csv', './Data/chunk_2.csv', './Data/chunk_3.csv', './Data/chunk_4.csv', './Data/chunk_5.csv', 
    './Data/chunk_6.csv', './Data/chunk_7.csv', './Data/chunk_8.csv', './Data/chunk_9.csv', './Data/chunk_10.csv', './Data/chunk_11.csv', 
    './Data/chunk_12.csv', 
    ]

    let allBusinessIdeas = [];

    try {
        for (const file of files) {
            const response = await fetch(file); //Fetch csv file
            const csvData = await response.text(); //Get CSV Data as text

            //Parse using PapaParse
            const parsedData = Papa.parse(csvData, {header: false });

            //Extract business ideas from parsed data
            const businessIdeas = parsedData.data.map(row => row[0]); //If first column contains business ideas

            //Add business ideas to the array
            allBusinessIdeas = allBusinessIdeas.concat(businessIdeas);

        }
    } catch (error) {
        console.error('Error fetching business ideas:', error);
    }
    return allBusinessIdeas;
}

async function generateUniqueIdea(businessIdeas) {
    if (businessIdeas.length === 0) {
        return "No business ideas available";
    }

    try {
        // Randomly select a business idea from the array
        const randomIndex = Math.floor(Math.random() * businessIdeas.length);
        const selectedIdea = businessIdeas[randomIndex];

        // Send the selected idea to OpenAI's Assistants API to generate a unique idea
        const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                prompt: selectedIdea,
                max_tokens: 100,
                temperature: 0.5, // Adjust temperature as needed
                stop: '\n'
            })
        });

        const data = await response.json();

        // Extract and return the generated unique idea from the API response
        return data.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating unique idea:', error);
        return "Error generating unique idea";
    }
}


function displayResult(idea) {
    document.getElementById('resultTextArea').value = idea;
}
