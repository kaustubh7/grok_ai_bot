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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let resultText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                resultText += decoder.decode(value, { stream: true });
                setResult(resultText);
            }

            setApiResponse(resultText);
        } catch (error) {
            console.error('Error:', error);
            setResult('An error occurred while validating the rule/question.');
        }
    };

    useEffect(() => {
        if (apiResponse) {
            console.log('Final API Response:', apiResponse);
        }
    }, [apiResponse]);

    return (
        <div className="App">
            <h1>Cricket Rules Validator</h1>
            <form onSubmit={handleSubmit} className="form">
                <label>
                    Enter your cricket rule/question:
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows="4"
                        cols="50"
                        className="textarea"
                    />
                </label>
                <label>
                    Choose GPT model:
                    <select value={model} onChange={(e) => setModel(e.target.value)} className="select">
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
                        className="input"
                    />
                </label>
                <button type="submit" className="button">Validate Rule/Question</button>
            </form>
            {result && <div className="result">{result}</div>}
        </div>
    );
}

export default App;
