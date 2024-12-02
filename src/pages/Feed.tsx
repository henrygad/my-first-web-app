import { useEffect, useState } from "react";
import { Blogpostprops, Userprops } from "../entities";
import { useFetchData, useScrollPercent } from "../hooks";
import { Blogpostplaceholders, Button, Displayimage, LandLoading, Singleblogpost } from "../components";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { fetchTimelineFeeds } from "../redux/slices/userBlogpostSlices";
import { Link } from "react-router-dom";
import avaterPlaceholder from '../assert/avaterplaceholder.svg'

const Feed = ({ streamedFeeds, setStreamedFeeds }: { streamedFeeds: Blogpostprops | null, setStreamedFeeds: (value: any) => void }) => {
    const { scrollPercent } = useScrollPercent();

    const { userProfile: {
        data: getProfileData
    } } = useAppSelector((state) => state.userProfileSlices);

    const { data: users, loading: loadingUsers } =
        useFetchData<Userprops[]>(getProfileData && getProfileData.following.length <= 0 ? '/api/users?skip=0&limit=10' : null,
            [getProfileData && getProfileData.following]);
    const [peopleToFollow, setPeopleToFollow] = useState<Userprops[]>([]);

    const { timelineFeeds: {
        data: timelineFeeds,
        loading: loadingTimelineFeeds
    } } = useAppSelector((state) => state.userBlogpostSlices);

    const appDispatch = useAppDispatch();

    const { fetchData: fetchMoreFeedsData, loading: loadingMoreFeeds } = useFetchData<Blogpostprops[]>(null);
    const { fetchData: fetchRefreshFeedData, loading: loadingRefreshFeeds } = useFetchData<Blogpostprops[]>(null);

    const handleRefreshFeeds = async () => {
        if (!getProfileData ||
            !getProfileData.timeline) return;

        fetchRefreshFeedData(`/api/blogposts/timeline/${getProfileData.timeline.join('&')}?status=published&skip=0&limit=${timelineFeeds?.length}`)
            .then((res) => {

                const { data } = res;
                if (data) {
                    appDispatch(fetchTimelineFeeds({
                        data,
                        loading: false,
                        error: '',
                    }));
                };
            });
    };

    const handleLoadMoreFeeds = async () => {
        if (!getProfileData ||
            !getProfileData.timeline) return;

        fetchMoreFeedsData(`/api/blogposts/timeline/${getProfileData.timeline.join('&')}?status=published&skip=${timelineFeeds?.length}&limit=10`)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                setStreamedFeeds(null);
                appDispatch(fetchTimelineFeeds({
                    data: [...timelineFeeds, ...data],
                    loading: false,
                    error: '',
                }));
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

    const handleAddStreamFeeds = () => {
        if (streamedFeeds) {
            appDispatch(fetchTimelineFeeds({
                data: [streamedFeeds, ...timelineFeeds],
                loading: false,
                error: '',
            }));
            setStreamedFeeds(null);
        };
    };

    useEffect(() => {
        if (users &&
            getProfileData
        ) {
            setPeopleToFollow(users.filter(item => item.userName !== getProfileData.userName));
        };
    }, [users, getProfileData?.userName]);

    useEffect(() => {
        handleLoadFeedsOnScroll();
    }, [scrollPercent]);


    const test = Array(4).fill('');


    return <div className="relative justify-center space-y-8">
        <div className="flex items-center mb-4">
            <span className="text-xl font-text capitalize underline">
                For you
            </span>
        </div>
        {
            getProfileData &&
                getProfileData.following.length <= 0 ?
                <div id="list-of-user-you-might-know" className="mt-4">
                    {
                        !loadingUsers ?
                            <>
                                <div>
                                    <span className="text-2xl font-primary font-semibold">
                                        Suggested for you
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 w-full max-w-full py-2 overflow-x-auto">
                                    {peopleToFollow ?
                                        peopleToFollow.map((user) =>
                                            <Link key={user.userName} to={'/' + user.userName} className="flex items-start justify-start gap-3 min-w-[180px]">
                                                <Displayimage
                                                    id={'avater'}
                                                    placeHolder={avaterPlaceholder}
                                                    imageId={user.displayImage}
                                                    parentClass='h-11 w-11'
                                                    imageClass='object-contain rounded-full'
                                                />
                                                <div className='flex flex-col font-secondary '>
                                                    <span id='name' className='text-base font-semibold'>{user.name}</span>
                                                    <span id='userName' className='text-[0.8rem] opacity-50'>{user.userName}</span>
                                                </div>
                                            </Link>
                                        ) :
                                        null
                                    }
                                </div>
                            </> :
                            <>
                                <div className="animate-pulse">
                                    <span className="h-2 min-w-[100px] bg-slate-200">
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 max-w-full py-2 overflow-x-auto">
                                    {
                                        Array(2).fill('').map((_, index) =>
                                            <div key={index} className="w-full flex justify-start items-start gap-2 animate-pulse">
                                                <div id="image-pulse" className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                                <div className="w-[80px] h-2 bg-slate-200 rounded-sm mt-2"></div>
                                            </div>
                                        )
                                    }
                                </div>
                            </>

                    }
                </div> :
                null
        }
        <div className="flex justify-center">
            {!loadingTimelineFeeds ?
                timelineFeeds &&
                    timelineFeeds.length ?
                    <div>
                        {streamedFeeds ?
                            <Button
                                id="load-new-feeds"
                                buttonClass="absolute top-0 right-0 left-0 p-1 rounded-xl bg-green-500 z-10"
                                children="New blogpost is avaliable"
                                handleClick={handleAddStreamFeeds}
                            />
                            :
                            null
                        }

                        {
                            timelineFeeds.map((item, index) =>
                                <Singleblogpost
                                    key={item._id}
                                    type={'text'}
                                    index={index}
                                    blogpost={item}
                                />
                            )
                        }

                        <LandLoading loading={loadingMoreFeeds} />
                    </div> :
                    null :
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

export default Feed;
