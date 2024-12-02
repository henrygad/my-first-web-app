import { Button, LandLoading, Screenloading } from "../components";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { useDeleteData, usePatchData } from "../hooks";
import { Blogpostprops } from "../entities";
import { deleteUnpublishedBlogposts, editPublishedBlogpost, increaseTotalNumberOfPublishedBlogposts } from "../redux/slices/userBlogpostSlices";
import { useNavigate } from "react-router-dom";

const Unpublisheds = () => {
    const { unpublishedBlogposts: { data: blogposts, loading: loadingUnPublishes } } = useAppSelector((state) => state.userBlogpostSlices);

    const { patchData: patchBlogpostData, loading: loadingPublisingBlogpost } = usePatchData();
    const { deleteData: deleteBlogpostData, loading: loadingDeleteBlogpost } = useDeleteData();
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    const handlePublish = async (_id: string) => {

        const url = '/api/editblogpost/' + _id;
        const body = {
            status: 'published',
        };

        patchBlogpostData<Blogpostprops>(url, body)
            .then((res) => {
                const { data } = res;
                if (data) {
                    appDispatch(editPublishedBlogpost(data));
                    appDispatch(increaseTotalNumberOfPublishedBlogposts(1));
                    appDispatch(deleteUnpublishedBlogposts({ _id }));
                };
            });
    };

    const handleEditBlogpost = (blogpost: Blogpostprops) => {
        navigate('/createpost', { state: { edit: true, data: blogpost } });
    };

    const handleDeleteBlogpost = async (_id: string) => {
        const url = '/api/deleteblogpost/' + _id;
        deleteBlogpostData(url)
            .then((res) => {
                appDispatch(deleteUnpublishedBlogposts({ _id }));
            });
    };

    if (loadingDeleteBlogpost) {
        return <LandLoading loading={loadingDeleteBlogpost} />
    };

    return <div className="w-full space-y-6">
        <div>
            <span className="text-2xl font-secondary underline">Unpublished post</span>
        </div>
        {!loadingUnPublishes ?
            <div className="w-full space-y-2">
                {blogposts &&
                    blogposts.length ?
                    <>{blogposts.map((item, index) =>
                        <div key={item._id} className="w-full border py-2 px-3 space-y-1 shadow-sm rounded-md ">
                            <div>
                                <span className="font-text text-base">{item.title}</span>
                            </div>
                            <div className="flex justify-end items-center gap-3">
                                <Button
                                    id="publish-blogpost-btn"
                                    buttonClass="flex gap-2 font-secondary"
                                    children='Publish'
                                    handleClick={() => handlePublish(item._id)}
                                />
                                <Button
                                    id="edit-blogpost-btn"
                                    buttonClass="flex gap-2 font-secondary"
                                    children='Edit'
                                    handleClick={() => handleEditBlogpost(item)}
                                />
                                <Button
                                    id="delete-blogpost-btn"
                                    buttonClass="flex gap-2 font-secondary"
                                    children='Delete'
                                    handleClick={() => handleDeleteBlogpost(item._id)}
                                />
                            </div>
                        </div>
                    )
                    }</> :
                    null
                }
            </div> :
            <>
                {Array(3).fill('').map((_, index) =>
                    <div key={index} className="w-full border py-2 px-3 space-y-1 rounded-md animate-pulse">
                        <div className="w-full h-4 bg-slate-200 rounded-full"></div>
                        <div className="flex justify-end w-full">
                            <div className="w-[100px] h-2  bg-slate-200 rounded-full"></div>
                        </div>
                    </div>
                )}
            </>
        }
        <Screenloading loading={loadingPublisingBlogpost} />
    </div>
};

export default Unpublisheds;
