import { useEffect, useState } from "react";
import { Commentprops } from "../entities"
import Button from "./Button";
import Dialog from "./Dialog";
import Trythistexteditor from "../custom-text-editor/App";
import { useFetchData, useNotification, usePostData, useUserIsLogin } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { addComment, increaseTotalNumberOfUserComments } from "../redux/slices/userCommentsSlices";
import Singlecomment from "./Singlecomment";
import { deleteAll } from "../custom-text-editor/settings";
import { FaRegComments } from "react-icons/fa6"
import { IoMdArrowRoundBack } from "react-icons/io";
import tw from "tailwind-styled-components";
import LandLoading from "./LandLoading";
import Commentplaceholder from "./Commentplaceholder";

type Props = {
    arrOfcomment: Commentprops[]
    commentTotalNum: number,
    loadingComment: boolean

    blogpostId: string
    blogpostAuthorUserName: string
    blogpostUrl: string
    blogpostTitle: string

    autoOpenTargetComment?: { autoOpen: boolean, commentId: string, commentAddress: string, comment: Commentprops | null, blogpostId: string, targetLike: { autoOpen: boolean, commentId: string, like: string } }
}

const Commentbutton = ({
    arrOfcomment,
    commentTotalNum,
    loadingComment,

    blogpostId,
    blogpostAuthorUserName,
    blogpostTitle,
    blogpostUrl,

    autoOpenTargetComment =
    { autoOpen: false, commentId: '', commentAddress: '', comment: null, blogpostId: '', targetLike: { autoOpen: false, commentId: '', like: '' } },
}: Props) => {

    const { loginStatus: { isLogin, loginUserName } } = useUserIsLogin()

    const { fetchData: fetchSeeMoreCommentData, loading: loadingMoreComment } = useFetchData<Commentprops[]>(null);

    const [getParentCommentContent, setParentGetCommentContent] = useState<{ _html: string, text: string } | null>(null);
    const [displayParentComments, setDisplayParentComment] = useState<Commentprops[]>([]);

    const { postData: postComment, loading: loadingPostComment } = usePostData();
    const appDispatch = useAppDispatch();

    const notify = useNotification();

    const [toggleCommentDialog, setToggleCommentDialog] = useState(' ');
    const [toggleParentTextEditor, setToggleParentTextEditor] = useState(true);

    const clearCommentInputArea = () => {
        const contentEditAbleELe = document.querySelectorAll("[contenteditable]");  //Get all contenteditable div on page
        contentEditAbleELe.forEach((element) => {
            deleteAll(element as HTMLDivElement)
        });
    };

    const handleParentCommentNotification = async (comment: Commentprops) => {
        const { _id, parentUrl } = comment;
        if (loginUserName === blogpostAuthorUserName) return; // don't notify blogpost author when he commented

        const url = '/api/notification/' + blogpostAuthorUserName;
        const body = {
            typeOfNotification: 'blogpostComment',
            msg: `commented on your post, <span class="underline">${blogpostTitle}</span>`,
            url: parentUrl + '/' + _id,
            notifyFrom: loginUserName,
        };

        await notify(url, body);
    };

    const handleAddCommentToBlogpost = async () => {
        if (!blogpostId) return;

        const url = '/api/addcomment';
        const body = {
            parentId: null,
            blogpostId,
            parentUrl: blogpostUrl,
            body: getParentCommentContent || { _html: '', text: '' },
            commentIsAReplyTo: [blogpostAuthorUserName]
        };
        postComment<Commentprops>(url, { ...body })
            .then((req) => {
                const { data } = req;

                if (data) {
                    setDisplayParentComment((pre) => pre ? [data, ...pre] : pre);
                    appDispatch(addComment(data));
                    appDispatch(increaseTotalNumberOfUserComments(1));
                    clearCommentInputArea();
                    handleParentCommentNotification(data);
                };
            });
    };

    const handleLoadMoreParentComment = () => {
        fetchSeeMoreCommentData(`/api/comments/blogpost/${blogpostId}?skip=${displayParentComments.length}&limit=5`)
            .then((res) => {
                const { data } = res;
                if (data) {
                    setDisplayParentComment((pre) => pre ? [...pre, ...data] : pre);
                };
            });
    };

    useEffect(() => {
        setDisplayParentComment(
            autoOpenTargetComment?.autoOpen &&
                autoOpenTargetComment?.comment ?
                [autoOpenTargetComment.comment, ...arrOfcomment.filter(item => item._id !== autoOpenTargetComment.comment?._id)] :
                arrOfcomment
        );
    }, [arrOfcomment, autoOpenTargetComment.comment]);

    useEffect(() => {
        setTimeout(() => {
            setToggleCommentDialog(autoOpenTargetComment?.autoOpen ? autoOpenTargetComment.blogpostId : '');
        }, 1000);
    }, [autoOpenTargetComment?.autoOpen]);

    return <div>
        <Button
            id='comment-btn'
            buttonClass="flex gap-2"
            children={<>
                <FaRegComments size={22} />
                {commentTotalNum}
            </>}
            handleClick={() => setToggleCommentDialog(blogpostId)}
        />
        <Dialog
            id="blogpost-comments-dialog"
            currentDialog={blogpostId}
            parentClass=""
            childClass="container relative flex flex-col w-full h-full bg-white dark:bg-stone-800 dark:text-white py-4"
            dialog={toggleCommentDialog}
            setDialog={() => setToggleCommentDialog(' ')}
            children={
                <>
                    <>
                        <div className="flex gap-2 items-center py-2">
                            <Button
                                id="return-black"
                                buttonClass=""
                                children={<IoMdArrowRoundBack size={20} />}
                                handleClick={() => setToggleCommentDialog(' ')}
                            />
                            <span id="search-history-title" className="text-xl font-semibold">
                                Comments
                            </span>
                        </div>
                        {!loadingComment ?
                            <div id="list-comments" className="flex-1 relative max-h-full p-4 overflow-y-auto">
                                {displayParentComments &&
                                    displayParentComments.length ?
                                    <>
                                        {
                                            displayParentComments.map((item, index) =>
                                                <Singlecomment
                                                    key={index}
                                                    index={index}
                                                    type="text"
                                                    comment={item}
                                                    setDisplayParentComment={setDisplayParentComment}
                                                    autoOpenTargetComment={autoOpenTargetComment}
                                                    toggleParentTextEditor={toggleParentTextEditor}
                                                    setToggleParentTextEditor={setToggleParentTextEditor}
                                                />
                                            )
                                        }
                                        <div className="flex items-center mt-3">
                                            {
                                                (commentTotalNum - displayParentComments.length) ?
                                                    <Button
                                                        id=""
                                                        buttonClass="w-full text-center"
                                                        children={<>{
                                                            !loadingMoreComment ?
                                                                `See ${(commentTotalNum - displayParentComments.length)} more comment` :
                                                                <LandLoading loading={loadingMoreComment} />}
                                                        </>}
                                                        handleClick={handleLoadMoreParentComment}
                                                    /> :
                                                    null
                                            }

                                        </div>
                                    </> :
                                    null
                                }
                            </div> :
                            <div className="min-w-[280px] sm:min-w-[320px] md:min-w-[768px]">
                                {
                                    Array(4).fill('').map((_, index) =>
                                        <Commentplaceholder key={index} />
                                    )
                                }
                            </div>
                        }
                    </>
                    {isLogin  &&
                     toggleParentTextEditor? 
                    <Commenttexteditorwrapper id="blogpost-comment-textarea-wrapper">
                        <Trythistexteditor
                            id='blogpost-comment-text-editor'
                            placeHolder="Comment..."
                            InputWrapperClassName="w-full max-h-[140px] border-2 p-3 rounded-md overflow-y-auto"
                            InputClassName=""
                            textEditorWrapperClassName="p-2"
                            useTextEditors={{ useInlineStyling: true }}
                            createNewText={{ IsNew: true }}
                            inputTextAreaFocus={true}
                            setGetContent={setParentGetCommentContent}
                        />
                        <div id="comment-btn" className="flex justify-center">
                            <Button
                                id="create-comment"
                                children={!loadingPostComment ? 'Comment' : 'loading...'}
                                buttonClass="font-simibold bg-green-800 rounded-md py-2 px-4 border border-green-400 shadow active:bg-green-400 transition-color"
                                handleClick={() => handleAddCommentToBlogpost()}
                            />
                        </div>
                    </Commenttexteditorwrapper> :
                        null
                    }
                </>
            }
        />
    </div>
};

export default Commentbutton;

const Commenttexteditorwrapper = tw.div` 
flex 
flex-col
gap-4
justify-center
px-4
py-2
`
