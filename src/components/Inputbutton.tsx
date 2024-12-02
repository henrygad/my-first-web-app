
type Props = {
    id?: string
    children: string
    buttonClass: string
    handleClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void

};

const Inputbutton = ({ children, buttonClass, id = '', handleClick = (e) => null }: Props) => {

    return <input
         id={id}
        type='button'
        className={` ${buttonClass} text-[0.92rem] md:text-base cursor-pointer`}
        onClick={handleClick}
        value={children}
    />
};

export default Inputbutton;
