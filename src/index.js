import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

function ComboApp() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState([]);

    const generateCombinations = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\n/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();
        
        if (parsedInput.search(' ') > 0) {
            const parsedInputList = parsedInput.split(' ');
            const comboList = [];
            let tmpArr = null;

            for (let n = 1; n < parsedInputList.length; ++n) {
                for (let i = 0; i+n < parsedInputList.length; ++i) {
                    for (let j = i+n; j < parsedInputList.length; ++j) {
                        tmpArr = parsedInputList.slice(i, i+n);
                        tmpArr.push(parsedInputList[j]);
                        tmpArr[0] = '(' + tmpArr[0];

                        if (n+1 < parsedInputList.length) 
                            tmpArr[tmpArr.length-1] = tmpArr[tmpArr.length-1] + '),\n';
                        else 
                            tmpArr[tmpArr.length-1] = tmpArr[tmpArr.length-1] + ')';
                        
                        comboList.push(tmpArr.join(', '));
                    }
                }
            }
            
            setOutput(comboList);
        }
        else {
            setOutput(['Error: Input must contain more than one dimension and be delimited by spaces, newlines, commas, or some combination.']);
        }
    }

    const clear = () => {
        setInput('');
        setOutput([]);
    }
    
    return (
        <>
        <div>
            <h1 className='title'>Grouping Set Combination Generator</h1>
        </div>
        <div className='flexContainer'>
            <textarea
                className='inputBox'
                spellCheck='false'
                placeholder='Enter dimensions here...'
                value={input}
                onChange={e => setInput(e.target.value)}
            />
        </div>
        <div className='flexContainer'>
            <button
                style={{width: '100px', marginTop: '20px', marginRight: '20px', marginBottom: '10px'}}
                className='button1'
                disabled={input === '' ? true : false}
                onClick={() => generateCombinations(input)}>
                Generate
            </button>
            <button
                style={{width: '100px', marginTop: '20px', marginLeft: '20px', marginBottom: '10px'}}
                disabled={input === '' ? true : false}
                onClick={clear}>
                Clear
            </button>
        </div>
        <div className='flexContainer'>
            <p className='output'>{output === '' ? null : output}</p>
        </div>
        </>
    )
}
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ComboApp />);
