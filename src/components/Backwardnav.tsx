import { useNavigate } from 'react-router-dom';
import Button from './Button'
import { IoMdArrowRoundBack } from 'react-icons/io'

const Backwardnav = ({ to = '', pageName }: { to?: string , pageName: string,  }) => {
    const navigate = useNavigate();

    const handleNavigateBack = () => {
        if (to.trim()) {
            navigate(to);
        } else {
            navigate(-1);
        };
    };

    return <div className="flex items-start gap-4 mb-4">
        <Button
            id="Backward-navigation-brn"
            buttonClass='flex gap-4'
            children={<IoMdArrowRoundBack size={20} />}
            handleClick={handleNavigateBack} />
        <span className="text-xl font-text capitalize underline">
            {pageName}
        </span>
    </div>
}

export default Backwardnav;
