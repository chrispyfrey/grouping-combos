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
        let parsedInput = inputStr.replace(/,|\n/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        if (parsedInput.length > 0) {
            const parsedInputList = parsedInput.split(' ');

            if (parsedInputList.length > cardinalityCheckList.length) {
                const cardinalityList = [...cardinalityCheckList];

                for (let i = cardinalityCheckList.length; i < parsedInputList.length; ++i) {
                    cardinalityList.push({ 'num': i, 'state': true });
                }
                
                setCardinalityChecklist(cardinalityList);
            }
            else if (parsedInputList.length < cardinalityCheckList.length) {
                const tmp = [...cardinalityCheckList];
                tmp.length = parsedInputList.length;
                setCardinalityChecklist(tmp);
            }
        }
        else {
            setCardinalityChecklist([]);
        }
    }

    const generateDimensionList = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\n/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        if (parsedInput.length > 0) {
            const parsedInputList = parsedInput.split(' ');
            const currentDimList = [...dimensionCheckList];

            if (parsedInputList.length === currentDimList.length) {
                for (let i = 0; i < parsedInputList.length; ++i) {
                    if (parsedInputList[i] !== currentDimList[i]['dim']) {
                        currentDimList[i]['dim'] = parsedInputList[i];
                        break;
                    }
                }
            }
            else if (parsedInputList.length > currentDimList.length) {
                let didNotInsert = true;

                for (let i = 0; i < currentDimList.length; ++i) {
                    if (parsedInputList[i] !== currentDimList[i]['dim']) {
                        currentDimList.splice(i, 0, {'dim': parsedInputList[i], 'state': false})
                        didNotInsert = false;
                        break;
                    }
                }

                if (didNotInsert) {
                    currentDimList.push({'dim': parsedInputList[parsedInputList.length-1], 'state': false});
                }
            }
            else if (parsedInputList.length < currentDimList.length) {
                const d = currentDimList.length - parsedInputList.length;
                let didNotRemove = true;

                for (let i = 0; i < parsedInputList.length; ++i) {
                    if (parsedInputList[i] !== currentDimList[i]['dim']) {
                        currentDimList.splice(i, d+1);
                        didNotRemove = false;
                        break;
                    }
                }

                if (didNotRemove) {
                    currentDimList.pop();
                }
            }
            
            setDimensionChecklist(currentDimList);
        }
        else {
            setDimensionChecklist([]);
        }
    }

    const textInputHandler = (inputStr) => {
        generateCardinalityList(inputStr);
        generateDimensionList(inputStr);
        setInput(inputStr);
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
        <div className='flexContainer'>
            <div className='cardinalityCheckBoxContainer'>{cardinalityCheckList.map((item, index) => (
                <div key={index}>
                    <input
                        type='checkbox'
                        checked={item['state']}
                        onChange={e => cardinalityCheckInputHandler(index)}
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
                        onChange={e => dimensionCheckInputHandler(index)}
                    />
                    <span>{item['dim']}</span>
                </div>
            ))}
            </div>
        </div>
        <div className='flexContainer'>
            <p className='output'>{output === '' ? null : output}</p>
        </div>
        </>
    )
}
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ComboApp />);
