import { useClickOutSide } from '../hooks';
import Embed from './action-buttons/Embedcode';
import Emojis from './action-buttons/Emojis';
import Image from './action-buttons/Image';
import Textalignment from './action-buttons/Textalignment';
import Textanchorlink from './action-buttons/Textanchorlink';
import Textformat from './action-buttons/Textformat';
import Textlisting from './action-buttons/Textlisting';
import Video from './action-buttons/Video';
import Writecode from './action-buttons/Writecode';
import Inputarea from './Inputarea';
import { deleteAll, deleteUnacceptedHtmlTag, focusCaretOnInputArea, getCaretPosition } from './settings';
import { arrOfBgColors, arrOfEmojis, arrOfFontColors, arrOfFontFamily, arrOfFontSizes, arrOfHeadings } from './assests/data';

import { useEffect, useRef, useState } from 'react';
import History from './action-buttons/History';
import Deleteall from './action-buttons/Deleteall';
import { getSelection } from './cmds';

type Prop = {
    id?: string
    placeHolder: string
    InputWrapperClassName: string
    InputClassName: string
    textEditorWrapperClassName?: string
    createNewText: { IsNew: boolean, content?: { _html: string, text: string } }
    useTextEditors: boolean | { useInlineStyling?: boolean, useBlockStyling?: boolean, useMedia?: boolean, useDelete?: boolean, useHistory?: boolean }
    inputTextAreaFocus?: boolean
    setGetContent: ({ _html, text }: { _html: string, text: string }) => void
};

const App = ({
    id = 'text-editor',
    placeHolder,
    InputWrapperClassName,
    InputClassName,
    textEditorWrapperClassName,
    createNewText,
    useTextEditors = false || { useInlineStyling: false, useBlockStyling: false, useMedia: false, useDelete: false, useHistory: false },
    inputTextAreaFocus = false,
    setGetContent = () => null
}: Prop) => {

    const createNewTextRef = useRef<{ IsNew: boolean, content?: { _html: string, text: string } }>(createNewText);
    const [displayPlaceHolder, setDisplayPlaceHolder] = useState(false);
    const [inputAreaIsEmpty, setInputAreaIsEmpty] = useState(false);
    const inputAreaRef = useRef<HTMLDivElement | null>(null);
    const historyRef = useRef<string[]>([]);
    const historyMomoryIndexRef = useRef(0);
    const caretPostionsRef = useRef<number[]>([]);
    const typingTimeOutRef = useRef<number>();
    const textEdictorRef = useRef(null);
    const [openDropDownMenu, setOpenDropDownMenu] = useState('');
    useTextEditors && useClickOutSide(textEdictorRef, () => { setOpenDropDownMenu('') });


    const setCaretPosition = (position: number) => {
        const selection = window.getSelection();
        const range = document.createRange();

        let charCount = 0;
        let found = false;

        (function traverseNodes(node: Node | null) { // traverse the element's child nodes to find the text node and set the caret position end of the node
            if (found || !node || !node.textContent) return;

            if (node.nodeType === Node.TEXT_NODE) {
                const nextCharCount = charCount + node.textContent?.length;
                if (position <= nextCharCount) {
                    range.setStart(node, position - charCount);
                    range.collapse(true);
                    found = true;
                }
                charCount = nextCharCount;
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    traverseNodes(node.childNodes[i]);
                };
            }
        })(inputAreaRef.current);

        if (found) {
            selection?.removeAllRanges();
            selection?.addRange(range);
        };
    };

    const handleCreateHistory = () => {
        const parentSpan = inputAreaRef.current?.firstElementChild;
        if (!parentSpan) return;

        clearTimeout(typingTimeOutRef.current);
        typingTimeOutRef.current = setTimeout(() => {
            historyRef.current.push(parentSpan.innerHTML);
            historyMomoryIndexRef.current = historyRef.current.length - 1;
            if (!inputAreaRef.current) return;
            caretPostionsRef.current.push(getCaretPosition(inputAreaRef.current));
        }, 400);
    };

    const handleDisplayHistory = (direction: string) => {
        const parentSpan = inputAreaRef.current?.firstElementChild;
        if (!parentSpan) return;

        if (direction === 'undo') {
            if (historyMomoryIndexRef.current <= 0) return;
            historyMomoryIndexRef.current -= 1;
            parentSpan.innerHTML = historyRef.current[historyMomoryIndexRef.current];
            setCaretPosition(caretPostionsRef.current[historyMomoryIndexRef.current]);
        } else {
            if (historyMomoryIndexRef.current >= historyRef.current.length - 1) return;
            historyMomoryIndexRef.current += 1;
            parentSpan.innerHTML = historyRef.current[historyMomoryIndexRef.current];
            setCaretPosition(caretPostionsRef.current[historyMomoryIndexRef.current]);
        };
    };

    const handleDisplayInputPlaceHolder = () => {
        const parentSpan = inputAreaRef.current?.firstElementChild;
        const childSpan = parentSpan?.firstElementChild;
        const editables = childSpan?.children;
        if (!editables) return;

        for (const element of editables) {
            const htlmIsAvailable = element.innerHTML.replace("<br>", "").trim() !== "";

            if (htlmIsAvailable) {
                setDisplayPlaceHolder(false);
                return;
            };
            setDisplayPlaceHolder(true);
        };
    };

    const handleWhenInputAreaIsEmpty = () => {
        const selectedNode = getSelection(); // get the selected node properties

        if (selectedNode) {
            const { node } = selectedNode;
            const parentSpan = inputAreaRef.current?.firstElementChild;
            const childSpan = parentSpan?.firstElementChild;
            const initialEditableSpan = childSpan?.firstElementChild;
            if (!initialEditableSpan) return;

            const initialEditableSpanCaretStartOffset = getCaretPosition(initialEditableSpan);

            if ((node === initialEditableSpan || initialEditableSpan.contains(node)) &&
                initialEditableSpanCaretStartOffset <= 0 &&
                initialEditableSpan.innerHTML.replace("<br>", "") === ""
            ) {
                setInputAreaIsEmpty(true);
            } else {
                setInputAreaIsEmpty(false);
            };
        };
    };

    const onInputAreaChange = () => {
        if (inputAreaRef.current?.textContent?.trim()) {
            deleteUnacceptedHtmlTag();
        };
        setOpenDropDownMenu('');
        handleCreateHistory();
        handleDisplayInputPlaceHolder();
        handleWhenInputAreaIsEmpty();

        const parentSpan = inputAreaRef.current?.firstElementChild;
        setGetContent({ // get html and text inputs
            _html: parentSpan?.innerHTML || '',
            text: parentSpan?.textContent || ''
        });
    };

    useEffect(() => {
        if (inputTextAreaFocus) focusCaretOnInputArea(inputAreaRef.current);
        handleCreateHistory();
        handleDisplayInputPlaceHolder();
        handleWhenInputAreaIsEmpty();
    }, []);

    return <div
        id={id}
        ref={textEdictorRef}
        className='w-full max-w-full'>
        {useTextEditors ?
            <div id='text-editor-action-btn-wrapper' 
            className={`flex flex-wrap items-center w-full max-w-full bg-white dark:bg-stone-800 dark:text-white gap-3 ${textEditorWrapperClassName}`}>
                { (typeof useTextEditors === "object" &&
                    useTextEditors.useInlineStyling)  || useTextEditors === true? <Textformat
                    arrOfFontColors={arrOfFontColors}
                    arrOfBgColors={arrOfBgColors}
                    arrOfHeadings={arrOfHeadings}
                    arrOfFontSizes={arrOfFontSizes}
                    arrOfFontFamily={arrOfFontFamily}
                    onInputAreaChange={onInputAreaChange}
                    openDropDownMenu={openDropDownMenu}
                    setOpenDropDownMenu={setOpenDropDownMenu}
                /> :
                    null}
                {(typeof useTextEditors === "object" &&
                    useTextEditors.useBlockStyling) || useTextEditors === true ? <>
                    <Textalignment
                        onInputAreaChange={onInputAreaChange}
                    />
                    <Textlisting
                        onInputAreaChange={onInputAreaChange}
                    />
                    <Writecode
                        onInputAreaChange={onInputAreaChange}
                    />
                    <Embed
                        onInputAreaChange={onInputAreaChange}
                        openDropDownMenu={openDropDownMenu}
                        setOpenDropDownMenu={setOpenDropDownMenu}
                    />
                </> :
                    null}
                {(typeof useTextEditors === "object" &&
                    useTextEditors.useMedia) || useTextEditors === true ? <>
                    <Textanchorlink
                        onInputAreaChange={onInputAreaChange}
                        openDropDownMenu={openDropDownMenu}
                        setOpenDropDownMenu={setOpenDropDownMenu}
                    />
                    <Emojis
                        arrOfEmojis={arrOfEmojis}
                        onInputAreaChange={onInputAreaChange}
                        openDropDownMenu={openDropDownMenu}
                        setOpenDropDownMenu={setOpenDropDownMenu}
                    />

                    <Image
                        onInputAreaChange={onInputAreaChange}
                        openDropDownMenu={openDropDownMenu}
                        setOpenDropDownMenu={setOpenDropDownMenu}
                    />
                    <Video
                        onInputAreaChange={onInputAreaChange}
                        openDropDownMenu={openDropDownMenu}
                        setOpenDropDownMenu={setOpenDropDownMenu}
                    />
                </> :
                    null}
                {(typeof useTextEditors === "object" &&
                    useTextEditors.useDelete) || useTextEditors === true ? <Deleteall handleDeleteAlll={() => { deleteAll(inputAreaRef.current); onInputAreaChange() }} /> :
                    null}
                {(typeof useTextEditors === "object" &&
                    useTextEditors.useHistory) || useTextEditors === true ? <History
                    handleDisplayHistory={handleDisplayHistory}
                /> :
                    null}
            </div> :
            null
        }
        <Inputarea
            displayPlaceHolder={displayPlaceHolder}
            inputAreaIsEmpty={inputAreaIsEmpty}
            placeHolder={placeHolder}
            InputWrapperClassName={InputWrapperClassName}
            InputClassName={InputClassName}
            createNewText={createNewTextRef.current}
            inputAreaRef={inputAreaRef}
            onInputAreaChange={onInputAreaChange}
            handleDisplayHistory={handleDisplayHistory}
        />
    </div>
};

export default App;