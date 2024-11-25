import React, {useState} from 'react';
import './App.css';

function App() {
    const [question, setQuestion] = useState('');
    const [model, setModel] = useState('text-davinci-003');
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(150);
    const [topP, setTopP] = useState(1.0);
    const [result, setResult] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/api/validate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({question, model, temperature, max_tokens: maxTokens, top_p: topP})
        });
        const data = await response.json();
        setResult(data.choices[0].text);
    };
    return (<div className="App"><h1>Cricket Rules Validator</h1>
        <form onSubmit={handleSubmit}><label> Enter your cricket rule/question: <textarea value={question}
                                                                                          onChange={(e) => setQuestion(e.target.value)}
                                                                                          rows="4" cols="50"/> </label>
            <label> Choose GPT model: <select value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="text-davinci-003">text-davinci-003</option>
                <option value="text-curie-001">text-curie-001</option>
                <option value="text-babbage-001">text-babbage-001</option>
                <option value="text-ada-001">text-ada-001</option>
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
            </select> </label> <label> Temperature: <input type="number" value={temperature}
                                                           onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                                           step="0.1" min="0" max="1"/> </label> <label> Max
                Tokens: <input type="number" value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                               min="1" max="2048"/> </label> <label> Top P: <input type="number" value={topP}
                                                                                   onChange={(e) => setTopP(parseFloat(e.target.value))}
                                                                                   step="0.1" min="0" max="1"/> </label>
            <button type="submit">Validate Rule/Question</button>
        </form>
        <div id="result"><h2>Validation Result:</h2>                <p>{result}</p></div>
    </div>);
}

export default App;