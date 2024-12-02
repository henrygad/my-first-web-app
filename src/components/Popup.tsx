import tw from "tailwind-styled-components";
import Button from "./Button";
import React from "react";

type Props = {
    id: string
    title:string | React.ReactElement
    Children: React.ReactElement
    togglePopUp: boolean
    setTogglePopUp: React.Dispatch<React.SetStateAction<boolean>>
};


const Popup = ({id, title, togglePopUp, Children, setTogglePopUp}: Props) => {


  return <Addimagepopup id={id} className={`${togglePopUp ? 'flex' : 'hidden'} `} style={{margin: 0}}>
  <Popcontentwrapper>
      <span className="block text-base text-center">
       {title}
    </span>
      {Children}
      <div className=" flex justify-end items-center">
          <Button
              id="close-popup"
              buttonClass="text-white bg-red-800 px-2 py-1 rounded-md shadow"
              children="Close"
              handleClick={()=> setTogglePopUp(false)}
          />
      </div>
  </Popcontentwrapper>
</Addimagepopup>
};

export default Popup;

const Addimagepopup = tw.div`
    justify-center
    items-center
    fixed 
    top-0 
    bottom-0 
    right-0 
    left-0 
    backdrop-blur-sm
    z-50
`
const Popcontentwrapper = tw.div`
    min-w-[280px]
    sm:min-w-[380px]
    max-w-[480px] 
    bg-white
    dark:bg-stone-800 
    dark:text-white
    p-4
    border-2 
    shadow-xl
    rounded-xl
    space-y-4
    -mt-40
`
