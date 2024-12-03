import { RiLogoutBoxLine } from "react-icons/ri";
import { Userstatusprops } from "../entities";
import { usePostData, useUserIsLogin } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { clearProfile } from "../redux/slices/userProfileSlices";
import Button from "./Button";
import Cookies from 'js-cookie';

const Signoutuser = () => {
    const { postData, } = usePostData();
    const { setLoginStatus } = useUserIsLogin();
    const appDispatch = useAppDispatch();

    const handleLogOut = async () => {
        Cookies.remove('blogbackclient');
        setLoginStatus((pre) => pre ? { ...pre, isLogin: false, loginUserName: ''} : pre);

        const url = '/api/logout';
        const response = await postData<Userstatusprops>(url, null);
        const { data } = response;

        if (data) {
            setLoginStatus((pre) => pre ? { ...pre, ...data } : pre);
            appDispatch(clearProfile({ data: null, loading: true, error: '' }));
        };
    };
  
    return <Button
        id='logout-btn'
        buttonClass="flex items-center gap-2 font-secondary text-base text-red-600"
        children={<><RiLogoutBoxLine size={20} /> Logout</>}
        handleClick={handleLogOut}
    />
};

export default Signoutuser;
