import { RiDeleteBinLine } from "react-icons/ri";
import { useDeleteData, useUserIsLogin } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { clearProfile } from "../redux/slices/userProfileSlices";
import Button from "./Button";
import { useState } from "react";
import Cookies from 'js-cookie';

const Deleteuseraccount = () => {
  const [deleteRequest, setDeleteRequest] = useState(false);
  const { deleteData, loading } = useDeleteData();
  const { setLoginStatus } = useUserIsLogin();
  const appDispatch = useAppDispatch();

  const handleDeleteAccount = async () => {
    const url = '/api/deleteprofile';
    
    deleteData<{ deleted: string }>(url)
      .then((res) => {
        const { data } = res;
        if (data) {
          Cookies.remove('blogbackclient');
          setLoginStatus((pre) => pre ? {
            ...pre,
            isLogin: false,
            loginUserName: '',
            greetings: data.deleted
          } : pre);
          appDispatch(clearProfile({ data: null, loading: true, error: '' }));
        };
      });
  };

  return <div>
    <Button
      id="delete-user-account-request-btn"
      buttonClass="flex items-center gap-2 font-secondary text-xl"
      children={<><RiDeleteBinLine size={22} />  Delete Account</>}
      handleClick={() => setDeleteRequest(true)}
    />
    <div id="delete-request-pop-up"
      className={deleteRequest ? "fixed top-0 right-0 bottom-0 left-0 flex justify-center items-start backdrop-blur-sm z-50" : 'hidden'}>
      <div className="min-w-[280px] bg-whitedark:bg-stone-800 dark:text-white rounded-md  border-t shadow-md p-4 mt-20  space-y-10">
        {!loading ?
          <>
            <span className="font-text text-base sm:text-xl text-center text-red-500">
              Do you want to delete you account ?
            </span>
            <div className=" flex justify-between gap-4 px-4">
              <Button
                id="cancle-delete-request-btn"
                buttonClass="font-text text-base text-green-800"
                children="No"
                handleClick={() => setDeleteRequest(false)}
              />
              <Button
                id="delete-user-account-btn"
                buttonClass="font-text text-base text-red-800"
                children="Yes"
                handleClick={handleDeleteAccount}
              />
            </div>
          </> :
          <>
            <span className="font-text text-base sm:text-xl text-center">
              We are sad to see you go
            </span>
            <div>
              <span>{loading ? 'loading...' : ''}</span>
            </div>
          </>
        }
      </div>
    </div>
  </div>

};

export default Deleteuseraccount;
