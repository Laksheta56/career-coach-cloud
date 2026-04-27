const { DocumentAnalysisClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const { OpenAIClient } = require("@azure/openai");
const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, myBlob) {
    context.log("Blob trigger function processed blob \n Name:", context.bindingData.name, "\n Blob Size:", myBlob.length, "Bytes");

    try {
        // 1. Extract text using Azure AI Document Intelligence
        const documentAnalyzer = new DocumentAnalysisClient(
            process.env.DOCUMENT_INTELLIGENCE_ENDPOINT,
            new AzureKeyCredential(process.env.DOCUMENT_INTELLIGENCE_KEY)
        );
        
        context.log("Extracting text from resume...");
        const poller = await documentAnalyzer.beginAnalyzeDocument("prebuilt-document", myBlob);
        const { content } = await poller.pollUntilDone();

        // 2. Analyze using Azure OpenAI Service
        const openai = new OpenAIClient(
            process.env.AZURE_OPENAI_ENDPOINT,
            new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
        );

        const prompt = `
        Analyze the following resume text. Output JSON strictly containing:
        {
           "resumeScore": number,
           "jobMatchPercentage": number,
           "scoreBreakdown": { "skills": number, "experience": number, "projects": number, "formatting": number },
           "scoreExplanations": { "skills": string, "experience": string, "projects": string, "formatting": string },
           "extractedSkills": { "technical": [string], "soft": [string] },
           "missingSkills": [string],
           "strengths": [string],
           "weaknesses": [string],
           "suggestions": [string],
           "atsSimulation": { "pass": boolean, "reason": string },
           "careerPathPrediction": [{ "role": string, "reasoning": string }]
        }
        Resume Text: ${content}
        `;

        context.log("Analyzing with Azure OpenAI...");
        const response = await openai.getChatCompletions(process.env.AZURE_OPENAI_DEPLOYMENT_NAME, [
            { role: "system", content: "You are an expert ATS and career coach AI." },
            { role: "user", content: prompt }
        ]);

        const analysisResult = JSON.parse(response.choices[0].message.content);

        // 3. Store result in Azure Cosmos DB
        const cosmosClient = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
        const database = cosmosClient.database("ResumeDb");
        const container = database.container("Analyses");

        const dbItem = {
            id: context.bindingData.name,
            blobUri: context.bindingData.uri,
            analysis: analysisResult,
            processedAt: new Date().toISOString()
        };

        context.log("Saving to Cosmos DB...");
        await container.items.create(dbItem);

        context.log("Processing complete for", context.bindingData.name);
    } catch (error) {
        context.log.error("Error processing resume blob:", error);
        throw error;
    }
};
