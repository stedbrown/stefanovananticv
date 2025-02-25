# Stefano Vananti CV Assistant

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-4.5.2-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-4.28.0-green)

## 🌐 Live Demo

[View Live Demo on Vercel](https://stefanovananticv.vercel.app/)

## 📝 Description

The Stefano Vananti CV Assistant is an interactive web application that allows users to ask questions about Stefano Vananti's CV and professional experience. The application uses voice recognition technology to capture user questions and OpenAI's API to generate relevant responses based on Stefano's CV information.

## ✨ Features

- **Voice Interaction**: Ask questions by speaking directly to the application
- **AI-Powered Responses**: Get accurate information about Stefano's skills, experience, and background
- **Interactive UI**: Beautiful and responsive interface with animated audio visualizer
- **Suggested Prompts**: Quick access to common questions about the CV
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing
- **Mobile Responsive**: Works on all devices and screen sizes

## 🛠️ Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Voice Recognition**: Web Speech API
- **AI Integration**: OpenAI API (GPT-3.5 Turbo)
- **Animations**: Canvas API for audio visualization
- **Deployment**: Vercel

## 🚀 How It Works

1. **Voice Input**: Click on the animated sphere to start speaking
2. **Question Processing**: Your question is transcribed and sent to the AI
3. **CV Analysis**: The AI analyzes Stefano's CV to find relevant information
4. **Response Generation**: A helpful response is generated based on the CV content
5. **Visual Feedback**: The interface provides visual feedback throughout the process

## 🔧 Local Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/stedbrown/stefanovananticv.git
   cd stefanovananticv
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📱 Usage

- Click on the animated sphere to start speaking
- Ask questions about Stefano's professional experience, skills, or background
- Click on suggested prompts for quick information
- Toggle between dark and light modes using the theme switch

## 🔒 Privacy

This application processes voice input locally and only sends the transcribed text to OpenAI's API. No audio recordings are stored or transmitted.

## 📄 License

MIT

## 👨‍💻 About the Developer

Stefano Vananti is an IT specialist and front-end developer with expertise in AI and web development. This project showcases his skills in creating interactive web applications with AI integration.

## 🔗 Contact

For more information, please contact Stefano at stefanovananti@icloud.com or visit his [GitHub profile](https://github.com/stedbrown). 