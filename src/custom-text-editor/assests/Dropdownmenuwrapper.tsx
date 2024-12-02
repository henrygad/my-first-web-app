import { ReactElement} from 'react';

type Props = {
    Children: ReactElement
    menuName: string
    openDropDownMenu: string
};

const Dropdownmenuwrapper = ({
    menuName,
    Children,
    openDropDownMenu,
}: Props) => {

    return <div className='relative w-full bg-white dark:bg-stone-800 dark:text-white'>
        <div id={menuName} className="absolute top-0 md:right-0 bg-inherit shadow-md z-50 space-y-2">
            {openDropDownMenu.toLocaleLowerCase() === menuName.toLocaleLowerCase() ?
                Children :
                null
            }
        </div>
    </div>
};
export default Dropdownmenuwrapper;