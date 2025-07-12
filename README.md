# Text Analysis Platform (TAP)

> 🚀 **A comprehensive LLM-powered text analysis platform built for hands-on AI engineering learning**

A proof-of-concept that demonstrates practical implementation of AI applications using modern web technologies. This project serves as a learning companion for AI Engineering concepts, showcasing real-world patterns for LLM integration, prompt engineering, and scalable application architecture.

![Text Analysis Platform Interface](/assets/screenshots/tap.png)

## 🎯 Learning Objectives

This project was built to gain hands-on experience with:
- **LLM Integration**: Working with Ollama and LangChain with plans to add support for other providers and technologies
- **Prompt Engineering**: Designing, testing, and iterating on prompts for complex analysis tasks
- **AI Application Architecture**: Building scalable, maintainable AI-powered applications
- **Modern Web Development**: React with TypeScript, FastAPI, and clean architecture patterns
- **Performance Monitoring**: Tracking token usage, response times, and model performance
- **Experimentation (planned)**: A/B testing different models and prompts for consistent results

## ✨ Features

### 🔧 **Development & Testing Tools**
- **Multi-Model Support**: Switch between Ollama (local) models
- **Prompt Management**: Easy prompt editing
- **Metrics Dashboard**: Comprehensive analysis statistics and trends
- **Response Timeline**: Visual tracking of processing stages
- **Performance Analytics**: Real-time metrics for response time, token usage, and throughput

### 🏗️ **Architecture Highlights**
- **Clean API Design**: RESTful FastAPI backend
- **Atomic Design**: Component hierarchy following Atomic Design Principles
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Responsive UI**: Implemented with Tailwind CSS

### 🧠 **Argument Analysis Engine**
**The first tool created to work on this platform**
- **Intelligent Extraction**: Automatically identifies and extracts argumentative claims from text
- **Supporting Evidence Analysis**: Analyzes supporting claims and qualifiers for each argument
- **Logical Framework Mapping**: Breaks down the logical structure of arguments step-by-step
- **Credibility Scoring**: Provides quantitative assessment of argument strength and reliability
- **Comprehensive Reporting**: Detailed analysis with confidence scores and model assessments

## 🛠️ Tech Stack

### Webapp
- **React 19** with TypeScript - Modern React with latest features
- **Vite** - For development and building
- **Tailwind CSS** - UI development  
- **Recharts** - Responsive charts and visualizations
- **Lucide React** - Icons

### Api  
- **FastAPI** - High-performance Python web framework for API development
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI web server
- **LangChain** - LLM tooling
- **Ollama** - Local LLM management

### Development & Testing
- **TypeScript/ESLint** - Code quality and type safety

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Python 3.9+**
- **Node.js 18+** 
- **Git** 
- **Ollama**

**Install Ollama** ([Installation Guide](https://ollama.ai))
   ```bash
   # The application will connect to Ollama at localhost:11434
   ollama pull phi4:14b # or your preferred model
   ```

### Installation & Setup

1. **Clone and navigate to the project**:
   ```bash
   git clone <repository-url>
   cd TAP
   ```

2. **API Setup**:
   ```bash
   cd api
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Frontend Setup**:
   ```bash
   cd ../webapp
   npm install
   ```

### Running the Application
1. **Get started with an example prompt** (optional)
   ```bash
   # Copy example prompts to working directory
   cd api
   cp -r prompts/example/* prompts/
   ```

2. **Start the backend** (in `api/` directory):
   ```bash
   # Make sure virtual environment is activated
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 
   ```
   API will be available at: http://localhost:8000
   
   API Documentation: http://localhost:8000/docs

   ![API Docs](/assets/screenshots/api_docs.png)

3. **Start the webapp** (in a separate terminal and from the `webapp/` directory):
   ```bash
   npm run dev
   ```
   Webapp will be available at: http://localhost:3000

## 📖 Usage Example

1. **Select Your Model**: Choose between available Ollama models or OpenAI models
2. **Choose Application**: Currently supports Argument Analysis only
3. **Input Text**: Paste any argumentative text (essays, articles, debates)
4. **Review Results**: 
   - Overall credibility score and assessment
   - Individual argument breakdown with supporting claims
   - Logical framework analysis
   - Performance metrics and processing time
   - Raw response

**Example Input (auto-generated)**:
```
Artificial intelligence is revolutionizing various industries. I believe that AI will transform healthcare within the next decade. Recent studies have shown significant improvements in diagnostic accuracy. However, I think there are still ethical concerns that need to be addressed. The technology has advanced rapidly since 2020.
```

The system will extract arguments, analyze their logical structure, identify supporting evidence, and provide a comprehensive credibility assessment.

![Argument Analysis Results](/assets/screenshots/results.png)

![Response Metrics](/assets/screenshots/stats.png)

![Review the Raw Response](/assets/screenshots/response.png)

## 🔮 Planned Enhancements

- **Experiment Framework**: A/B testing for model and prompt comparison
- **Enhanced Configuration**: Fine-tuned hyperparameter controls
- **Results Persistence**: Save and compare analysis results over time
- **Additional Applications**: AI content detection, text quality assessment, etc.
- **Import Capabilities**: Support for file uploads and URL text extraction

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



