import { Backwardnav, Blogpostplaceholders, Singleblogpost } from "../components";
import { useAppSelector } from "../redux/slices"

const Saves = () => {
  const { savedsBlogposts: { data: blogposts, loading: loadingSaves } } = useAppSelector((state) => state.userBlogpostSlices);

  return <div >
    <Backwardnav  pageName="Saves" />
    <div className="flex justify-center">
      {!loadingSaves ?
        <div>
          {blogposts && blogposts.length ?
            <>
              {
                blogposts.map((item, index) =>
                  item.status === 'published' ?
                    <Singleblogpost
                      key={item._id}
                      type="text"
                      blogpost={item}
                      index={index}
                    /> :
                    null
                )
              }
            </> :
            null
          }
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
  </div>
}

export default Saves
