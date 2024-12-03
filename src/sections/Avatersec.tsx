import { useEffect } from "react";
import { Imageplaceholder, LandLoading, SingleImage } from "../components";
import { Imageprops } from "../entities";
import { useScrollPercent } from "../hooks";
import avaterPlaceHolder from '../assert/avaterplaceholder.svg';

type Props = {
  profileAvatersData: Imageprops[]
  profileAvatersLoading: boolean
  profileAvatersError: string,
  handleServerLoadMoreAvaters: () => void
  moreAvatersLoading: boolean
  moreAvatersError: string
  numberOfAvaters: number
};

const Avatersec = ({
  profileAvatersData,
  profileAvatersLoading,
  profileAvatersError,
  handleServerLoadMoreAvaters,
  moreAvatersLoading,
  moreAvatersError,
  numberOfAvaters,
}: Props) => {

  const { scrollPercent } = useScrollPercent();

  const handleAutoLoadMoreAvater = () => {

    if (numberOfAvaters !== profileAvatersData.length) {
      handleServerLoadMoreAvaters();
    };

  };

  useEffect(() => {
    handleAutoLoadMoreAvater();
  }, [scrollPercent]);

  return <div id="profile-advater" className="w-full">
    <div className="w-full flex flex-wrap justify-center gap-2" >
      {
        !profileAvatersLoading ?
          <>{
            profileAvatersData &&
              profileAvatersData.length ?
              <>
                {profileAvatersData
                  .map((item, index) =>
                    <SingleImage
                      key={item._id}
                      image={item}
                      index={index}
                      placeHolder={avaterPlaceHolder}
                    />
                  )}
              </> :
              null
          }</> :
          <div className="w-full flex flex-wrap justify-center gap-2">
            {Array(3).fill('').map((_, index) =>
              <Imageplaceholder key={index} />
            )}
          </div>
      }
    </div>
    <LandLoading loading={moreAvatersLoading} />
  </div>
};

export default Avatersec;
