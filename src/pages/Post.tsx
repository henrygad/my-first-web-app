import { useEffect, useState } from "react";
import { Menu, Tab } from "../components";
import { Button } from "../components";
import { Drafts, Createblogpostsec, Displayblogpostimagessec, Unpublisheds } from "../sections";
import { useLocation } from "react-router-dom";
import { Blogpostprops } from "../entities";
import { GoPencil } from "react-icons/go";
import { PiArticleLight } from "react-icons/pi";
import { MdOutlinePermMedia } from "react-icons/md";

const Post = () => {
  const location = useLocation();
  const { edit, data } = location.state || { edit: false, data: null };
  const blogpostToEdit: Blogpostprops = data;
  const toEdit: boolean = edit;

  const [postParentTabs, setPostParentTabs] = useState(() => localStorage.getItem('postParentTabs') || 'post');
  const [postChildrenTabs, setPostChildrenTabs] = useState(() => localStorage.getItem('postChildrenTabs') || '');

  const [inputAreasStatus, setInputAreasStatus] = useState(toEdit ? 'old' : 'empty');

  const [getBlogpostId, setGetBlogpostId] = useState(blogpostToEdit?._id || '');
  const [titleContent, setTitleContent] = useState<{ _html: string, text: string }>({
    _html: blogpostToEdit?._html.title || '',
    text: blogpostToEdit?.title || '',
  });
  const [bodyContent, setBodyContent] = useState<{ _html: string, text: string }>({
    _html: blogpostToEdit?._html.body || '',
    text: blogpostToEdit?.body || '',
  });
  const [displayImage, setDisplayImage] = useState(blogpostToEdit?.displayImage || ' ');
  const [catigory, setCatigory] =
    useState<{ _id: number, cat: string }[]>(blogpostToEdit?.catigory.split(',').map((item, index) => ({ _id: index, cat: item })) ||
      [{ _id: 0 + Date.now(), cat: '' }]);
  const [slug, setSlug] = useState(blogpostToEdit?.slug || '');
  const [blogpostStatus, setBlogpostStatus] = useState(blogpostToEdit?.status || '');
  const [blogpostPreStatus, setBlogpostPreStatus] = useState(blogpostToEdit?.preStatus || '');

  const sideBar = [
    {
      menu: {
        name: 'Post',
        to: '',
        content: <Button
          id=""
          buttonClass="flex gap-2 items-center"
          children={<><GoPencil size={20} />  Post</>}
          handleClick={() => handleSwitchBetweenTabs('post')} />
      },
      tab: {
        name: 'post',
        content: <Createblogpostsec
          toEdit={toEdit}
          inputAreasStatus={inputAreasStatus}
          setInputAreasStatus={setInputAreasStatus}
          getBlogpostId={getBlogpostId}
          setGetBlogpostId={setGetBlogpostId}
          titleContent={titleContent}
          setTitleContent={setTitleContent}
          bodyContent={bodyContent}
          setBodyContent={setBodyContent}
          displayImage={displayImage}
          setDisplayImage={setDisplayImage}
          catigory={catigory}
          setCatigory={setCatigory}
          slug={slug}
          setSlug={setSlug}
          blogpostStatus={blogpostStatus}
          setBlogpostStatus={setBlogpostStatus}
          blogpostPreStatus={blogpostPreStatus}
          setBlogpostPreStatus={setBlogpostPreStatus}
        />
      }
    },
    {
      menu: {
        name: 'Articles',
        to: '',
        content: <Button
          id=""
          buttonClass="flex items-center gap-2"
          children={<><PiArticleLight size={20} /> Article</>}
        />,
        child: [
          {
            name: "drafts",
            to: '',
            content: <Button
              children="Draft"
              buttonClass=""
              id=""
              handleClick={() => handleSwitchBetweenTabs('articles', 'drafts')} />
          },
          {
            name: "Unpublished",
            to: '',
            content: <Button
              children="Unpublished"
              buttonClass=""
              id=""
              handleClick={() => handleSwitchBetweenTabs('articles', 'unpublished')} />
          },
        ]
      },
      tab: {
        name: 'Articles',
        content: <div id="articles">Articles</div>,
        child: [
          {
            name: "Unpublished",
            content: <Unpublisheds />,
          },
          {
            name: "drafts",
            content: <Drafts />,
          },
        ]
      }
    },
    {
      menu: {
        name: 'Media',
        to: '',
        content: <Button
          id=""
          buttonClass="flex items-center gap-2"
          children={<><MdOutlinePermMedia size={20} /> Media</>}
          handleClick={() => handleSwitchBetweenTabs('media')} />
      },
      tab: {
        name: 'media',
        content: <Displayblogpostimagessec />
      }
    },
  ];

  const handleSwitchBetweenTabs = (sec: string, childSec?: string) => {
    setPostParentTabs(sec);
    localStorage.setItem('postParentTabs', sec);
    if (childSec) {
      setPostChildrenTabs(childSec)
      localStorage.setItem('postChildrenTabs', childSec);
    };
  };

  useEffect(() => {
    if (toEdit && blogpostToEdit) {
      setInputAreasStatus('old');
      setGetBlogpostId(blogpostToEdit._id);
      setTitleContent({
        _html: blogpostToEdit._html.title,
        text: blogpostToEdit.title,
      });

      setBodyContent({
        _html: blogpostToEdit._html.body,
        text: blogpostToEdit.body,
      });

      setDisplayImage((blogpostToEdit.displayImage || ' '));

      setCatigory(blogpostToEdit?.catigory.split(',').map((item, index) => ({ _id: index, cat: item })) ||
        [{ _id: 0 + Date.now(), cat: '' }]);

      setSlug(blogpostToEdit.slug);
      setBlogpostStatus(blogpostToEdit.status);
      setBlogpostPreStatus(blogpostToEdit.preStatus || '');

      handleSwitchBetweenTabs('post');
    };
  }, [toEdit, blogpostToEdit]);


  return <div className="w-full">
    <div className="flex items-center mb-4">
      <span className="text-xl font-text capitalize underline">
        Post
      </span>
    </div>
    <div className="md:flex border border-green-500">
      <div className="min-w-[145px] border-b md:border-b-0 md:border-r border-green-500 p-4">
        <Menu
          id="sideBar"
          parentClass="text-base font-secondary space-y-5"
          nestedChildParentClass='space-y-4 bg-gray-50 dark:bg-gray-400 p-2'
          childClass=""
          arrOfMenu={sideBar.map(item => item.menu)}
        />
      </div>
        <Tab
          id="alltabs"
          tabClass="flex-1  p-4"
          arrOfTab={sideBar.map(item => item.tab)}
          currentTab={postParentTabs}
          childrenTabs={postChildrenTabs}
        />
    </div>
  </div >
};

export default Post;


