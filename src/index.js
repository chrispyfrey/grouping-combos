import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

// TODO
// 1. Intermediary state to select cardinalities of combinations
// 2. Copy text button/functionality

function ComboApp() {
    const [cardinalityCheckList, setCardinalityChecklist] = useState([]);
    const [dimensionCheckList, setDimensionChecklist] = useState([]);
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
        if (inputStr.length !== 0) {
            let parsedInput = inputStr.replace(/,|\n/g, ' ');
            parsedInput = parsedInput.replace(/ {2,}/g, ' ');
            parsedInput = parsedInput.trim();
            const parsedInputList = parsedInput.split(' ');
            const cardinalityList = [];

            for (let i = 0; i <= parsedInputList.length; ++i) {
                cardinalityList.push({ 'num': i, 'state': true });
            }
            
            setCardinalityChecklist(cardinalityList);
        }
        else {
            setCardinalityChecklist([]);
        }
    }

    const generateDimensionList = (inputStr) => {
        if (inputStr.length !== 0) {
            let parsedInput = inputStr.replace(/,|\n/g, ' ');
            parsedInput = parsedInput.replace(/ {2,}/g, ' ');
            parsedInput = parsedInput.trim();
            const parsedInputList = parsedInput.split(' ');
            const dimensionList = [];

            for (let i = 0; i < parsedInputList.length; ++i) {
                dimensionList.push({ 'dim': parsedInputList[i], 'state': false });
            }
            
            setDimensionChecklist(dimensionList);
        }
        else {
            setDimensionChecklist([]);
        }
    }

    const textInputHandler = (inputStr) => {
        setInput(inputStr);
        generateCardinalityList(inputStr);
        generateDimensionList(inputStr);
    }

    const cardinalityCheckInputHandler = (ndx) => {
        const tmpList = [...cardinalityCheckList];
        tmpList[ndx]['state'] = !tmpList[ndx]['state'];
        setCardinalityChecklist(tmpList);
    }

    const dimensionCheckInputHandler = (ndx) => {
        const tmpList = [...dimensionCheckList];
        tmpList[ndx]['state'] = !tmpList[ndx]['state'];
        setDimensionChecklist(tmpList);
    }

    const clear = () => {
        setInput('');
        setOutput('');
        setCardinalityChecklist([]);
        setDimensionChecklist([]);
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
                onChange={e => textInputHandler(e.target.value)}
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
        <div className='cardinalityCheckBoxContainer'>{cardinalityCheckList.map((item, index) => (
            <div key={index}>
                <input
                    type='checkbox'
                    checked={item['state']}
                    onClick={e => cardinalityCheckInputHandler(index)}
                />
                <span>{item['num']}</span>
            </div>
        ))}
        </div>
        <div className='dimensionCheckBoxContainer'>{dimensionCheckList.map((item, index) => (
            <div key={index}>
                <input 
                    type='checkbox'
                    checked={item['state']}
                    onClick={e => dimensionCheckInputHandler(index)}
                />
                <span>{item['dim']}</span>
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
