import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

// TODO
// 2. Copy text button/functionality

function ComboApp() {
    const [cardinalityCheckList, setCardinalityChecklist] = useState([]);
    const [dimensionCheckList, setDimensionChecklist] = useState([]);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [showGroupingTool, setShowGroupingTool] = useState(true);
    const [filterIndex, setFilterIndex] = useState(0);
    const [formatFunction, setFormatFunction] = useState('0');
    const [dimComboInput, setDimComboInput] = useState('');
    
    const generateCombinations = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\s/g, ' ');
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
            const dimensionCombos = dimComboInput;
            const dimComboRegex = /((?:[(][^)]+[)])(?:,\s|\s|$)){1,}/g; 

            if ((dimensionCombos.trim() !== '' && dimensionCombos.match(dimComboRegex)) || dimensionCombos.trim() === '') {
                const formattedDimCombos = [];

                if (dimensionCombos.trim() !== '') {
                    let parsedDimCombos = dimensionCombos.replace(/,|\s/g, ' ');
                    parsedDimCombos = parsedDimCombos.replace(/ {2,}/g, ' ');
                    parsedDimCombos = parsedDimCombos.replace(/[(]/g, '');
                    parsedDimCombos = parsedDimCombos.trim();
                    let splitDimCombos = parsedDimCombos.split(') ');

                    for (let i = 0; i < splitDimCombos.length; ++i) {
                        splitDimCombos[i] = splitDimCombos[i].replace(/[)]/g, '')
                        formattedDimCombos.push(splitDimCombos[i].split(' '));
                    }
                }

                for (let i = 0; i < checkedCards.length; ++i) {
                    if (checkedCards[i]['state'] === true) {
                        cardSelections.push(checkedCards[i]['num']);
                    }
                }
    
                for (let i = 0; i < outArr.length; ++i) {
                    let splArr = [];
                    
                    if (outArr[i][0]['dim'] !== '') {
                        splArr = outArr[i][0]['dim'].split(', ');
                    }
                    
                    if (cardSelections.includes(splArr.length)) {
                        for (let j = 0; j < outArr[i].length; ++j) {
                            let comboFilterCount = 0;

                            for (const filterCombo of formattedDimCombos) {
                                let dimFilterCount = 0;

                                for (const filterDim of filterCombo) {
                                    if (outArr[i][j]['dim'].includes(filterDim)) {
                                        ++dimFilterCount;
                                    }
                                }

                                if (dimFilterCount === 0 || dimFilterCount === filterCombo.length) {
                                    ++comboFilterCount;
                                }
                            }

                            if (comboFilterCount === formattedDimCombos.length) {
                                if (i+1 < outArr.length || j+1 < outArr[i].length) {
                                    outStrArr.push('(' + outArr[i][j]['dim'] + '),\n');   
                                }
                                else {
                                    outStrArr.push('(' + outArr[i][j]['dim'] + ')');
                                } 
                            }
                        }
                    }
                }
    
                outStrArr[outStrArr.length-1] = outStrArr[outStrArr.length-1].replace(',\n', '');
                setOutput(outStrArr.join(''));
            }
            else {
                setOutput('Error: Dimension combination filtering input (must), (be, entered), (like, grouping, sets) and can be delimited by spaces, newlines, commas, or some combination.');
            }
        }
        else {
            setOutput('Error: Input must contain more than one dimension and be delimited by spaces, newlines, commas, or some combination.');
        }
    }

    const generateCardinalityList = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\s/g, ' ');
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
        let parsedInput = inputStr.replace(/,|\s/g, ' ');
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

    const textInputHandlerDimCombos = (inputStr) => {
        setDimComboInput(inputStr);
    }

    const textInputHandlerMain = (inputStr) => {
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
        setDimComboInput('');
    }
    
    const formatDimensions = (formatFunction, inputStr) => {
        switch (formatFunction) {
            case '0':
                setInput(singleQuotes(inputStr));
                break;
            case '1':
                setInput(doubleQuotes(inputStr));
                break;
            case '2':
                setInput(removeQuotes(inputStr));
                break;
            case '3':
                setInput(upperCase(inputStr));
                break;
            case '4':
                setInput(lowerCase(inputStr));
                break;
            case '5':
                setInput(commaDelimiter(inputStr));
                break;
            case '6':
                setInput(commaAndNewLineDelimiter(inputStr));
                break;
            case '7':
                setInput(spaceDelimiter(inputStr));
                break;
            case '8':
                setInput(newLineDelimiter(inputStr));
                break;
            default:
                break;
        }
    }
 
    const singleQuotes = (inputStr) => {
        const newLineCount = inputStr.split('\n').length - 1;
        const spaceCount = inputStr.split(' ').length - 1;
        const commaCount = inputStr.split(',').length - 1;

        let parsedInput = inputStr.replace(/,|\s/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        let splitDimArr = parsedInput.split(' ');
        const dimNum = splitDimArr.length;

        for (let i = 0; i < dimNum; ++i) {
            splitDimArr[i] = "'" + splitDimArr[i] + "'";
        }

        if (newLineCount >= dimNum-2 && commaCount >= dimNum-2) {
            return splitDimArr.join(',\n');
        }
        else if (commaCount >= dimNum-2) {
            return splitDimArr.join(', ');
        }
        else if (newLineCount >= dimNum-2) {
            return splitDimArr.join('\n');
        }
        else if (spaceCount >= dimNum-2) {
            return splitDimArr.join(' ');
        }
        else {
            return splitDimArr.join('\n');
        }
    }

    const doubleQuotes = (inputStr) => {
        const newLineCount = inputStr.split('\n').length - 1;
        const spaceCount = inputStr.split(' ').length - 1;
        const commaCount = inputStr.split(',').length - 1;

        let parsedInput = inputStr.replace(/,|\s/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        let splitDimArr = parsedInput.split(' ');
        const dimNum = splitDimArr.length;

        for (let i = 0; i < dimNum; ++i) {
            splitDimArr[i] = '"' + splitDimArr[i] + '"';
        }

        if (newLineCount >= dimNum-2 && commaCount >= dimNum-2) {
            return splitDimArr.join(',\n');
        }
        else if (commaCount >= dimNum-2) {
            return splitDimArr.join(', ');
        }
        else if (newLineCount >= dimNum-2) {
            return splitDimArr.join('\n');
        }
        else if (spaceCount >= dimNum-2) {
            return splitDimArr.join(' ');
        }
        else {
            return splitDimArr.join('\n');
        }
    }

    const removeQuotes = (inputStr) => {
        const newLineCount = inputStr.split('\n').length - 1;
        const spaceCount = inputStr.split(' ').length - 1;
        const commaCount = inputStr.split(',').length - 1;

        let parsedInput = inputStr.replace(/,|\s/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        let splitDimArr = parsedInput.split(' ');
        const dimNum = splitDimArr.length;
        let firstChar = '';
        let lastChar = '';

        for (let i = 0; i < dimNum; ++i) {
            firstChar = splitDimArr[i].charAt(0);
            lastChar = splitDimArr[i].charAt(splitDimArr[i].length-1);
            
            if (firstChar === "'" || firstChar === '"' || lastChar === "'" || lastChar === '"') {
                splitDimArr[i] = splitDimArr[i].slice(1, splitDimArr[i].length-1);
            }
        }

        if (newLineCount >= dimNum-2 && commaCount >= dimNum-2) {
            return splitDimArr.join(',\n');
        }
        else if (commaCount >= dimNum-2) {
            return splitDimArr.join(', ');
        }
        else if (newLineCount >= dimNum-2) {
            return splitDimArr.join('\n');
        }
        else if (spaceCount >= dimNum-2) {
            return splitDimArr.join(' ');
        }
        else {
            return splitDimArr.join('\n');
        }
    }

    const upperCase = (inputStr) => {
        const newLineCount = inputStr.split('\n').length - 1;
        const spaceCount = inputStr.split(' ').length - 1;
        const commaCount = inputStr.split(',').length - 1;

        let parsedInput = inputStr.replace(/,|\s/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        let splitDimArr = parsedInput.split(' ');
        const dimNum = splitDimArr.length;

        for (let i = 0; i < dimNum; ++i) {
            splitDimArr[i] = splitDimArr[i].toUpperCase();
        }

        if (newLineCount >= dimNum-2 && commaCount >= dimNum-2) {
            return splitDimArr.join(',\n');
        }
        else if (commaCount >= dimNum-2) {
            return splitDimArr.join(', ');
        }
        else if (newLineCount >= dimNum-2) {
            return splitDimArr.join('\n');
        }
        else if (spaceCount >= dimNum-2) {
            return splitDimArr.join(' ');
        }
        else {
            return splitDimArr.join('\n');
        }
    }

    const lowerCase = (inputStr) => {
        const newLineCount = inputStr.split('\n').length - 1;
        const spaceCount = inputStr.split(' ').length - 1;
        const commaCount = inputStr.split(',').length - 1;

        let parsedInput = inputStr.replace(/,|\s/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        let splitDimArr = parsedInput.split(' ');
        const dimNum = splitDimArr.length;

        for (let i = 0; i < splitDimArr.length; ++i) {
            splitDimArr[i] = splitDimArr[i].toLowerCase();
        }

        if (newLineCount >= dimNum-2 && commaCount >= dimNum-2) {
            return splitDimArr.join(',\n');
        }
        else if (commaCount >= dimNum-2) {
            return splitDimArr.join(', ');
        }
        else if (newLineCount >= dimNum-2) {
            return splitDimArr.join('\n');
        }
        else if (spaceCount >= dimNum-2) {
            return splitDimArr.join(' ');
        }
        else {
            return splitDimArr.join('\n');
        }
    }

    const commaDelimiter = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\s/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        let splitDimArr = parsedInput.split(' ');

        return splitDimArr.join(', ');
    }

    const commaAndNewLineDelimiter = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\s/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        let splitDimArr = parsedInput.split(' ');

        return splitDimArr.join(',\n');
    }

    const spaceDelimiter = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\s/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        let splitDimArr = parsedInput.split(' ');

        return splitDimArr.join(' ');
    }

    const newLineDelimiter = (inputStr) => {
        let parsedInput = inputStr.replace(/,|\s/g, ' ');
        parsedInput = parsedInput.replace(/ {2,}/g, ' ');
        parsedInput = parsedInput.trim();

        let splitDimArr = parsedInput.split(' ');

        return splitDimArr.join('\n');
    }

    const dimensionFilterArea = (ndx) => {
        switch(ndx) {
            case 0:
                return (
                    <div className='flexContainerColCard'>
                        <div className='subSubTitle'>Must Contain Dim. Combo Filter</div>
                        <textarea
                            className='inputBoxDimCombos'
                            spellCheck='false'
                            placeholder={'(enter, required),\n(dimension, combinations),\n(like, grouping, sets),\n(tHiS, fEaTuRe, Is, CaSe, SeNsItIvE)'}
                            value={dimComboInput}
                            onChange={e => textInputHandlerDimCombos(e.target.value)}
                            onKeyDown={e => {
                                    if (e.key === 'Tab') {
                                        e.preventDefault()
                                    }
                                }
                            }
                        />
                    </div>
                );
            case 1:
                return (
                    <div className='flexContainerColCard'>
                        <div className='subSubTitle'>Must Contain Filter</div>
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
                );
            case 2:
                return (
                    <div className='flexContainerColCard'>
                        <div className='subSubTitle'>Group Cardinality Filter</div>
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
                );
            default:
                break;
        }
        
    }
    
    if(showGroupingTool) {
        return (
            <>
            <div>
                <button
                    className='headerButton'
                    disabled={showGroupingTool ? true : false}
                    onClick={() => setShowGroupingTool(true)}>
                    Grouping Sets
                </button>
                <button
                    className='headerButton'
                    disabled={showGroupingTool ? false : true}
                    onClick={() => setShowGroupingTool(false)}>
                    Dimension Formatter
                </button>
                <h1 className='title'>Grouping Set Combination Generator</h1>
                <h4 className='subTitle'>Commas, spaces, newlines, or combinations of these are all accepted delimiters.</h4>
            </div>
            <div className='flexContainerRow'>
                <div className='flexContainerColInput1'>
                    <div className='subSubTitle'>Grouping Dimensions</div>
                    <textarea
                        className='inputBoxMain'
                        spellCheck='false'
                        placeholder='Enter dimensions here...'
                        value={input}
                        onChange={e => textInputHandlerMain(e.target.value)}
                        onKeyDown={e => {
                                if (e.key === 'Tab') {
                                    e.preventDefault()
                                }
                            }
                        }
                    />
                </div>
                {dimensionFilterArea(filterIndex)}
                <div className='flexContainerColCardFilterButtons1'>
                    <button
                        className='filterButton'
                        disabled={filterIndex === 0 ? true : false}
                        onClick={() => setFilterIndex(0)}>
                        Required Dim. Combos
                    </button>
                    <button
                        className='filterButton'
                        disabled={filterIndex === 1 ? true : false}
                        onClick={() => setFilterIndex(1)}>
                        Must Contain Filter
                    </button>
                    <button
                        className='filterButton'
                        disabled={filterIndex === 2 ? true : false}
                        onClick={() => setFilterIndex(2)}>
                        Group Cardinality Filter
                    </button>
                    <div className='flexContainerColCardFilterButtons2'>
                        <button
                            className='filterButton'
                            disabled={input === '' ? true : false}
                            onClick={() => generateCombinations(input)}>
                            Generate
                        </button>
                        <button
                            className='filterButton'
                            disabled={input === '' ? true : false}
                            onClick={clear}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>
            
            <div className='flexContainerRow'>
                <p className='output'>{output === '' ? null : output}</p>
            </div>
            </>
        )
    }
    else {
        return (
            <>
            <div>
                <button
                    className='headerButton'
                    disabled={showGroupingTool ? true : false}
                    onClick={() => setShowGroupingTool(true)}>
                    Grouping Sets
                </button>
                <button
                    className='headerButton'
                    disabled={showGroupingTool ? false : true}
                    onClick={() => setShowGroupingTool(false)}>
                    Dimension Formatter
                </button>
                <h1 className='title'>Dimension Formatter</h1>
                <h4 className='subTitle'>Commas, spaces, newlines, or combinations of these are all accepted delimiters.</h4>
            </div>
            <div className='flexContainerRow'>
                <div className='flexContainerColInput2'>
                    <div className='subSubTitle'>Dimensions to Format</div>
                    <textarea
                        className='inputBoxMain'
                        spellCheck='false'
                        placeholder='Enter dimensions here...'
                        value={input}
                        onChange={e => textInputHandlerMain(e.target.value)}
                        onKeyDown={e => {
                                if (e.key === 'Tab') {
                                    e.preventDefault()
                                }
                            }
                        }
                    />
                </div>
            </div>
            <div className='flexContainerRow'>
                <select
                    className='stringActionSelection'
                    id="dropdown"
                    onChange={e => setFormatFunction(e.target.value)}>
                    <option value='0'>'Single Quotes'</option>
                    <option value='1'>"Double Quotes"</option>
                    <option value='2'>Remove Quotes</option>
                    <option value='3'>UPPER</option>
                    <option value='4'>lower</option>
                    <option value='5'>Comma, Delimiter</option>
                    <option value='6'>Comma,\nand,\nNewline,\nDelimiter</option>
                    <option value='7'>Space Delimiter</option>
                    <option value='8'>Newline\nDelimiter</option>
                </select>
                <button
                    className='buttonFormat'
                    disabled={input === '' ? true : false}
                    onClick={() => formatDimensions(formatFunction, input)}>
                    Format
                </button>
                <button
                    className='buttonFormat'
                    disabled={input === '' ? true : false}
                    onClick={clear}>
                    Clear
                </button>
            </div>
            </>
        )
    }
    
}
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ComboApp />);
