import React, { SetStateAction, useState } from 'react'
import Trythistexteditor from '../custom-text-editor/App'
import { Button, Dialog, Displayimage, Fileinput, Input, Menu, Popup, Screenloading } from '../components';
import addImagePlaceHolder from '../assert/addimage.svg';
import { useCreateImage, useDeleteData, useGetLocalMedia, useImageGalary, usePatchData, usePostData } from '../hooks';
import { Blogpostprops, Imageprops } from '../entities';
import { deleteAll } from '../custom-text-editor/settings';
import { useAppDispatch } from '../redux/slices';
import {
    decreaseTotalNumberOfPublishedBlogposts, deletePublishedBlogpost, deleteUnpublishedBlogposts, editPublishedBlogpost,
    increaseTotalNumberOfPublishedBlogposts, publishBlogpost, addUnpublishBlogposts
} from '../redux/slices/userBlogpostSlices';
import { addDrafts, deleteDrafts, editDrafts } from '../redux/slices/userProfileSlices';
import { addBlogpostImages } from '../redux/slices/userImageSlices';
import Displayblogpostimagessec from './Displayblogpostimagessec';
import { RxCross2 } from 'react-icons/rx';
import { FaMinus, FaPlus } from 'react-icons/fa';

type Props = {
    toEdit?: boolean
    inputAreasStatus: string
    setInputAreasStatus: React.Dispatch<React.SetStateAction<string>>
    getBlogpostId: string,
    setGetBlogpostId: React.Dispatch<React.SetStateAction<string>>
    titleContent: { _html: string; text: string }
    setTitleContent: React.Dispatch<React.SetStateAction<{
        _html: string;
        text: string;
    }>>
    bodyContent: { _html: string; text: string }
    setBodyContent: React.Dispatch<React.SetStateAction<{
        _html: string;
        text: string;
    }>>
    displayImage: string,
    setDisplayImage: React.Dispatch<SetStateAction<string>>
    catigory: { _id: number, cat: string }[],
    setCatigory: React.Dispatch<SetStateAction<{ _id: number, cat: string }[]>>
    slug: string
    setSlug: React.Dispatch<SetStateAction<string>>
    blogpostStatus: string,
    setBlogpostStatus: React.Dispatch<SetStateAction<string>>
    blogpostPreStatus: string
    setBlogpostPreStatus: React.Dispatch<SetStateAction<string>>
};

const Createblogpostsec = ({
    toEdit,
    inputAreasStatus,
    setInputAreasStatus,
    getBlogpostId,
    setGetBlogpostId,
    titleContent,
    setTitleContent,
    bodyContent,
    setBodyContent,
    displayImage,
    setDisplayImage,
    catigory,
    setCatigory,
    slug,
    setSlug,
    blogpostStatus,
    setBlogpostStatus,
    blogpostPreStatus,
    setBlogpostPreStatus,
}: Props) => {
    const [displayBlogpostImagePopup, setDisplayBlogpostImagePopup] = useState(false);

    const { postData: postBlogpostData, loading: loadingPostBlogpost } = usePostData();
    const { patchData: patchBlogpostData, loading: LoadingPatchBlogpostData } = usePatchData();
    const { patchData: patchDraftData, loading: loadingPatchDraftData } = usePatchData();
    const { deleteData, loading: loadingDeleteBlogpost } = useDeleteData();
    const { createImage, loading: loaidngCreateImage, error: errorCreateImage, } = useCreateImage();

    const getMedia = useGetLocalMedia();
    const { imageGalary, setImageGalary } = useImageGalary();

    const appDispatch = useAppDispatch();

    const blogpostMenu = [
        {
            name: 'Clear all',
            content: <Button
                id="clear-all"
                buttonClass={`test-base text-nowrap font-semibold ${inputAreasStatus !== 'empty' ? '' : 'opacity-20 cursor-text'} `}
                children={'Clear all'}
                handleClick={() => { handleClearInputsArea() }}
            />
        },
        {
            name: 'Publish',
            content: <Button
                id="publish"
                children="Publish"
                buttonClass={`test-base text-nowrap font-semibold ${(inputAreasStatus !== 'empty' && blogpostStatus !== 'published') ||
                    inputAreasStatus.includes('editing') ?
                    '' : 'opacity-20 cursor-text'} `}
                handleClick={() => {

                    if (inputAreasStatus.includes('editing')) {
                        handlePublishChanges(getBlogpostId);
                    };
                    if (blogpostStatus === 'unpublished') {
                        handleRepublish(getBlogpostId);
                    }
                    if (blogpostStatus === 'draft') {
                        handlePublishDraft()
                    }
                    if (blogpostStatus !== 'published') {
                        handldePublish();
                    };
                }}
            />
        },
        {
            name: 'Delete',
            content: <Button
                id="delete"
                children="Delete"
                buttonClass={`test-base text-nowrap font-semibold ${blogpostStatus === 'published' ||
                    blogpostStatus === 'unpublished'
                    || blogpostStatus === 'draft' ? '' : 'opacity-20 cursor-text'} `}
                handleClick={() => {
                    if (blogpostStatus === 'draft') {
                        handleDeleteDraft(getBlogpostId, true);
                    };

                    if (blogpostStatus === 'published' ||
                        blogpostStatus === 'unpublished'
                    ) {
                        handleDeleteBlogpost(getBlogpostId, blogpostStatus);
                    };
                }}
            />
        },
        {
            name: 'unpublish',
            content: <Button
                id="unpublish"
                children="Unpublish"
                buttonClass={`test-base text-nowrap font-semibold ${blogpostStatus === 'published' ? '' : 'opacity-20 cursor-text'} `}
                handleClick={() => {
                    handleUnpublish(getBlogpostId);
                }}
            />
        },
        {
            name: 'Draft',
            content: <Button
                id="draft"
                children="Draft"
                buttonClass={`test-base text-nowrap font-semibold ${inputAreasStatus !== 'empty' && inputAreasStatus !== 'old'
                    ? '' : 'opacity-20 cursor-text'} `}
                handleClick={() => {
                    if (inputAreasStatus !== 'empty' &&
                        inputAreasStatus !== 'old') {
                        if (blogpostStatus !== 'draft') handleCreateNewDraft('new');
                        else handleCreateNewDraft('edit');
                    };
                }}
            />
        },
    ];

    const handleDesignSlug = (slug: string, slugPertern: string) => {
        return slug.split(' ').join(slugPertern);
    };

    const handleClearInputsArea = () => {
        setGetBlogpostId('');
        setTitleContent({ _html: '', text: '' });
        setBodyContent({ _html: '', text: '' });
        setDisplayImage('');
        setCatigory([]);
        setSlug('');

        setDisplayBlogpostImagePopup(false);

        setInputAreasStatus('empty');
        setBlogpostStatus('');
        setBlogpostPreStatus('');

        const contentEditAbleELe = document.querySelectorAll("[contenteditable]");  //Get all contenteditable div on page
        contentEditAbleELe.forEach((element) => {
            deleteAll(element as HTMLDivElement)
        });
    };

    const handldePublish = async () => {
        if (!slug) return;
        const url = '/api/addblogpost';
        const body = {
            displayImage,
            title: titleContent?.text,
            body: bodyContent?.text,
            _html: { title: titleContent?._html, body: bodyContent?._html },
            catigory: catigory.map(item => item.cat).join(','),
            slug,
            status: 'published',
        };

        postBlogpostData<Blogpostprops>(url, body)
            .then((res) => {
                const { data } = res;
                if (data) {
                    if (data.status === 'published') {
                        appDispatch(publishBlogpost(data));
                        appDispatch(increaseTotalNumberOfPublishedBlogposts(1))
                    };

                    setGetBlogpostId(data._id)
                    setBlogpostStatus('published');
                    setInputAreasStatus('empty');
                };
            });
    };

    const editBlogpost = async (_id: string, status: string) => {
        if (!slug) return;

        const url = '/api/editblogpost/' + _id;
        const body = {
            displayImage,
            title: titleContent?.text,
            body: bodyContent?.text,
            _html: { title: titleContent?._html, body: bodyContent?._html },
            catigory: catigory.map(item => item.cat).join(','),
            slug,
            status,
        };

        await patchBlogpostData<Blogpostprops>(url, body)
            .then((res) => {
                const { data } = res;
                if (data) {

                    if (data.status === 'published') {
                        appDispatch(editPublishedBlogpost(data));
                        appDispatch(deleteUnpublishedBlogposts({ _id: data._id }));
                        setInputAreasStatus('empty');
                    };
                    if (data.status === 'unpublished') {
                        appDispatch(addUnpublishBlogposts(data));
                        appDispatch(decreaseTotalNumberOfPublishedBlogposts(1))
                        setInputAreasStatus('old');
                    };
                    setGetBlogpostId(data._id)
                    setBlogpostStatus(data.status);
                };

            }).catch((error) => {
                console.log(error);
            });
    };

    const handlePublishChanges = async (_id: string) => {
        if ((blogpostStatus === 'published' &&
            inputAreasStatus.includes('editing')) || blogpostStatus === 'draft') {
            await editBlogpost(_id, 'published');
        };
    };

    const handleUnpublish = (_id: string) => {
        if (blogpostStatus === 'published') editBlogpost(_id, 'unpublished');
    };

    const handleRepublish = (_id: string) => {
        if (blogpostStatus === 'unpublished') editBlogpost(_id, 'published');
    };

    const handleDeleteBlogpost = async (_id: string, status: string) => {
        const url = '/api/deleteblogpost/' + _id;
        await deleteData(url)
            .then((data) => {

                appDispatch(deletePublishedBlogpost({ _id }));
                appDispatch(deleteUnpublishedBlogposts({ _id }));
                if (status === 'published') appDispatch(decreaseTotalNumberOfPublishedBlogposts(1));
                handleClearInputsArea();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handlePublishDraft = async () => {
        if (blogpostPreStatus === 'published' ||
            blogpostPreStatus === 'unpublished'
        ) {
            await handlePublishChanges(getBlogpostId);
        } else {
            await handldePublish();
        };

        await handleDeleteDraft(getBlogpostId, false);
    };

    const handleCreateNewDraft = async (type: string) => {
        if (!slug) return;
        const url = '/api/profile/drafts/add';
        const copy = {
            _id: getBlogpostId,
            displayImage,
            title: titleContent?.text,
            body: bodyContent?.text,
            _html: { title: titleContent?._html, body: bodyContent?._html },
            catigory: catigory.map(item => item.cat).join(','),
            slug,
            preStatus: blogpostStatus,
            status: 'draft',
        };

        await patchDraftData<Blogpostprops>(url, copy)
            .then((res) => {
                const { data } = res;
                if (data) {
                    if (type === 'new') appDispatch(addDrafts(data));
                    else appDispatch(editDrafts(data));
                    setGetBlogpostId(data._id);
                    setBlogpostStatus('draft');
                    setInputAreasStatus('empty');
                };
            });
    };

    const handleDeleteDraft = async (_id: string, clearInput?: boolean) => {
        const url = '/api/profile/drafts/delete';
        const copy = { _id };

        await patchDraftData<Blogpostprops>(url, copy)
            .then((data) => {
                if (data) {
                    console.log(data)
                    appDispatch(deleteDrafts({ _id }));
                    setBlogpostStatus('deleted');
                    setInputAreasStatus('empty');
                    clearInput && handleClearInputsArea();
                };
            });
    };

    return <div className='space-y-4'>
        {/* blog post menus */}
        <Menu
            id=""
            childClass=""
            parentClass="flex gap-4 max-w-full overflow-auto py-2"
            arrOfMenu={blogpostMenu}
        />
        {/* body */}
        <Trythistexteditor
            id='blogpost-body-text-editor'
            placeHolder="Start typing..."
            InputWrapperClassName="w-full max-w-full border-2 border-t-0 rounded-b-md p-3"
            InputClassName="w-full max-w-full min-h-[480px] overflow-auto"
            textEditorWrapperClassName="sticky top-0.5 rounded-t-md border-2 p-3 shadow-inner z-50"
            createNewText={{ IsNew: false, content: bodyContent }}
            useTextEditors={true}
            inputTextAreaFocus={true}
            setGetContent={(content) => {

                (() => { // get the first 12 words from the body as the title of the blogpost
                    const firstTenWords = content.text.split(' ', 12);
                    if (firstTenWords.length >= 12) {
                        return;
                    }; 

                    setTitleContent(content);

                    if (blogpostStatus !== 'published' &&
                        blogpostStatus !== 'unpublished') {
                        setSlug(handleDesignSlug(content.text, '-'));
                    };

                    if (content.text.trim()) { // check for new values add in title input
                        setInputAreasStatus('new');
                    } else {
                        setInputAreasStatus('empty');
                    };

                })();

                setBodyContent(content);

                if (blogpostStatus === 'published' || blogpostStatus === 'unpublished') { // check for change in body after puplishing 
                    setInputAreasStatus('editing')
                };
            }}
        />
        <div id='blogpost-features' className='flex flex-wrap justify-between items-start gap-4 py-6'>
            <div id='catigory' className='space-y-1'>
                <span>Catigory</span>
                {
                    catigory.map((item, index) =>
                        <div key={index} className='flex items-center gap-4'>
                            <Input
                                id='catigory'
                                inputName=''
                                type='text'
                                labelClass='text-base'
                                inputClass='text-sm w-full border-2 p-1 rounded-md outline-blue-700 mt-2'
                                value={catigory[index]?.cat || ''}
                                setValue={(value) => {
                                    const getValue = value as string;

                                    setCatigory((pre) => pre[index] ?
                                        [...pre.map((innerItem) => innerItem._id === item._id ? { ...innerItem, cat: getValue } : innerItem)] :
                                        pre);

                                    if (blogpostStatus === 'published' ||
                                        blogpostStatus === 'unpublished') {// check for change in catigory after puplishing 
                                        setInputAreasStatus('editing')
                                    };
                                }}
                                error={{ isTrue: false, errorClass: '', errorMsg: '' }}
                                placeHolder='Catigory'
                            />
                            <Button
                                id='add-more-catigory'
                                buttonClass=''
                                children={<FaPlus size={10} />}
                                handleClick={() => setCatigory((pre) => [...pre, { _id: index + Date.now(), cat: '' }])}
                            />
                            {index > 0 ? <Button
                                id='delete-catigory'
                                buttonClass=''
                                children={<FaMinus size={10} />}
                                handleClick={() => {
                                    setCatigory((pre) => [...pre.filter(innerItem => innerItem._id != item._id)]);
                                }}
                            /> :
                                null}
                        </div>
                    )
                }
            </div>
            {/* img */}
            <div id='display-image' className='relative'>
                <Displayimage
                    id='blogpost-display-img'
                    imageId={displayImage || ' '}
                    parentClass='h-[60px] w-[60px]'
                    imageClass='object-fit rounded cursor-pointer'
                    placeHolder={addImagePlaceHolder}
                    onClick={() => setDisplayBlogpostImagePopup(true)}
                />
                <span
                    onClick={() => setDisplayImage(' ')}
                    className={`${displayImage.trim() ? 'inline' : 'hidden'} absolute top-1 right-1 cursor-pointer`}>
                    <RxCross2 size={20} />
                </span>
            </div>
        </div>
        <Input
            inputName='Permalink'
            labelClass='text-base'
            inputClass='text-sm w-full border-2 p-2 rounded-md outline-blue-700 mt-2'
            type='test'
            id='blogpost-slug'
            value={slug}
            setValue={(value) => {
                const getValue = value as string;
                if (blogpostStatus !== 'published' &&
                    blogpostStatus !== 'unpublished') {
                    setSlug(handleDesignSlug(getValue, '-'));
                };

                if (blogpostStatus !== 'published' && getValue.trim()) {
                    setInputAreasStatus('new');
                } else {
                    setInputAreasStatus('empty');
                };
            }}
            error={{ isTrue: false, errorClass: '', errorMsg: '' }}
            placeHolder='Blogpost slug'
        />
        <Popup
            id="blogpost-display-choose-Image-popup"
            title="Choose Image"
            Children={
                <div className="flex justify-between items-center border-y py-4">
                    <div className="flex-1 flex justify-start border-r pl-2">
                        <Button
                            id="choose-image-from-library"
                            buttonClass=""
                            children="Form library"
                            handleClick={() => setImageGalary({ displayImageGalary: 'blogpost-images-1', selectedImages: [] })}
                        />
                    </div>
                    <div className="flex-1 flex justify-end pr-2">
                        <Fileinput
                            id="computer"
                            placeHolder='From computer'
                            type='image'
                            accept='image/png/svg'
                            setValue={(value) => {
                                getMedia({
                                    files: value,
                                    fileType: 'image',
                                    getValue: async ({ dataUrl, tempUrl, file }) => {
                                        const image: Imageprops | null = await createImage({ fieldname: 'blogpostimage', file, url: '/api/image/blogpostimage/add' });
                                        if (image) {
                                            setDisplayImage(image._id);
                                            appDispatch(addBlogpostImages(image))

                                            if (blogpostStatus === 'published' ||
                                                blogpostStatus === 'unpublished') { // check for change in displayimage after puplishing 
                                                setInputAreasStatus('editing')
                                            };
                                        };
                                    },
                                });
                                setDisplayBlogpostImagePopup(false);
                            }}
                        />
                    </div>
                </div>
            }
            togglePopUp={displayBlogpostImagePopup}
            setTogglePopUp={setDisplayBlogpostImagePopup}
        />
        <Dialog
            id="blogpost-image-galary-dialog-1"
            parentClass=""
            childClass="container relative w-full h-full py-10"
            currentDialog="blogpost-images-1"
            dialog={imageGalary.displayImageGalary === 'blogpost-images-1' ? 'blogpost-images-1' : ''}
            setDialog={() => null}
            children={<>
                <Displayblogpostimagessec selection={true} />
                <div className='absolute bottom-1 right-1 flex items-center gap-6'>
                    <Button
                        id='add-selected-image-galary-btn'
                        buttonClass='text-white px-2.5 py-1.5 rounded bg-green-800'
                        children={`(${imageGalary.selectedImages?.length || 0}) Add`}
                        handleClick={() => {
                            if (imageGalary.selectedImages?.length == 0) return;
                            setDisplayImage(imageGalary.selectedImages[0]);
                            setImageGalary({ selectedImages: [], displayImageGalary: '' });
                            if ((blogpostStatus === 'published' || blogpostStatus === 'unpublished') &&
                                (displayImage.trim() !== imageGalary.selectedImages[0].trim())) { // check for change in displayimage after puplishing 
                                setInputAreasStatus('editing')
                            };
                            setDisplayBlogpostImagePopup(false);
                        }}
                    />
                    <Button
                        id='close-image-galary-btn'
                        buttonClass='text-white px-2 py-1.5 rounded bg-red-800'
                        children={'Close'}
                        handleClick={() => {
                            setImageGalary({ displayImageGalary: '', selectedImages: [] });
                            setDisplayBlogpostImagePopup(true);
                        }}
                    />
                </div>
            </>}
        />
        <Screenloading loading={(loadingPostBlogpost
            || LoadingPatchBlogpostData ||
            loadingDeleteBlogpost ||
            loadingPatchDraftData ||
            loaidngCreateImage)} />
    </div>
};

export default Createblogpostsec;

