import { useEffect, useState } from "react";
import Button from "./Button";
import {  useNotification, usePatchData, useUserIsLogin } from "../hooks";
import Dialog from "./Dialog";
import { SlLike } from "react-icons/sl";
import Singleuser from "./Singleuser";
import { IoMdArrowRoundBack } from "react-icons/io";

type Props = {
    parentId: string
    arrOfLikes: string[]
    apiForLike: string,
    apiForUnlike: string
    apiGetLikes: string

    autoOpenTargetLike: { autoOpen: boolean, commentId: string, like: string },

    notificationUrl: string
    notificationTitle: string
    userNameToNotify: string
    liking: string;
};

const Likebutton = ({
    parentId,
    arrOfLikes,
    apiForLike,
    apiForUnlike,
    apiGetLikes,

    autoOpenTargetLike = { autoOpen: false, commentId: '', like: '' },

    userNameToNotify,
    notificationTitle,
    notificationUrl,
    liking,
}: Props) => {

    const { loginStatus: { loginUserName } } = useUserIsLogin();
    const [toggleLikeIcon, setToggleLikeIcon] = useState(false);

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState<string[]>(
        autoOpenTargetLike?.autoOpen && autoOpenTargetLike?.like ?
            [autoOpenTargetLike.like, ...arrOfLikes.filter(item => item !== autoOpenTargetLike.like)] :
            arrOfLikes
    );
    const { patchData, loading: loadingLike } = usePatchData();
    const notify = useNotification();

    const [toggleLikesDialog, setToggleLikesDialog] = useState(' ');

    const [targetLike, setTargetLike] = useState(' ');

    const handlelike = async (apiForLike: string) => {
        if (liked) return;
        setLiked(true);
        setToggleLikeIcon(true);

        setTimeout(() => {
            setToggleLikeIcon(false);
        }, 100);

        const url = apiForLike;
        const body = null;

        const response = await patchData<{ like: string }>(url, body);
        const { data } = response;

        if (data) {
            setLikes(pre => pre ? [...pre, data.like] : pre);
            handleNotification();
        };

    };

    const handleUnlike = async (apiForUnlike: string) => {
        if (!liked) return;
        setLiked(false);

        setToggleLikeIcon(true);

        setTimeout(() => {
            setToggleLikeIcon(false);
        }, 100);

        const url = apiForUnlike;
        const body = null;

        const response = await patchData<{ unlike: string }>(url, body);
        const { data } = response;

        if (data) {
            setLikes(pre => pre.filter(like => like !== data.unlike));
            setLiked(false);
        };
    };

    const handleNotification = async () => {
        const isOwnerOfBlogpost = userNameToNotify === loginUserName;
        if (isOwnerOfBlogpost) return;

        const url = '/api/notification/' + userNameToNotify;
        const body = {
            typeOfNotification: liking,
            msg: `liked your ${liking.includes('blogpost') ? 'blogpost' : 'comment'}, <span class="underline">${notificationTitle}</span>`,
            url: notificationUrl,
            notifyFrom: loginUserName,
        };

        await notify(url, body);
    };


    useEffect(() => {
        if (likes && loginUserName) {
            setLiked(likes.includes(loginUserName));
        }
    }, [likes, loginUserName]);

    useEffect(() => {
        if (autoOpenTargetLike &&
            autoOpenTargetLike.autoOpen &&
            autoOpenTargetLike?.commentId) {
            setTimeout(() => {
                setToggleLikesDialog(autoOpenTargetLike.commentId);
                setTargetLike(autoOpenTargetLike.like);

            }, 1000);

            setTimeout(() => {
                setTargetLike(' ');
            }, 3000);
        };
    }, [autoOpenTargetLike?.autoOpen, autoOpenTargetLike?.commentId]);


    return <div>
        <Button
            id='like-btn'
            buttonClass="flex gap-2"
            children={<>
                <SlLike size={20} className={`relative transition-all ${toggleLikeIcon ? '-translate-y-1' : 'translate-y-0'} ${liked ? 'text-pink-600' : ''} `} />
                <span onClick={(e) => { setToggleLikesDialog(parentId); e.stopPropagation() }} >
                    {likes?.length || 0}
                </span>
            </>
            }
            handleClick={() => { !liked ? handlelike(apiForLike) : handleUnlike(apiForUnlike) }}
        />
        <Dialog
            id='blogpost-like-dialog'
            parentClass=''
            childClass='container relative rounded-sm space-y-2 w-full h-full bg-white dark:bg-stone-800 dark:text-white py-4'
            currentDialog={parentId}
            dialog={toggleLikesDialog}
            setDialog={setToggleLikesDialog}
            children={
                <>
                    <div className="flex gap-2 items-center">
                        <Button
                            id="return-black"
                            buttonClass=""
                            children={<IoMdArrowRoundBack size={20} />}
                            handleClick={() => setToggleLikesDialog(' ')}
                        />
                        <span id="search-history-title" className="text-xl font-semibold">
                            Likes
                        </span>
                    </div>
                    <div className="w-full h-full max-h-full overflow-y-auto">
                        {likes &&
                            likes.length ?
                            <>
                                {likes.map((item, index) =>
                                    <div key={item} className={targetLike === item ? 'bg-yellow-100 dark:bg-yellow-600' : ''} >
                                        <Singleuser userName={item} index={index} />
                                    </div>
                                )}
                            </> :
                            null
                        }
                    </div>
                </>
            }
        />
    </div>
};

export default Likebutton;
