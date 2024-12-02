import { useEffect } from "react";
import { Blogpostplaceholders, LandLoading, Singleblogpost } from "../components";
import { Blogpostprops } from "../entities";
import { useScrollPercent } from "../hooks";

type Props = {
  profileBlogposts: Blogpostprops[]
  profileBlogpostsLoading: boolean
  profileBlogpostsError: string,
  handleServerLoadMoreBlogposts: () => void
  moreBlogpostsLoading: boolean
  moreBlogpostsError: string
  numberOfBlogposts: number
};

const Blogpostsec = ({
  profileBlogposts,
  profileBlogpostsLoading,
  profileBlogpostsError,
  handleServerLoadMoreBlogposts,
  moreBlogpostsLoading,
  moreBlogpostsError,
  numberOfBlogposts,
}: Props) => {
  const { scrollPercent } = useScrollPercent();

  const handleAutoLoadMoreBlogposts = () => {
    if (scrollPercent === 100 &&
      !moreBlogpostsLoading
    ) {
      if (numberOfBlogposts !== profileBlogposts.length) {
        handleServerLoadMoreBlogposts();
      };
    };

  };

  useEffect(() => {
    handleAutoLoadMoreBlogposts();
  }, [scrollPercent]);

  return <div>
    {!profileBlogpostsLoading ?
      <div>
        {profileBlogposts &&
          profileBlogposts.length ?
          profileBlogposts.map((item, index) =>
            < Singleblogpost
              key={item._id}
              blogpost={item}
              type='text'
              index={index}
            />
          ) :
          null}
        <LandLoading loading={moreBlogpostsLoading} />
      </div> :
      <div className="min-w-[280px] sm:min-w-[320px] md:min-w-[768px]">
        {
          Array(3).fill('').map((_, index) =>
            <Blogpostplaceholders key={index} index={index} />
          )
        }
      </div>
    }
  </div>
};

export default Blogpostsec;
