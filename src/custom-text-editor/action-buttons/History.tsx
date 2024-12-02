import { FaUndo, FaRedo } from "react-icons/fa";

const History = ({ handleDisplayHistory }: { handleDisplayHistory: (direction: string) => void }) => {

    return <div id="history" className='flex flex-wrap items-center gap-4'>
        <button className="block cursor-pointer" onClick={() => handleDisplayHistory('undo')}>
            <FaUndo size={14} />
        </button>
        <button className="block cursor-pointer" onClick={() => handleDisplayHistory('redo')}>
            <FaRedo size={14} />
        </button>
    </div>
};

export default History;
