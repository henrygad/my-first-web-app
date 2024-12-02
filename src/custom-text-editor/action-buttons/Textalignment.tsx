import { alignTextCmd } from "../cmds";
import { FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify } from "react-icons/fi";

type Props = {
    onInputAreaChange: () => void
};

const Textalignment = ({ onInputAreaChange }: Props) => {
    const hanldeTextAlignment = (value: string[]) => {
        alignTextCmd(value)
        onInputAreaChange();
    };

    return <div id='text-alignment' className='flex flex-wrap items-center gap-3'>
        <button className="cursor-pointer" onClick={() => hanldeTextAlignment(['block', 'text-left'])}>
            <FiAlignLeft size={18}/>
        </button>
        <button className="cursor-pointer" onClick={() => hanldeTextAlignment(['block', 'text-center'])}>
            <FiAlignCenter size={18} />
        </button>
        <button className="cursor-pointer" onClick={() => hanldeTextAlignment(['block', 'text-right'])}>
            <FiAlignRight size={18} />
        </button>
        <button className="cursor-pointer" onClick={() => hanldeTextAlignment(['flex'])}>
            <FiAlignJustify size={18} />
        </button>
    </div>
};

export default Textalignment;
