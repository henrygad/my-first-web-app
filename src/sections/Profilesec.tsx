import { useState } from 'react';
import { Imageprops, Blogpostprops, Commentprops, Userprops } from '../entities';
import { Button, Dialog, Displayimage, Followbutton, Menu, Profilepageplaceholder, Tab, Userdotnav } from '../components';
import Blogpostsec from './Blogpostsec';
import CommentSec from './CommentSec';
import { useConvertRawDate, useSanitize, useUserIsLogin } from '../hooks';
import Followerssec from './Followerssec';
import Followingsec from './Followingsec';
import Interentssec from './Interentssec';
import { Link } from 'react-router-dom';
import Avatersec from './Avatersec';
import avaterPlaceholder from '../assert/avaterplaceholder.svg'
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Page404 } from '../pages';

type Props = {
  profileLoading: boolean
  profileError: string
  profileData: Userprops

  profileBlogposts: Blogpostprops[]
  profileBlogpostsLoading: boolean
  profileBlogpostsError: string
  handleServerLoadMoreBlogposts: () => void
  moreBlogpostsLoading: boolean
  moreBlogpostsError: string
  numberOfBlogposts: number
  numberOfBlogpostsLoading: boolean

  profileCommentsData: Commentprops[]
  profileCommentsLoading: boolean
  profileCommentsError: string
  handleServerLoadMoreComments: () => void
  moreCommentsLoading: boolean
  moreCommentsError: string
  numberOfComments: number
  numberOfCommentsLoading: boolean


  profileAvatersData: Imageprops[],
  profileAvatersLoading: boolean,
  profileAvatersError: string,
  handleServerLoadMoreAvaters: () => void,
  moreAvatersLoading: boolean,
  moreAvatersError: string,
  numberOfAvaters: number
  numberOfAvatersLoading: boolean
};

const Profilesec = (
  {
    profileData,
    profileLoading,

    profileBlogposts,
    profileBlogpostsLoading,
    profileBlogpostsError,
    handleServerLoadMoreBlogposts,
    moreBlogpostsLoading,
    moreBlogpostsError,
    numberOfBlogposts,
    numberOfBlogpostsLoading,

    profileCommentsData,
    profileCommentsLoading,
    profileCommentsError,
    handleServerLoadMoreComments,
    moreCommentsLoading,
    moreCommentsError,
    numberOfComments,
    numberOfCommentsLoading,

    profileAvatersData,
    profileAvatersLoading,
    profileAvatersError,
    handleServerLoadMoreAvaters,
    moreAvatersLoading,
    moreAvatersError,
    numberOfAvaters,
    numberOfAvatersLoading,
  }: Props) => {
  const { loginStatus: { loginUserName } } = useUserIsLogin();
  const isAccountOwner = profileData && profileData?.userName === loginUserName;

  const sanitizeHTML = useSanitize();
  const [profileDialog, setProfileDialog] = useState(' ');

  const [currentProfileDialogTab, setCurreentProfileDialogTab] = useState('followerssec');
  const [currentProfileContentTab, setCurrentProfileContentTab] = useState<string>(() => localStorage.getItem('currentProfileContentTab') || 'blogpostssec');

  const handleReadableDate = useConvertRawDate();

  const profileAtivitiesTabs = [
    {
      menu: {
        name: 'blogpostssec',
        content: <Button children={` Post (${!numberOfBlogpostsLoading ? numberOfBlogposts : 0}) `}
          buttonClass='' handleClick={() => handleCurrentProfileContentTab('blogpostssec')} />,
      },
      tab: {
        name: 'blogpostssec',
        content: <Blogpostsec
          profileBlogposts={profileBlogposts}
          profileBlogpostsLoading={profileBlogpostsLoading}
          profileBlogpostsError={profileBlogpostsError}
          handleServerLoadMoreBlogposts={handleServerLoadMoreBlogposts}
          moreBlogpostsLoading={moreBlogpostsLoading}
          moreBlogpostsError={moreBlogpostsError}
          numberOfBlogposts={numberOfBlogposts}
        />
      }
    },
    {
      menu: {
        name: 'commentssec',
        content: <Button children={`Comment (${!numberOfCommentsLoading ? numberOfComments : 0})`}
          buttonClass='' handleClick={() => handleCurrentProfileContentTab('commentssec')} />,
      },
      tab: {
        name: 'commentssec',
        content: <CommentSec
          profileCommentsData={profileCommentsData}
          profileCommentsLoading={profileCommentsLoading}
          profileCommentsError={profileCommentsError}
          handleServerLoadMoreComments={handleServerLoadMoreComments}
          moreCommentsLoading={moreCommentsLoading}
          moreCommentsError={moreCommentsError}
          numberOfComments={numberOfComments}
        />
      },
    },
    {
      menu: {
        name: 'advatarssec',
        content: <Button children={`Profile image (${!numberOfAvatersLoading ? numberOfAvaters : 0}) `}
          buttonClass='' handleClick={() => handleCurrentProfileContentTab('advatarssec')} />,
        tab: <div>Profile image</div>,
      },
      tab: {
        name: 'advatarssec',
        content: <Avatersec
          profileAvatersData={profileAvatersData}
          profileAvatersLoading={profileAvatersLoading}
          profileAvatersError={profileAvatersError}
          handleServerLoadMoreAvaters={handleServerLoadMoreAvaters}
          moreAvatersLoading={moreAvatersLoading}
          moreAvatersError={moreAvatersError}
          numberOfAvaters={numberOfAvaters}
        />
      },
    },
  ];

  const handleCurrentProfileContentTab = (sec: string) => {
    setCurrentProfileContentTab(sec);
    localStorage.setItem('currentProfileContentTab', sec);
  };

  return <div>
    {
      !profileLoading ?
        <>
          {
            (profileData) &&
              Object.keys(profileData).length ?
              <div id='profile-data-display-wrapper'>
                <div id='profile-datails' className=''>
                  {/* display profile detail */}
                  <div className='flex-1 space-y-1'>
                    {/* profile data */}
                    <div id='profile-avatar' className='flex justify-between gap-4'>
                      <div>
                        <Link to={isAccountOwner ? '/editprofile' : ''} className='block w-14'>
                          <Displayimage
                            placeHolder={avaterPlaceholder}
                            id={'avater'}
                            imageId={profileData?.displayImage}
                            parentClass='h-14 w-14'
                            imageClass='object-contain rounded-full'
                            onClick={() => ''}
                          />
                        </Link>
                        <div>
                          <span id='name' className='block text-base font-semibold' >
                            {profileData?.name}
                          </span>
                          <span id='userName' className='text-sm opacity-50 '>
                            {profileData?.userName}
                          </span>
                        </div>
                      </div>
                      <div className='relative flex justify-end items-start gap-9'>
                        
                        {!isAccountOwner ?
                          <Followbutton userNameToFollow={profileData?.userName} /> :
                          null
                        }
                        <div className='relative -mt-4'>
                          <Userdotnav
                            userName={profileData?.userName}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-wrap justify-between items-center  gap-4 '>
                      <div >
                        <div id='bio' className='font-text'>
                          <span className='block md:text-base text-wrap max-w-[480px]'
                            dangerouslySetInnerHTML={sanitizeHTML(profileData?.bio || '')}></span>
                        </div>
                        <div id='sex-dateOfBirth' className='flex flex-col gap-1 text-sm'>
                          <span className=' capitalize' >{profileData?.sex || ''}</span>
                          <span >{handleReadableDate(profileData?.dateOfBirth || '')}</span>
                        </div>
                        <div id="email-phoneNumber-website" className='flex flex-col gap-1 text-sm'>
                          <div className='mt-1'></div>
                          <span>{profileData?.email || ''}</span>
                          <span>{profileData?.phoneNumber || ''}</span>
                          <a href={profileData?.website || ''} className='underline cursor-pointer' target='_blank'>
                            {profileData?.website || ''}
                          </a>
                          <span id='country'>{profileData?.country}</span>
                        </div>
                      </div>
                      <div className='flex-1 flex justify-end items-end gap-3'>
                        <Button
                          id='followers-btn'
                          buttonClass='font-text hover:text-green-500 transition-color'
                          handleClick={() => { setProfileDialog('profiledialog'); setCurreentProfileDialogTab('followerssec') }}
                          children={
                            <>
                              <span>Followers</span>
                              <span className='block text-center'>{profileData?.followers?.length || 0}</span>
                            </>
                          }
                        />
                        <Button
                          id='following-btn'
                          buttonClass='font-text hover:text-green-500 transition-color'
                          handleClick={() => { setProfileDialog('profiledialog'); setCurreentProfileDialogTab('followingsec') }}
                          children={
                            <>
                              <span>Following</span>
                              <span className='block text-center'>{profileData?.following?.length || 0}</span>
                            </>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div id='profile-activities-tabs' className='w-full pt-5'>
                  {/* tabs */}
                  <div id='profile-tab-menus' className='sticky top-0 z-50'>
                    <Menu
                      arrOfMenu={profileAtivitiesTabs.map(item => item.menu)}
                      parentClass="flex justify-between gap-4 border bg-white dark:bg-stone-800 dark:text-white px-2 py-1 shadow-sm"
                      childClass=""
                    />
                  </div>
                  <Tab
                    id='profile-activities-tab'
                    tabClass="flex justify-center pt-5"
                    currentTab={currentProfileContentTab}
                    arrOfTab={profileAtivitiesTabs.map(item => item.tab)}
                  />
                </div>
                <Dialog
                  id="profile-intertractions-dialog"
                  parentClass=""
                  childClass="container relative rounded-sm space-y-2 w-full h-full py-4 bg-white dark:bg-stone-800 dark:text-white overflow-hidden"
                  currentDialog="profiledialog"
                  dialog={profileDialog}
                  setDialog={setProfileDialog}
                  children={
                    <>
                      <div className='flex gap-4 mb-6'>
                        <Button
                          id="profile-intertractions-dialog-close-btn"
                          buttonClass=''
                          children={<IoMdArrowRoundBack size={20} />}
                          handleClick={() => setProfileDialog(' ')}
                        />
                        <span className="text-xl font-text capitalize underline">
                          {currentProfileDialogTab.slice(0, -3)}
                        </span>
                      </div>
                      <Tab
                        id='profile-tab'
                        tabClass=""
                        currentTab={currentProfileDialogTab}
                        arrOfTab={[
                          {
                            name: 'followerssec',
                            content: <Followerssec arrOfFollowers={profileData.followers} />
                          },
                          {
                            name: 'followingsec',
                            content: <Followingsec arrOfFollowing={profileData.following} />
                          },
                          {
                            name: 'interestssec',
                            content: <Interentssec arrOfInterents={profileData.interests} />
                          }
                        ]}
                      />
                    </>
                  }
                />
              </div>
              :
              <Page404 />
          }
        </> :
        <Profilepageplaceholder />
    }
  </div>
};

export default Profilesec;
