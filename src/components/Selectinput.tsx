import { useRef, useState } from 'react'
import { useClickOutSide } from '../hooks';
import tw from 'tailwind-styled-components';

type Props = {
    id: string
    labelName: string
    parentClass: string
    listWrapperClass: string
    placeHolderClass?: string,
    placeHolder?: string
    arrOfList: (string)[]
    selectedValue: string
    setSeletedValue: (value: string) => void
};

const Selectinput = ({
    id = 'selection',
    labelName,
    placeHolder = 'select',
    placeHolderClass = '',
    parentClass,
    listWrapperClass,
    arrOfList = [],
    selectedValue,
    setSeletedValue,
}: Props) => {
    const [openDropDownMenu, setOpenDropDownMenu] = useState(false);
    const selectWrapperRef = useRef(null);
    useClickOutSide(selectWrapperRef, () => setOpenDropDownMenu(false));

    return <label
        ref={selectWrapperRef}
        htmlFor={id}
        className={`block relative ${parentClass}`}>
        {labelName}
        <span className={`block first-letter:capitalize ${placeHolderClass} border rounded-md cursor-pointer`}
            onClick={() => setOpenDropDownMenu(!openDropDownMenu)}>
            {selectedValue || placeHolder}
        </span>
        <ListstWrapper id={id} className={`${openDropDownMenu ? 'block max-h-[480px] overflow-y-auto' : 'hidden'} ${listWrapperClass}`}>
            {arrOfList &&
                arrOfList.length &&
                arrOfList.map((item, index) =>
                    <ListOfValue
                        id={item}
                        key={item}
                        className={selectedValue?.trim().toLocaleLowerCase() === item?.trim().toLocaleLowerCase() ? 'bg-green-400' : ''}
                        onClick={() => { setSeletedValue(item); setOpenDropDownMenu(false) }}>
                        {item}
                    </ListOfValue>
                )
            }
        </ListstWrapper>
    </label>
};

export default Selectinput;

const ListstWrapper = tw.div`
absolute 
bottom-[140%] 
translate-y-1/2 
w-full 
rounded-md 
bg-white
dark:bg-stone-800 
dark:text-white
border-2
shadow-xl
p-2  
space-y-2
z-50
`

const ListOfValue = tw.span`
block 
w-full 
first-letter:capitalize
hover:bg-green-200 
transition-colors
p-1 
rounded-md
cursor-pointer
`