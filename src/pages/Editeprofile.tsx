import { useEffect, useState } from "react";
import { Backwardnav, Button, Displayimage, Fileinput, Input, Popup, Screenloading, Selectinput } from "../components";
import { useCreateImage, useGetLocalMedia, usePatchData } from "../hooks";
import { editProfile } from "../redux/slices/userProfileSlices";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { Imageprops, Userprops } from "../entities";
import { addAvaters, increaseTotalNumberOfUserAvaters } from "../redux/slices/userImageSlices";
import avaterPlaceholder from '../assert/avaterplaceholder.svg'
import Trythistexteditor from '../custom-text-editor/App'
import { deleteAll } from "../custom-text-editor/settings";

const Editeprofile = () => {

    const { userProfile: {
        data: getProfileData,
        loading: getProfileDataLoading,
    } } = useAppSelector((state) => state.userProfileSlices); // get user data

    const [dateOfBirth, setDateOfBirth] = useState('');
    const [website, setWebsite] = useState('');
    const [country, setCountry] = useState('');
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState<{ _html: string, text: string }>({ _html: '', text: '' });
    const [sex, setSex] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [imageUrl, setImageUrl] = useState(' ');

    const getMedia = useGetLocalMedia();
    const { createImage, loading: loadingCreateImage } = useCreateImage();
    const { patchData: patchEditData, loading: loadingEditData } = usePatchData();

    const appDispatch = useAppDispatch();

    const [toggleEditImagePopUp, setToggleEditImagePopUp] = useState(false);

    const clearBioInputArea = () => {
        const contentEditAbleELe = document.querySelectorAll("[contenteditable]");  //Get all contenteditable div on page
        contentEditAbleELe.forEach((element) => {
            deleteAll(element as HTMLDivElement)
        });
    };

    const handleEditProfile = async () => {
        if (loadingEditData) return;
        const body = {
            displayImage: imageUrl,
            email,
            name: fullName,
            dateOfBirth,
            country,
            sex,
            website,
            bio: bio._html || '',
            phoneNumber,
        };

        const url = '/api/editprofile';
        await patchEditData<Userprops>(url, body)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                appDispatch(editProfile(data));
            });
    };

    const handleSaveAllChanges = () => {
        handleEditProfile();
    };

    const handleSaveSingleChanges = () => {
        handleEditProfile();
    };

    const handleFetchDefaultProfileDatails = () => {
        if (!getProfileData) return;
        const {
            displayImage, email, name, dateOfBirth, country, sex, website, bio, phoneNumber,
        } = getProfileData;

        setDateOfBirth(dateOfBirth || '');
        setImageUrl(displayImage || '');
        setFullName(name || '');
        setCountry(country || '');
        setWebsite(website || '');
        setBio({ _html: bio || ` `, text: ` ` });
        setSex(sex || '');
        setPhoneNumber(phoneNumber?.toString() || '');
        setEmail(email || '');
    };

    const handleCheckChangesHappens = (previewContent: string, newContent: string) => {
        let changesHappens = false;
        if (previewContent.toLocaleLowerCase().trim() !== newContent.toLocaleLowerCase().trim()) {
            changesHappens = true;
        } else {
            changesHappens = false
        };
        return changesHappens;
    };

    useEffect(() => {
        handleFetchDefaultProfileDatails()
    }, [getProfileData?.userName]);

    return <div>
        <Backwardnav pageName="Edite profile" />
        {!getProfileDataLoading && bio._html?
            <div id="profile-edit-form-wrapper" className="font-text space-y-20">
                <div className="w-full space-y-8 max-w-[480px]">
                    <div id="avater" className="flex gap-6">
                        <Displayimage
                            id="advater"
                            placeHolder={avaterPlaceholder}
                            imageId={imageUrl || ''}
                            parentClass="h-[70px] w-[70px] cursor-pointer"
                            imageClass=" rounded-full object-contain"
                            onClick={() => setToggleEditImagePopUp(true)}
                        />
                        <div className="flex items-center gap-3">
                            <Button
                                id="avater-cancle-btn"
                                buttonClass="border rounded-md p-1 "
                                children="Cancle"
                                handleClick={() => setImageUrl('')}
                            />
                            <Button
                                id="avater-save-btn"
                                buttonClass={`${handleCheckChangesHappens((getProfileData?.displayImage || ''), imageUrl) ? 'block' : 'hidden'
                                    } border rounded-md p-1`}
                                children="Save"
                                handleClick={() => handleSaveSingleChanges()}
                            />
                        </div>
                    </div>
                    <div id="full-name" className="flex items-end gap-6">
                        <Input
                            id="Full-name"
                            type="text"
                            inputName="Name"
                            placeHolder="full name..."
                            inputClass="w-full text-sm outline-green-400 border-2 rounded-md p-2 mt-2"
                            value={fullName}
                            setValue={(value) => setFullName(value as string)}
                            labelClass="w-full text-base"
                        />
                        <div className="flex items-center gap-4">
                            <Button
                                id="full-name-cancle-btn"
                                buttonClass="border rounded-md p-1 "
                                children="Cancle"
                                handleClick={() => setFullName('')}
                            />
                            <Button
                                id="full-name-save-btn"
                                buttonClass={`${handleCheckChangesHappens((getProfileData?.name || ''), fullName) ? 'block' : 'hidden'
                                    } border rounded-md p-1`}
                                children="Save"
                                handleClick={handleSaveSingleChanges}
                            />
                        </div>
                    </div>
                    <div id="bio" className="flex items-start gap-6">
                        <Trythistexteditor
                            id='bio-text-editor'
                            placeHolder="About you..."
                            InputWrapperClassName="max-w-[400px] border-2 p-3 rounded-md overflow-y-auto"
                            InputClassName="max-w-full min-h-[100px] max-h-[140px]"
                            createNewText={{ IsNew: false, content: bio }}
                            useTextEditors={{ useInlineStyling: true }}
                            textEditorWrapperClassName="mb-2"
                            inputTextAreaFocus={false}
                            setGetContent={setBio}
                        />
                        <div className="flex items-center gap-4">
                            <Button
                                id="bio-cancle-btn"
                                buttonClass="border rounded-md p-1"
                                children="Cancle"
                                handleClick={()=> {clearBioInputArea(); setBio({ _html: ` `, text: ` ` })}}
                            />
                            <Button
                                id="bio-save-btn"
                                buttonClass={`${handleCheckChangesHappens((getProfileData?.bio || ''), bio._html) ? 'block' : 'hidden'
                                    } border rounded-md p-1`}
                                children="Save"
                                handleClick={handleSaveSingleChanges}
                            />
                        </div>
                    </div>
                    <div id="birth-day" className="flex items-end gap-6">
                        <Input
                            id="birth-day"
                            type="date"
                            inputName="Date of birth"
                            placeHolder="full name"
                            inputClass="w-full text-sm outline-green-400 border-2 rounded-md p-2 mt-2"
                            value={dateOfBirth}
                            setValue={(value) => setDateOfBirth(value as string)}
                            labelClass="w-full text-base"
                        />
                        <div className="flex items-center gap-4">
                            <Button
                                id="date-of-birth-cancle-btn"
                                buttonClass="border rounded-md p-1"
                                children="Cancle"
                                handleClick={() => setDateOfBirth('')}
                            />
                            <Button
                                id="date-of-birth-save-btn"
                                buttonClass={`${handleCheckChangesHappens((getProfileData?.dateOfBirth || ''), dateOfBirth) ? 'block' : 'hidden'
                                    } border rounded-md p-1`}
                                children="Save"
                                handleClick={handleSaveSingleChanges}
                            />
                        </div>
                    </div>
                    <div id="sex" className="flex justify-between items-end gap-6">
                        <Selectinput
                            id="gender"
                            labelName="Sex"
                            parentClass="w-full text-start"
                            placeHolderClass="text-base border-2 p-2 mt-2"
                            listWrapperClass=""
                            arrOfList={['male', 'female', 'others']}
                            selectedValue={sex}
                            setSeletedValue={(value) => setSex(value)}
                        />
                        <div className="flex justify-between items-center gap-4">
                            <Button
                                id="sex-cancle-btn"
                                buttonClass="border rounded-md p-1"
                                children="Cancle"
                                handleClick={() => setSex('')}
                            />
                            <Button
                                id="sex-save-btn"
                                buttonClass={`${handleCheckChangesHappens((getProfileData?.sex || ''), sex) ? 'block' : 'hidden'
                                    } border rounded-md p-1`}
                                children="Save"
                                handleClick={handleSaveSingleChanges}
                            />
                        </div>
                    </div>
                    <div id="country" className="flex justify-between items-end gap-4">
                        <Selectinput
                            id="country"
                            labelName="Country"
                            parentClass="w-full"
                            listWrapperClass="text-center"
                            placeHolderClass="text-base text-start p-2 mt-2"
                            arrOfList={[
                                'Nigeria',
                                'United States',
                                'Canada',
                                'Mexico',
                                'United Kingdom',
                                'Germany',
                                'France',
                                'Italy',
                                'Spain',
                                'Japan',
                                'China',
                                'India',
                                'Australia',
                                'Brazil',
                                'South Africa',
                                'Russia',
                                'South Korea',
                                'Argentina',
                                'Egypt',
                                'Turkey',
                                'Saudi Arabia',
                            ]}
                            selectedValue={country}
                            setSeletedValue={(value) => setCountry(value)}
                        />
                        <div className="flex items-center gap-4">
                            <Button
                                id="country-cancle-btn"
                                buttonClass="border rounded-md p-1"
                                children="Cancle"
                                handleClick={() => setCountry('')}
                            />
                            <Button
                                id="country-save-btn"
                                buttonClass={`${handleCheckChangesHappens((getProfileData?.country || ''), country) ? 'block' : 'hidden'
                                    } border rounded-md p-1`}
                                children="Save"
                                handleClick={handleSaveSingleChanges}
                            />
                        </div>
                    </div>
                    <div id="email" className="flex items-end gap-6">
                        <Input
                            id="email"
                            type="email"
                            inputName="Email"
                            placeHolder="Email..."
                            inputClass="w-full text-sm outline-green-400 border-2 rounded-md p-2 mt-2"
                            value={email}
                            setValue={(value) => setEmail(value as string)}
                            labelClass="w-full text-base"
                        />
                        <div className="flex items-center gap-4">
                            <Button
                                id="email-cancle-btn"
                                buttonClass="border rounded-md p-1"
                                children="Cancle"
                                handleClick={() => setEmail('')}
                            />
                            <Button
                                id="email-save-btn"
                                buttonClass={`${handleCheckChangesHappens((getProfileData?.email || ''), email) ? 'block' : 'hidden'
                                    } border rounded-md p-1`}
                                children="Save"
                                handleClick={handleSaveSingleChanges}
                            />
                        </div>
                    </div>
                    <div id="phone-number" className="flex items-end gap-6">
                        <Input
                            id="phone-number"
                            type="number"
                            inputName="Phone number"
                            placeHolder="+234..."
                            inputClass="w-full text-sm outline-green-400 border-2 rounded-md p-2 mt-2 phone-number"
                            value={phoneNumber}
                            setValue={(value) => setPhoneNumber(value as string)}
                            labelClass="w-full text-base"
                        />
                        <div className="flex items-center gap-4">
                            <Button
                                id="phone-number-cancle-btn"
                                buttonClass="border rounded-md p-1"
                                children="Cancle"
                                handleClick={() => setPhoneNumber('')}
                            />
                            <Button
                                id="phone-number-save-btn"
                                buttonClass={`${handleCheckChangesHappens((getProfileData?.phoneNumber?.toString() || ''), phoneNumber) ? 'block' : 'hidden'
                                    } border rounded-md p-1`}
                                children="Save"
                                handleClick={handleSaveSingleChanges}
                            />
                        </div>
                    </div>
                    <div id="website-link" className="flex items-end gap-6">
                        <Input
                            id="website-link"
                            type="text"
                            inputName="Website link"
                            placeHolder="link..."
                            inputClass="w-full text-sm outline-green-400 border-2 rounded-md p-2 mt-2"
                            value={website}
                            setValue={(value) => setWebsite(value as string)}
                            labelClass="w-full text-base"
                        />
                        <div className="flex items-center gap-4">
                            <Button
                                id="website-link-cancle-btn"
                                buttonClass="border rounded-md p-1"
                                children="Cancle"
                                handleClick={() => setWebsite('')}
                            />
                            <Button
                                id="website-link-save-btn"
                                buttonClass={`${handleCheckChangesHappens((getProfileData?.website || ''), website) ? 'block' : 'hidden'
                                    } border rounded-md p-1`}
                                children="Save"
                                handleClick={handleSaveSingleChanges}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    <Button
                        id="save-all-btn"
                        buttonClass="text-white border rounded-md transition-color bg-green-800 active:bg-green-400 px-2 py-1"
                        children="Save all changes"
                        handleClick={handleSaveAllChanges}
                    />
                </div>
                <Popup
                    id="edit-profile-avater-popup"
                    title="Choose Image"
                    Children={
                        <div className="flex justify-between items-center border-y py-4">
                            <div className="flex-1 flex justify-start border-r pl-2">
                                <Button
                                    id="choose-image-from-library"
                                    buttonClass=""
                                    children="Form library"
                                />
                            </div>
                            <div className="flex-1 flex justify-end pr-2">
                                <Fileinput
                                    name=""
                                    id="choose-local-image"
                                    type="image"
                                    placeHolder='From computer'
                                    accept="image/*"
                                    setValue={(value) => {
                                        getMedia({
                                            files: value,
                                            fileType: 'image',
                                            getValue: async ({ dataUrl, tempUrl, file }) => {
                                                setToggleEditImagePopUp(false);
                                                const image: Imageprops | null = await createImage({ file, url: '/api/image/avater/add', fieldname: 'avater' })
                                                if (image) {
                                                    setImageUrl(image._id);
                                                    appDispatch(addAvaters(image));
                                                    appDispatch(increaseTotalNumberOfUserAvaters(1));
                                                }
                                                setToggleEditImagePopUp(false);
                                            }
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    }
                    togglePopUp={toggleEditImagePopUp}
                    setTogglePopUp={setToggleEditImagePopUp}
                />
            </div> :
            <div>
                <div className="space-y-10 animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-slate-100 rounded-full"></div>
                        <div className="h-6 w-[50px] bg-slate-100 rounded-sm"></div>
                    </div>
                    {Array(8).fill('').map((_, index) =>
                        <div className="flex items-star gap-4" key={index} >
                            <div className="h-10 w-[240px] bg-slate-100 rounded-sm"></div>
                            <div className="h-6 w-[50px] bg-slate-100 rounded-sm"></div>
                        </div>
                    )}
                </div>
            </div>
        }
        <Screenloading loading={(loadingEditData || loadingCreateImage)} />
    </div>
};

export default Editeprofile;

