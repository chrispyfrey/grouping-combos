import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

// TODO
// 1. Intermediary state to select cardinalities of combinations
// 2. Copy text button/functionality

function ComboApp() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const generateCombinations = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\n/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();
        
        if (parsedInput.search(' ') > 0) {
            const splitDimArr = parsedInput.split(' ');
            const dimDictArr = [];

            for (let i = 0; i < splitDimArr.length; ++i) {
                dimDictArr.push({'dim': splitDimArr[i], 'ndx': i+1});
            }
            
            const outArr = [[{'dim': '', 'ndx': 0}], dimDictArr];
            let tmpArr = null;
            let prvDimDictArr = null;

            for (let i = 0; i < splitDimArr.length-1; ++i) {
                tmpArr = [];
                prvDimDictArr = outArr[outArr.length-1];

                for (let j = 0; j < prvDimDictArr.length; ++j) {
                    for (let k = prvDimDictArr[j]['ndx']; k < splitDimArr.length; ++k) {
                        tmpArr.push({'dim': prvDimDictArr[j]['dim'] + ', ' + splitDimArr[k], 'ndx': k+1});
                    }
                }

                outArr.push(tmpArr);
            }
            
            const outStrArr = [];

            for (let i = 0; i < outArr.length; ++i) {
                for (let j = 0; j < outArr[i].length; ++j) {
                    if (i+1 < outArr.length || j+1 < outArr[i].length) {
                        outStrArr.push('(' + outArr[i][j]['dim'] + '),\n');
                    }
                    else {
                        outStrArr.push('(' + outArr[i][j]['dim'] + ')');
                    }
                }
            }

            setOutput(outStrArr.join(''));
        }
        else {
            setOutput('Error: Input must contain more than one dimension and be delimited by spaces, newlines, commas, or some combination.');
        }
    }

    const clear = () => {
        setInput('');
        setOutput('');
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
                onChange={e => setInput(e.target.value)}
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
        <div className='flexContainer'>
            <p className='output'>{output === '' ? null : output}</p>
        </div>
        </>
    )
}
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ComboApp />);
