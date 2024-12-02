import { useEffect, useState } from "react";
import { useScrollPercent, useFetchData } from "../hooks";
import { Blogpostprops } from "../entities";
import { Blogpostplaceholders, LandLoading, Searchform, Singleblogpost } from "../components";

type Props = {
    treadingFeedsData: Blogpostprops[]
    treadingFeedsLoading: boolean
    treadingFeedsError: string
};

const Landingpage = ({
    treadingFeedsData,
    treadingFeedsLoading,
    treadingFeedsError,
}: Props) => {
    const { scrollPercent } = useScrollPercent();
    const [treading, setTreading] = useState<Blogpostprops[]>([]);

    const { fetchData: fetchRefreshFeedData, loading: loadingRefreshFeeds } = useFetchData<Blogpostprops[]>(null);
    const { fetchData: fetchMoreFeedData, loading: loadingMoreFeeds } = useFetchData<Blogpostprops[]>(null);

    const handleRefreshFeeds = async () => {
        fetchRefreshFeedData(`/api/blogposts?status=published&skip=0&limit=${treading.length}`)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                setTreading(data);
            });
    };

    const handleLoadMoreFeeds = async () => {
        fetchMoreFeedData(`/api/blogposts?status=published&skip=${treading.length}&limit=10`)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                setTreading((pre) => [...pre, ...data]);
            });
    };

    const handleLoadFeedsOnScroll = () => {
        if (scrollPercent === 0) {
            if (loadingMoreFeeds) return;
            handleRefreshFeeds();
        };

        if (scrollPercent === 100) {
            if (loadingRefreshFeeds) return;
            handleLoadMoreFeeds();
        };
    };

    useEffect(() => {
        if (treadingFeedsData) setTreading(treadingFeedsData);
    }, [treadingFeedsData]);

    useEffect(() => {
        handleLoadFeedsOnScroll();
    }, [scrollPercent]);

    return <div >
        <Searchform />
        <div className="flex items-center mb-4">
            <span className="text-xl font-text capitalize underline">
                Treading
            </span>
        </div>
        <div className="w-full flex justify-center">
            {
                !treadingFeedsLoading &&
                    treading &&
                    treading.length ?
                    <div>
                        {
                            treading.map((item, index) =>
                                <Singleblogpost
                                    key={item._id}
                                    type={'text'}
                                    index={index}
                                    blogpost={item}
                                    callBack={({ _id }) => setTreading(pre => pre.filter(item => item._id !== _id))}
                                />
                            )

                        }
                        <LandLoading loading={true} />
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
};

export default Landingpage;
