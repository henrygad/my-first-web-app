import { useNavigate } from "react-router-dom";
import { Blogpostprops } from "../entities";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { Button, LandLoading } from "../components";
import { usePatchData } from "../hooks";
import { deleteDrafts } from "../redux/slices/userProfileSlices";


const Drafts = () => {
    const { userProfile: { data: profileData, loading: loadingProfile } } = useAppSelector((state) => state.userProfileSlices);
    const appDispatch = useAppDispatch();

    const { patchData: patchDraftData, loading: loadingDeleteDraft } = usePatchData();

    const navigate = useNavigate();

    const handleEditBlogpost = (blogpost: Blogpostprops) => {
        navigate('/createpost', { state: { edit: true, data: blogpost } });
    };

    const handleDeleteDraft = async (_id: string) => {
        const url = '/api/profile/drafts/delete';
        const copyId = { _id };

        await patchDraftData<Blogpostprops>(url, copyId)
            .then((data) => {
                if (data) {
                    console.log(data)
                    appDispatch(deleteDrafts({ _id }));
                };
            });
    };



    if (loadingDeleteDraft) {
        return <LandLoading loading={loadingDeleteDraft} />
    };


    return <div className="w-full space-y-6">
        <div>
            <span className="text-2xl font-secondary underline">Draftpost</span>
        </div>
        {!loadingProfile ?
            <div className="w-full space-y-2">
                {profileData &&
                    profileData.drafts &&
                    profileData.drafts.length ?
                    <div id="archived-blogpost-wrapper">
                        {profileData.drafts
                            .map((item, index) =>
                                <div key={item._id} className="w-full border py-2 px-3 space-y-1 shadow-sm rounded-md ">
                                    <div>
                                        <span className="font-text text-base">{item.title}</span>
                                    </div>
                                    <div className="flex justify-end items-center gap-3">
                                        <Button
                                            id="edit-blogpost-btn"
                                            buttonClass="flex gap-2 text-sm font-secondary"
                                            children='Edit'
                                            handleClick={() => handleEditBlogpost(item)}
                                        />
                                        <Button
                                            id="delete-blogpost-btn"
                                            buttonClass="flex gap-2 text-sm font-secondary"
                                            children='Delete'
                                            handleClick={() => handleDeleteDraft(item._id)}
                                        />
                                    </div>
                                </div>
                            )}
                    </div> :
                    null
                }
            </div> :
            <>
                {Array(3).fill('').map((_ , index)=>
                    <div key={index} className="w-full border py-2 px-3 space-y-1 rounded-md animate-pulse">
                        <div className="w-full h-4 bg-slate-200 rounded-full"></div>
                        <div className="flex justify-end w-full">
                            <div className="w-[100px] h-2  bg-slate-200 rounded-full"></div>
                        </div>
                    </div>
                )}
            </>
        }
    </div>
};

export default Drafts;
