import { useState } from "react";
import Dropdownmenuwrapper from "../assests/Dropdownmenuwrapper";
import { imageCmd } from "../cmds";
import { Button, Dialog, Displayimage, Fileinput, Input, Popup, Screenloading } from "../../components";
import { useCreateImage, useGetLocalMedia, useImageGalary, } from "../../hooks";
import { RiFolderImageLine } from "react-icons/ri";
import addImagePlaceHolder from '../../assert/addimage.svg';
import { Imageprops } from "../../entities";
import { addBlogpostImages } from "../../redux/slices/userImageSlices";
import { useAppDispatch } from "../../redux/slices";
import { Displayblogpostimagessec } from "../../sections";
import { RxCross2 } from "react-icons/rx";
import { endPiont } from "../../hooks/utilities";

type Props = {
    onInputAreaChange: () => void
    openDropDownMenu: string
    setOpenDropDownMenu: React.Dispatch<React.SetStateAction<string>>
};

const Image = ({
    onInputAreaChange,
    openDropDownMenu,
    setOpenDropDownMenu,
}: Props) => {

    const [displayTextEditorImagePopup, setDisplayTextEditorImagePopup] = useState(false);
    const [inputUrl, setInputUrl] = useState('');
    const [imageFileUrl, setImageFileUrl] = useState('');
    const [imageHeight, setImageHeight] = useState(100);
    const [imageWight, setImageWight] = useState(100);
    const [imagePosition, setImagePosition] = useState('object-contain');
    const [imageAlt, setImageAlt] = useState('');

    const getMedia = useGetLocalMedia();
    const { createImage, loading } = useCreateImage();
    const appDispatch = useAppDispatch();

    const { imageGalary, setImageGalary } = useImageGalary();

    const handleInsertImage = (inputUrl: string, alt: string, imageHeight: string, imageWight: string, value: string[]) => {
        if (!inputUrl) return;
        imageCmd(inputUrl, alt, imageHeight, imageWight, value);
        onInputAreaChange();
        setOpenDropDownMenu('');
    };

    return <div id='texteditor-add-image'>
        <button className='block cursor-pointer'
            onClick={() => setOpenDropDownMenu(openDropDownMenu === 'image' ? '' : 'image')}>
            < RiFolderImageLine size={21} />
        </button>
        <Dropdownmenuwrapper
            openDropDownMenu={openDropDownMenu}
            menuName='image'
            Children={
                <div className='space-y-5 p-3 border shadow-sm'>
                    <div id="add-image" className='space-y-3'>
                        <Input
                            id={'image-text-url-input'}
                            type={'text'}
                            inputName={'Add url'}
                            inputClass={'max-w-[190px] text-blue-700 py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                            labelClass={''}
                            value={inputUrl}
                            setValue={(value) => { setImageFileUrl(''); setInputUrl(value as string) }}
                            placeHolder={'https://www.example.com'}
                        />
                        <div className="relative w-[50px]">
                            <Displayimage
                                id='post-image'
                                imageId={imageFileUrl || ' '}
                                imageUrl={inputUrl || ' '}
                                parentClass='h-[40px] w-[40px] mt-1'
                                imageClass={`rounded cursor-pointer ${imagePosition}`}
                                placeHolder={addImagePlaceHolder}
                                onClick={() => setDisplayTextEditorImagePopup(true)}
                            />
                            <span
                                onClick={() => { setInputUrl(' '); setImageFileUrl('') }}
                                className={`${(imageFileUrl || inputUrl).trim() ? 'inline' : 'hidden'} absolute top-1 right-1 cursor-pointer`}>
                                <RxCross2 size={15} />
                            </span>
                        </div>
                    </div>
                    <div id="image-infor" className='space-y-4'>
                        <Input
                            id={'image-alt-input'}
                            type={'text'}
                            inputName={'Alt'}
                            inputClass={'max-w-[180px] py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                            labelClass={''}
                            value={imageAlt}
                            setValue={(value) => setImageAlt(value as string)}
                            placeHolder={'this image...'}
                        />
                        <div id="image-shape-setting" className='flex items-center gap-3'>
                            <Input
                                id={'image-width-input'}
                                type={'number'}
                                inputName={'Width'}
                                inputClass={'max-w-[80px] py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                                labelClass={''}
                                value={imageWight}
                                setValue={(value) => setImageWight(value as number)}
                                placeHolder={'width'}
                            />
                            <Input
                                id={'image-height-input'}
                                type={'number'}
                                inputName={'Height'}
                                inputClass={'max-w-[80px] py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                                labelClass={''}
                                value={imageHeight}
                                setValue={(value) => setImageHeight(value as number)}
                                placeHolder={'Height'}
                            />
                        </div>
                    </div>
                    <div id="image-position-setting" className='flex item-center gap-5'>
                        <Input
                            id={'image-contain-input'}
                            type={'checkbox'}
                            inputName={'Contain'}
                            inputClass={'cursor-pointer'}
                            labelClass={''}
                            value={imagePosition}
                            setValue={(value) => setImagePosition('object-contain')}
                            checked={imagePosition === 'object-contain' ? true : false}
                        />
                        <Input
                            id={'image-cover-input'}
                            type={'checkbox'}
                            inputName={'Cover'}
                            inputClass={'cursor-pointer'}
                            labelClass={''}
                            value={imagePosition}
                            setValue={(value) => setImagePosition('object-cover')}
                            checked={imagePosition === 'object-cover' ? true : false}
                        />
                        <Input
                            id={'image-fill-input'}
                            type={'checkbox'}
                            inputName={'Fill'}
                            inputClass={'cursor-pointer'}
                            labelClass={''}
                            value={imagePosition}
                            setValue={(value) => setImagePosition('object-fill')}
                            checked={imagePosition === 'object-fill' ? true : false}
                        />
                    </div>
                    <div className='flex justify-end items-center gap-3 '>
                        <button className='px-2 py-[.2rem] bg-red-800 text-white rounded shadow-sm' onClick={() => setOpenDropDownMenu('')}>
                            Close
                        </button>
                        <button className='px-2 py-[.2rem] bg-green-800 text-white rounded shadow-sm'
                            onClick={() => handleInsertImage(inputUrl || endPiont + '/api/image/' + imageFileUrl, imageAlt, imageHeight + 'px', imageWight + 'px', ['h-[' + imageHeight + 'px]', 'w-[' + imageWight + 'px]', imagePosition, 'inline'])} >
                            Add image
                        </button>
                    </div>
                    <Popup
                        id="blogpost-display-image-popup"
                        title="Choose Image"
                        Children={
                            <div className="flex justify-between items-center border-y py-4">
                                <div className="flex-1 flex justify-center border-r">
                                    <Button
                                        id="choose-image-from-library"
                                        children="Library"
                                        buttonClass=""
                                        handleClick={() => setImageGalary({ displayImageGalary: 'blogpost-images-2', selectedImages: [] })}
                                    />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <Fileinput
                                        id="computer"
                                        type="image"
                                        placeHolder='Computer'
                                        accept="image/png, image/gif, image/jpeg"
                                        setValue={(value) => {
                                            getMedia({
                                                files: value,
                                                fileType: 'image',
                                                getValue: async ({ dataUrl, tempUrl, file }) => {
                                                    const image: Imageprops | null = await createImage({ fieldname: 'blogpostimage', file, url: '/api/image/blogpostimage/add' });
                                                    if (image) {
                                                        setInputUrl('');
                                                        setImageFileUrl(image._id);
                                                        appDispatch(addBlogpostImages(image))
                                                    };
                                                },
                                            });
                                            setDisplayTextEditorImagePopup(false);
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        togglePopUp={displayTextEditorImagePopup}
                        setTogglePopUp={setDisplayTextEditorImagePopup}
                    />
                    <Dialog
                        id="blogpost-image-galary-dialog-2"
                        parentClass=""
                        childClass="container relative w-full h-full py-4"
                        currentDialog="blogpost-images-2"
                        dialog={imageGalary.displayImageGalary === 'blogpost-images-2' ? 'blogpost-images-2' : ''}
                        setDialog={() => null}
                        children={<>
                            <Displayblogpostimagessec selection={true} />
                            <div className='w-full flex justify-end gap-4 mt-6'>
                                <Button
                                    id='add-selected-image-galary-btn'
                                    buttonClass='text-white px-2.5 py-1.5 rounded bg-green-800'
                                    children={`(${imageGalary.selectedImages?.length || 0}) Add`}
                                    handleClick={() => {
                                        if (imageGalary.selectedImages?.length == 0) return;
                                        setImageFileUrl(imageGalary.selectedImages[0]);
                                        setImageGalary((pre) => pre ? { ...pre, displayImageGalary: '' } : pre);
                                        setDisplayTextEditorImagePopup(false);
                                    }}
                                />
                                <Button
                                    id='close-image-galary-btn'
                                    buttonClass='text-white px-2 py-1.5 rounded bg-red-800'
                                    children={'Close'}
                                    handleClick={() => {
                                        setImageGalary({ displayImageGalary: '', selectedImages: [] });
                                    }}
                                />
                            </div>
                        </>}
                    />
                </div>
            } />

        <Screenloading loading={loading} />
    </div>
};

export default Image;
