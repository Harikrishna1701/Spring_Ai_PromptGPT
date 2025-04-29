import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatComponent() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [displayedResponse, setDisplayedResponse] = useState('');
    const [isPaused, setIsPaused] = useState(false);  // State for pause functionality
    const [intervalId, setIntervalId] = useState(null);  // State to store the interval ID

    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
    };

    const handleSendPrompt = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setResponse('');
        setDisplayedResponse('');
        setIsPaused(false);  // Reset pause state when a new prompt is sent

        try {
            const result = await axios.post('http://localhost:9191/openai/chat', 
                { prompt }, // ✅ send as JSON
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Log the raw response to inspect it before processing
            console.log("Raw AI Response:", result.data);

            const data = typeof result.data === "string" ? JSON.parse(result.data) : result.data;
            const aiMessage = data.choices[0].message.content;

            // Ensure we don't remove the first letter and clean the response properly
            const cleanedResponse = aiMessage.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();  // Clean the response

            console.log("Cleaned AI Response:", cleanedResponse);  // Check after cleaning

            setResponse(cleanedResponse);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setResponse("Error: Could not fetch AI response.");
        } finally {
            setLoading(false);
        }
    };

    const handlePause = () => {
        if (intervalId) {
            clearInterval(intervalId);  // Stop the typing effect
            setIntervalId(null);  // Reset the interval ID
        }
        setIsPaused(true);  // Update pause state
    };

    const handleResume = () => {
        setIsPaused(false);  // Reset pause state to false
        startTypingEffect(response);  // Resume typing effect from where it left off
    };

    useEffect(() => {
        if (response && !isPaused) {
            startTypingEffect(response);
        }
        // Clean up interval when the component is unmounted or a new response is received
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [response, isPaused]);

    const startTypingEffect = (responseText) => {
        let index = 0;
        const id = setInterval(() => {
            setDisplayedResponse((prev) => prev + responseText[index]);
            index++;
            if (index >= responseText.length) clearInterval(id);  // Stop when the message is fully displayed
        }, 40); // Speed of typing (ms)
        setIntervalId(id);  // Store the interval ID so we can clear it later
    };

    return (
        <div className="container">
            <div className="card">
                <textarea 
                    placeholder="Type your prompt here..."
                    value={prompt}
                    onChange={handlePromptChange}
                />
                <button onClick={handleSendPrompt} disabled={loading}>
                    {loading ? <div className="spinner"></div> : 'Send Prompt'}
                </button>

                {/* Display Response */}
                {displayedResponse && (
                    <div className="card-output">
                        <h5>AI Response:</h5>
                        <p>{displayedResponse}</p>
                    </div>
                )}

                {/* Pause and Resume Buttons */}
                <div className="button-group">
                    {isPaused ? (
                        <button onClick={handleResume}>Resume</button>
                    ) : (
                        <button onClick={handlePause}>Pause</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;
