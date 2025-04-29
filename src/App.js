import React from 'react';
import './App.css'; // If you have custom styles
import ChatComponent from './components/ChatComponent'; // Import the chat component
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      {/* Main Header */}
      <header className="App-header">
        <h1 className="text-white">AI Prompt Box</h1>
      </header>

      {/* Chat Component */}
      <ChatComponent />

      {/* Footer */}
      <footer className="App-footer text-center">
        <p className="text-white">Powered by OpenAI</p>
      </footer>
    </div>
  );
}

export default App;
