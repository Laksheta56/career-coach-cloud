# GenAI Use Cases & Azure AI Services Mapping

## 1. AI-Powered Resume Scoring and Feedback
**Description**: The application analyzes uploaded resumes against job descriptions to provide a match score and constructive feedback on how to improve the resume.
**Azure AI Service Mapped**: **Azure OpenAI Service (GPT-4 / GPT-3.5-Turbo)**
- **Why Chosen**: GPT models excel at natural language understanding and generation, making them perfect for analyzing structured and unstructured text in resumes and extracting actionable insights.
- **Workflow**: 
  1. User uploads a resume (PDF/Docx).
  2. Text is extracted from the document.
  3. The extracted text and job description are sent to the Azure OpenAI API with a prompt to score the match and generate feedback.
  4. The response is returned to the frontend and displayed to the user.

## 2. Automated Information Extraction (Skills, Experience, Education)
**Description**: When a user uploads their resume, the system automatically parses and categorizes the information (e.g., skills, work experience, education) instead of requiring the user to manually enter it.
**Azure AI Service Mapped**: **Azure AI Document Intelligence (formerly Form Recognizer)**
- **Why Chosen**: Document Intelligence is optimized for extracting structured data from documents (like PDFs or images), which is ideal for parsing specific fields out of various resume formats.
- **Workflow**:
  1. Document is uploaded to Azure Blob Storage.
  2. An Azure Function triggers Azure AI Document Intelligence to parse the document.
  3. The structured JSON data is saved to the database (e.g., Cosmos DB) and presented to the user.

## 3. Interview Chatbot Simulator
**Description**: Users can participate in a simulated mock interview where a chatbot asks technical or behavioral questions based on the uploaded resume and job description.
**Azure AI Service Mapped**: **Azure Bot Service** combined with **Azure OpenAI Service**
- **Why Chosen**: The Bot Service provides the conversational framework, while Azure OpenAI powers the dynamic, context-aware responses to user answers.
- **Workflow**:
  1. User initiates a mock interview session.
  2. The system prompts Azure OpenAI to generate an interview question.
  3. The user responds, and the response is evaluated by Azure OpenAI for accuracy and tone.
  4. Feedback and the next question are generated and presented through the conversational interface.
