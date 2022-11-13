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
            
            const checkedDims = [...dimensionCheckList];
            const repeatDims = [];

            for (let i = 0; i < checkedDims.length; ++i) {
                if (checkedDims[i]['state'] === true) {
                    repeatDims.push(checkedDims[i]['dim']);
                }
            }

            if (repeatDims.length > 0) {
                for (let i = 0; i < outArr.length; ++i) {
                    for (let j = 0; j < outArr[i].length; ++j) {
                        for (let k = 0; k < repeatDims.length; ++k) {
                            if (outArr[i][j]['dim'].search(repeatDims[k]) === -1 && outArr[i][j]['dim'] !== '') {
                                outArr[i].splice(j, 1);
                                --j;
                                break;
                            }
                        }
                    }

                    if (outArr[i].length === 0) {
                        outArr.splice(i, 1);
                        --i;
                    }
                }
            }
            
            const outStrArr = [];
            const checkedCards = [...cardinalityCheckList];
            const cardSelections = [];

            for (let i = 0; i < checkedCards.length; ++i) {
                if (checkedCards[i]['state'] === true) {
                    cardSelections.push(checkedCards[i]['num']);
                }
            }

            for (let i = 0; i < outArr.length; ++i) {
                let splArr = [];
                
                if (outArr[i][0]['dim'] === '') {
                    splArr = [];
                }
                else {
                    splArr = outArr[i][0]['dim'].split(', ');
                }
                
                if (cardSelections.includes(splArr.length)) {
                    for (let j = 0; j < outArr[i].length; ++j) {
                        if (i+1 < outArr.length || j+1 < outArr[i].length) {
                            outStrArr.push('(' + outArr[i][j]['dim'] + '),\n');
                        }
                        else {
                            outStrArr.push('(' + outArr[i][j]['dim'] + ')');
                        }
                    }
                }
            }

            outStrArr[outStrArr.length-1] = outStrArr[outStrArr.length-1].replace(',\n', '');
            setOutput(outStrArr.join(''));
        }
        else {
            setOutput('Error: Input must contain more than one dimension and be delimited by spaces, newlines, commas, or some combination.');
        }
    }

    const generateCardinalityList = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\n/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();
        const parsedInputList = parsedInput.split(' ');
        let tmp = null;

        if (parsedInput.length === 0) {
            tmp = [];
        }
        else {
            const cardCheckList = [...cardinalityCheckList];
            tmp = [];

            for (let i = 0; i <= parsedInputList.length; ++i) {
                if (i < cardCheckList.length)
                    tmp.push({ 'num': i, 'state': cardCheckList[i]['state'] });
                else 
                    tmp.push({ 'num': i, 'state': true });
            }
        }

        const dimChecks = [...dimensionCheckList];
        let numChecked = 0;

        for (let i = 0; i < dimChecks.length; ++i) {
            if (dimChecks[i]['state'] === true) {
                ++numChecked;
            }
        }

        if (numChecked > 1) {
            tmp.splice(1, numChecked-1);
        }

        setCardinalityChecklist(tmp);
    }

    const generateDimensionList = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\n/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();
        const parsedInputList = parsedInput.split(' ');
        let tmp = [];

        if (parsedInput.length === 0) {
            tmp = [];
        }
        else if (parsedInputList.length === dimensionCheckList.length) {
            tmp = [...dimensionCheckList];
            
            for (let i = 0; i < parsedInputList.length; ++i) {
                if (parsedInputList[i] !== tmp[i]['dim']) {
                    tmp[i]['dim'] = parsedInputList[i];
                }
            }
        }
        else {
            tmp = [];

            for (let i = 0; i < parsedInputList.length; ++i) {
                tmp.push({'dim': parsedInputList[i], 'state': false})
            }
        }

        setDimensionChecklist(tmp);
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
        generateCardinalityList(input);
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
        <div className='flexContainerRow'>
            <div className='flexContainerColInput'>
                <div className='subSubTitle'>Grouping Dimensions</div>
                <textarea
                    className='inputBox'
                    spellCheck='false'
                    placeholder='Enter dimensions here...'
                    value={input}
                    onChange={e => textInputHandler(e.target.value)}
                />
            </div>
            <div className='flexContainerColCard'>
                <div className='subSubTitle'>Dimensions Required in Every Set</div>
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
            <div className='flexContainerColDim'>
                <div className='subSubTitle'>Grouping Set Cardinality Filter</div>
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
            </div>
        </div>
        <div className='flexContainerRow'>
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
        <div className='flexContainerRow'>
            <p className='output'>{output === '' ? null : output}</p>
        </div>
        </>
    )
}
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ComboApp />);
