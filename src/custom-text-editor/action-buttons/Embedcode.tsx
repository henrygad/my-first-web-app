import { useState } from "react";
import Dropdownmenuwrapper from "../assests/Dropdownmenuwrapper";
import { embedCmd } from "../cmds";

type Props = {
    openDropDownMenu: string
    setOpenDropDownMenu: React.Dispatch<React.SetStateAction<string>>
    onInputAreaChange: () => void
};

const Embed = ({
    onInputAreaChange,
    openDropDownMenu,
    setOpenDropDownMenu,
}: Props) => {
    const [embed, setEmbed] = useState('');

    const handleEmbedExternal = (embed: string, value: string[]) => {
        if (!embed) return;
        embedCmd(embed, value || [])
        onInputAreaChange();
        setOpenDropDownMenu('');
    };

    return <div id='embedCode' >
        <button className='text-base cursor-pointer' onClick={() => setOpenDropDownMenu('embed')}>
            {"</>"}
        </button>
        <Dropdownmenuwrapper
            openDropDownMenu={openDropDownMenu}
            menuName='embed'
            Children={
                <div className='space-y-5 p-3 border shadow-sm'>
                    <div>
                        <textarea
                            className='text-sm min-h-[180px] min-w-[180px] bg-inherit mt-1 p-1 border border-gren-500 outline-none rounded'
                            placeholder='embed...'
                            id='embedCode'
                            name='embedCode'
                            value={embed}
                            onChange={(e) => setEmbed(e.target.value)}
                        />
                    </div>
                    <div className='flex justify-end items-center gap-3 '>
                        <button className='px-2 py-[.2rem] bg-red-800 text-white rounded ' onClick={() => setOpenDropDownMenu('')}>Close</button>
                        <button className='px-2 py-[.2rem] bg-green-800 text-white rounded ' onClick={() => handleEmbedExternal(embed, ['inline'])} >Embed</button>
                    </div>
                </div>
            } />

    </div>
};

export default Embed;
