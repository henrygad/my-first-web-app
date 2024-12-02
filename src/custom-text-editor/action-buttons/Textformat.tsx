import { useState } from "react";
import { textFormatCmd } from "../cmds";
import Dropdownmenuwrapper from "../assests/Dropdownmenuwrapper";
import { CgColorBucket, CgColorPicker} from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";

type Props = {
    arrOfFontColors: string[]
    arrOfBgColors: string[]
    arrOfHeadings: { name: string, value: string[] }[]
    arrOfFontSizes: { name: string, value: string[] }[]
    arrOfFontFamily: { name: string, value: string[] }[]
    onInputAreaChange: () => void
    openDropDownMenu: string
    setOpenDropDownMenu: React.Dispatch<React.SetStateAction<string>>
};

const Textformat = ({
    arrOfFontColors,
    arrOfBgColors,
    arrOfHeadings,
    arrOfFontSizes,
    arrOfFontFamily,
    onInputAreaChange,
    openDropDownMenu,
    setOpenDropDownMenu,
}: Props) => {
    const [currentFontFamily, setCurrentFontFamily] = useState(arrOfFontFamily?.[0].name);
    const [currentHeadings, setCurrentHeading] = useState(arrOfHeadings?.[0].name);
    const [currentFontSizes, setCurrentFontSize] = useState(arrOfFontSizes?.[2].name);

    const handleTextFormat = (cmd: string, value?: string[]) => {
        textFormatCmd(cmd, value ? value : []);
        onInputAreaChange();
        setOpenDropDownMenu('')
    };

    return <div id='inlineStyling' className="flex flex-wrap items-center gap-3">
        <div id="text-normal">
            <button className="" onClick={() => handleTextFormat('normal', ['inline-block', 'font-normal', 'no-underline', 'not-italic'])} >
                Normal
            </button>
        </div>
        <div id="text-fontfamily">
            <button className='flex items-center justify-between gap-1 cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'fontfamily' ? '' :'fontfamily') }}>
                {currentFontFamily} <IoIosArrowDown scale={10}/>
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName={'fontfamily'}
                Children={<div className="w-full min-w-[100px] p-2 space-y-2 border shadow-sm" >
                    {
                        arrOfFontFamily &&
                            arrOfFontFamily.length ?
                            arrOfFontFamily.map(item =>
                                <button
                                    className="block"
                                    key={item.name}
                                    onClick={() => { handleTextFormat('fontfamily', item.value); setCurrentFontFamily(item.name) }} >
                                    {item.name}
                                </button>
                            ) :
                            null
                    }
                </div>}
            />
        </div>
        <div id="text-headers">
            <button className='flex items-center justify-between gap-1 cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'headings' ? '' :'headings') }}>
                {currentHeadings} <IoIosArrowDown scale={10}/>
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName={'headings'}
                Children={<div className="w-full min-w-[100px] p-2 space-y-2 border shadow-sm" >
                    {
                        arrOfHeadings &&
                            arrOfHeadings.length ?
                            arrOfHeadings.map(item =>
                                <button
                                    className="block"
                                    key={item.name}
                                    onClick={() => { handleTextFormat('heading', item.value); setCurrentHeading(item.name) }} >
                                    {item.name}
                                </button>
                            ) :
                            null
                    }
                </div>}
            />
        </div>
        <div id="text-fontsize">
            <button className='flex items-center justify-between gap-1 cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'fontsize' ? '' :'fontsize') }}>
                {currentFontSizes}px <IoIosArrowDown scale={10}/>
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName={'fontsize'}
                Children={<div className="w-full min-w-[60px] p-2 space-y-2 border shadow-sm" >
                    {
                        arrOfFontSizes &&
                            arrOfFontSizes.length ?
                            arrOfFontSizes.map(item =>
                                <button
                                    className="block"
                                    key={item.name}
                                    onClick={() => { handleTextFormat('fontsize', item.value); setCurrentFontSize(item.name) }} >
                                    {item.name}
                                </button>
                            ) :
                            null
                    }
                </div>}
            />
        </div>
        <div id="text-bold">
            <button className="text-base" onClick={() => handleTextFormat('font-bold')}><b>B</b></button>
        </div>
        <div id="text-italic" >
            <button className="text-base" onClick={() => handleTextFormat('italic')}><i>I</i></button>
        </div>
        <div id="text-underline" >
            <button className="text-base" onClick={() => handleTextFormat('underline')}><u>U</u></button>
        </div>
        <div id="text-transform">
            <button className='flex items-center justify-between gap-1 text-base capitalize cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'texttransform' ? '' :'texttransform') }}>
                Aa <IoIosArrowDown scale={10}/>
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName={'texttransform'}
                Children={
                    <div className="w-full min-w-[100px] p-2 space-y-2 border shadow-sm">
                        <button id="text-lowercase" onClick={() => handleTextFormat('lowercase')}>lowerCase</button>
                        <button id="text-capitalize" onClick={() => handleTextFormat('capitalize')}>capitalize</button>
                        <button id="text-uppercase" onClick={() => handleTextFormat('uppercase')}>upCase</button>
                        <button id="normal" onClick={() => handleTextFormat('normal-case')}>normal</button>
                    </div>
                }
            />
        </div>
        <div id="text-fontcolor">
            <button className='block cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'fontcolor' ? '' :'fontcolor') }}>
                <CgColorPicker  size={18} />
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName={'fontcolor'}
                Children={<div className="grid grid-cols-3 gap-2 min-w-[160px] p-2 border shadow-sm" >
                    {arrOfFontColors &&
                        arrOfFontColors.length ?
                        arrOfFontColors.map(item =>
                            <button
                                key={item}
                                className={`block h-[40px] w-[40px] ${item.split('-').map(item => item === 'text' ? 'bg' : item).join('-')} shadow-md`}
                                onClick={() => handleTextFormat('fontcolor', [item])}></button>
                        ) :
                        null
                    }
                </div>}
            />
        </div>
        <div id="text-backgroundcolor" >
            <button className='block cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'bgcolor' ? '' :'bgcolor') }}>
               <CgColorBucket  size={18} />
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName='bgcolor'
                Children={<div className="grid grid-cols-3 gap-2 min-w-[160px] p-2 border shadow-sm" >
                    {arrOfBgColors &&
                        arrOfBgColors.length ?
                        arrOfBgColors.map(item =>
                            <button
                                key={item}
                                className={`block h-[40px] w-[40px] ${item} shadow-md`}
                                onClick={() => handleTextFormat('bgcolor', [item, 'rounded', 'p-.5'])}></button>
                        ) :
                        null
                    }
                </div>}
            />
        </div>
    </div>
};

export default Textformat;
