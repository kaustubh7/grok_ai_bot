import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [question, setQuestion] = useState('');
    const [model, setModel] = useState('grok-beta');
    const [temperature, setTemperature] = useState(0);
    const [result, setResult] = useState('');
    const [apiResponse, setApiResponse] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form submitted');
        try {
            const response = await fetch('http://localhost:3001/api/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, model, temperature })
            });
            console.log('Response received');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Data received:', data);
            setApiResponse(data);
        } catch (error) {
            console.error('Error:', error);
            setResult('An error occurred while validating the rule/question.');
        }
    };

    useEffect(() => {
        if (apiResponse) {
            if (apiResponse.choices && apiResponse.choices.length > 0) {
                setResult(apiResponse.choices[0].text);
            } else {
                setResult('No result found.');
            }
        }
    }, [apiResponse]);

    return (
        <div className="App">
            <h1>Cricket Rules Validator</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter your cricket rule/question:
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows="4"
                        cols="50"
                    />
                </label>
                <label>
                    Choose GPT model:
                    <select value={model} onChange={(e) => setModel(e.target.value)}>
                        <option value="grok-beta">Grok</option>
                    </select>
                </label>
                <label>
                    Temperature:
                    <input
                        type="number"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        step="0.1"
                        min="0"
                        max="1"
                    />
                </label>
                <button type="submit">Validate Rule/Question</button>
            </form>
            <div id="result">
                <h2>Validation Result:</h2>
                <p>{result}</p>
            </div>
        </div>
    );
}

export default App;