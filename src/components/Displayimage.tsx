import { useState } from 'react';
import { endPiont } from '../hooks/utilities';

type Props = {
    id: string
    imageId: string
    imageUrl?: string
    onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
    parentClass: string
    imageClass: string
    placeHolder: string
};

const Displayimage = ({
    id,
    imageId,
    imageUrl,
    parentClass,
    imageClass,
    placeHolder,
    onClick
}: Props) => {
    const [imageLoading, setImageLoading] = useState(true);

    return <div className={`relative ${parentClass}`}>
        <img
            id={id}
            src={(imageId?.trim() ? endPiont + '/api/image/' + imageId : imageUrl?.trim() ? imageUrl : ' ')}
            className={` ${imageLoading ? "border border-slate-100 bg-slate-100 animate-pulse" : ""}  ${imageClass} bg-white dark:bg-stone-800 dark:text-white `}
            style={{ width: '100%', height: '100%' }}
            onError={(e) => {
                if (e.target instanceof HTMLImageElement) {
                    setImageLoading(false);
                    e.target.src = placeHolder;
                };
            }}
            onLoadStart={(e) => {
                setImageLoading(true);
            }}
            onLoad={(e) => {
                setImageLoading(false);
            }}
            onClick={onClick}
        />
    </div>
};

export default Displayimage
