import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

// TODO
// 1. Intermediary state to select cardinalities of combinations
// 2. Copy text button/functionality

function ComboApp() {
    const [checkList, setChecklist] = useState([]);

    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    

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
            
            setOutput(comboList.join(''));
        }
        else {
            setOutput('Error: Input must contain more than one dimension and be delimited by spaces, newlines, commas, or some combination.');
        }
    }

    const generateCardinalityList = (inputStr) => {
        // This can likely be optimized by counting delimiters
        if (inputStr.length != 0) {
            let parsedInput = inputStr.replace(/,|\n/g, ' ');
            parsedInput = parsedInput.replace(/ {2,}/g, ' ');
            parsedInput = parsedInput.trim();
            const parsedInputList = parsedInput.split(' ');
            const cardinalityList = [];

            for (let i = 0; i <= parsedInputList.length; ++i) {
                cardinalityList.push(i);
            }
            
            setChecklist(cardinalityList);
        }
        else {
            setChecklist([]);
        }
    }

    const inputHandler = (inputStr) => {
        setInput(inputStr);
        generateCardinalityList(inputStr);
    }

    const clear = () => {
        setInput('');
        setOutput('');
        setChecklist([]);
    }
    
    return (
        <>
        <div>
            <h1 className='title'>Grouping Set Combination Generator</h1>
            <h4 className='subTitle'>Commas, spaces, newlines, or combinations of these are all accepted delimiters.</h4>
        </div>
        <div className='flexContainer'>
            <textarea
                className='inputBox'
                spellCheck='false'
                placeholder='Enter dimensions here...'
                value={input}
                onChange={e => inputHandler(e.target.value)}
            />
        </div>
        <div className='flexContainer'>
            <button
                className='button'
                disabled={input === '' ? true : false}
                onClick={() => generateCombinations(input)}>
                Generate
            </button>
            <button
                className='button'
                disabled={input === '' ? true : false}
                onClick={clear}>
                Clear
            </button>
        </div>
        <div className='checkBoxContainer'>{checkList.map((item, index) => (
            <div key={index}>
                <input value={item} type="checkbox" />
                <span>{item}</span>
            </div>
        ))}
        </div>
        <div className='flexContainer'>
            <p className='output'>{output === '' ? null : output}</p>
        </div>
        </>
    )
}
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ComboApp />);
