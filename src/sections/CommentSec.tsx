import { useEffect } from "react";
import { Button, Commentplaceholder, LandLoading, Usercomment } from "../components";
import { Commentprops } from "../entities";
import { useScrollPercent } from "../hooks";


type Props = {
  profileCommentsData: Commentprops[]
  profileCommentsLoading: boolean
  profileCommentsError: string
  handleServerLoadMoreComments: () => void
  moreCommentsLoading: boolean
  moreCommentsError: string
  numberOfComments: number

};

const CommentSec = ({
  profileCommentsData,
  profileCommentsLoading,
  profileCommentsError,
  handleServerLoadMoreComments,
  moreCommentsLoading,
  moreCommentsError,
  numberOfComments,
}: Props) => {

  const { scrollPercent } = useScrollPercent();

  const handleAutoLoadMoreComments = () => {
    if (scrollPercent === 100 &&
      !moreCommentsLoading
    ) {
      if (numberOfComments !== profileCommentsData.length) {
        handleServerLoadMoreComments();
      };
    };

  };

  useEffect(() => {
    handleAutoLoadMoreComments();
  }, [scrollPercent]);

  return <div className="w-full flex justify-center">
    {
      !profileCommentsLoading ?
        <div >
          {
            profileCommentsData &&
              profileCommentsData.length ?
              <>{
                profileCommentsData.map((item, index) =>
                  <Usercomment
                    key={item._id}
                    comment={item}
                  />
                )
              }
                <LandLoading loading={moreCommentsLoading} />
              </> :
              null
          }
        </div> :
        <div className="min-w-[280px] sm:min-w-[320px] md:min-w-[480px]">
          {
            Array(4).fill('').map((_, index) =>
              <Commentplaceholder key={index} />
            )
          }
        </div>
    }
  </div>
}

export default CommentSec
