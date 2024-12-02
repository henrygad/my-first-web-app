import { ReactElement, useEffect, useRef, useState } from 'react'
import tw from 'tailwind-styled-components'

type Props = {
  id: string
  parentClassName: string
  Child1: ReactElement
  Child2: ReactElement

};

const Twoscreenpanels = ({ id, parentClassName, Child1, Child2 }: Props) => {
  const [reSizeForChild1, setReSizeForChild1] = useState(10);
  const [reSizeForChild2, setReSizeForChild2] = useState(90);
  const drageleRef = useRef<HTMLDivElement | null>(null);

  const [isSizing, setIsSizing] = useState(false)

  const handleMouseMove = (e: MouseEvent) => {
    const movementX = e.movementX
    //const movementY = e.movementY
    if (drageleRef.current && drageleRef.current.contains(e.target as Node)) {
      if (movementX < 0) { // moving left
        setReSizeForChild1(pre=> pre -= 1);
        setReSizeForChild2(pre=> pre += 1);
      } else { // moving right
        setReSizeForChild1(pre=> pre += 1);
        setReSizeForChild2(pre=> pre -= 1);
      };

      const parentW = drageleRef.current.clientWidth
    };

  };


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    // window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      //window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);


  return <div id={id} className={`flex ${parentClassName}`}>
    <div className='' style={{
      minWidth: reSizeForChild1 + '%',
    }}>
      {Child1}
    </div>
    <Dragele ref={drageleRef} />
    <div className='' style={{
      minWidth: reSizeForChild2 + '%',
    }}>
      {Child2}
    </div>
  </div>
}

export default Twoscreenpanels

const Dragele = tw.div`
  border-4
  border-green-600
  active::border-green-400
  cursor-move
`

//    newWidth1 = Math.max(minWidth, Math.min(newWidth1, maxWidth))
