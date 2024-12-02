import { useLocation, useParams } from "react-router-dom";
import { Backwardnav, Blogpostplaceholders, Singleblogpost } from "../components";
import { useFetchData } from "../hooks";
import { Blogpostprops, Commentprops, Searchresultprops } from "../entities";
import { useEffect, useState } from "react";
import Page404 from "./Page404";

const Singleblogpostpage = () => {
  const { authorUserName, slug } = useParams();
  const { state } = useLocation();

  const notificationData = state?.commentNotification || {};
  const commentLikes = notificationData.targetCommentLike || {};
  const blogpostLike = state?.blogpostLikeNotification || {};

  const blogpostUrl = authorUserName + '/' + slug;
  if (!blogpostUrl) return;

  // get single blogpost
  const { data: singleBlogpostData, loading: loaidngSinglgeBlogpost, error: singleBlogpostError, } =
    useFetchData<Blogpostprops>('/api/blogpost/' + blogpostUrl, [blogpostUrl]);

  // for targeting a specific comment / comment like or blogpost like data
  const { data: notificationComment, loading: loadingNotificationComment } =
    useFetchData<Commentprops>(notificationData?.autoOpenComment ? '/api/comments/' + notificationData?.parentCommentId : '', [notificationData?.parentCommentId]);

  // for fetching similar blogpost with the same catigory or title
  const { fetchData: fetchSimilarBlogpost, loading: loadingSimilarBlogposts } = useFetchData<Searchresultprops>();
  const [similarBlogposts, setSimilarBlogposts] = useState<Blogpostprops[]>();

  const handleFetchSimilarBlogposts = async () => { // func to handle similar blogpost
    if (singleBlogpostData) {
      fetchSimilarBlogpost(`/api/search?body=${singleBlogpostData.title}&catigory=${singleBlogpostData.catigory}&skip=0&limit=10`)
        .then((res) => {
          const { data } = res;
          if (data) {
            const { blogpostSearchResult } = data;
            setSimilarBlogposts(blogpostSearchResult);
          };
        });
    };
  };


  useEffect(() => {
    handleFetchSimilarBlogposts();
  }, [singleBlogpostData]);


  return <div className="overflow-hidden">
    <Backwardnav pageName={`Reading ${singleBlogpostData?.title || ''}`} />
    {!(loaidngSinglgeBlogpost || loadingNotificationComment) ?
      <div id="display-single-blogpost-wrapper">
        {singleBlogpostError.trim() ?
          <Page404 /> :
          <>
            {singleBlogpostData &&
              singleBlogpostData.status === 'published' ?
              <Singleblogpost
                blogpost={singleBlogpostData}
                type="html"
                index={0}

                autoOpenTargetComment={{
                  autoOpen: notificationData?.autoOpenComment,
                  commentId: notificationData?.commentId,
                  commentAddress: notificationData?.commentAddress,
                  comment: notificationComment,
                  blogpostId: singleBlogpostData?._id,
                  targetLike: {
                    autoOpen: commentLikes?.autoOpenCommentLike,
                    commentId: commentLikes?.likeCommentId,
                    like: commentLikes?.commentlike
                  }
                }}

                autoOpenTargetBlogpostLike={{
                  autoOpen:  blogpostLike?.autoOpenBlogpostLike,
                  like:  blogpostLike?.blogpostlike,
                  blogpostId: singleBlogpostData?._id,
                }}
              /> :
              <div className="flex items-center justify-center">
                <div>
                  <span className="text-2xl font-secondary text-center">This Blogpost has been brought down by the Author</span>
                </div>
              </div>
            }
          </>

        }

        <div id="similar-blogpost-sec" className="mt-10">
          {!loadingSimilarBlogposts ?
            <>
              {
                similarBlogposts &&
                  similarBlogposts.length > 1 ?
                  <div className="flex justify-center space-y-6">
                    <div>
                      <span className="text-2xl font-secondary underline">Similar Blogpost</span>
                    </div>
                    <div>
                      {similarBlogposts.map((item, index) =>
                        item._id === singleBlogpostData?._id ?
                          null :

                          <Singleblogpost
                            key={item._id}
                            type={'text'}
                            index={index}
                            blogpost={item}
                          />
                      )
                      }
                    </div>
                  </div>
                  :
                  null
              }
            </> :
            <div className="flex justify-center space-y-6">
              <div>
                <span className="w-[120px] h-2 bg-slate-200 rounded-sm"></span>
              </div>
              <div className="min-w-[280px] sm:min-w-[320px] md:min-w-[768px]">
                {
                  Array(3).fill('').map((_, index) =>
                    <Blogpostplaceholders key={index} index={index} />
                  )
                }
              </div>
            </div>
          }
        </div>
      </div> :
      <Blogpostplaceholders />
    }
  </div>
};

export default Singleblogpostpage;

