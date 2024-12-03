import { Link } from "react-router-dom";
import { UsershortInforprops } from "../entities";
import { useFetchData } from "../hooks"
import Displayimage from "./Displayimage";
import { useEffect, useState } from "react";
import avaterPlaceholder from '../assert/avaterplaceholder.svg'


const UsershortInfor = ({ userName, displayName = true }: { userName: string, displayName?: boolean }) => {
    const localStorageUserData: UsershortInforprops = JSON.parse(localStorage.getItem(userName) || 'null');
    const { data, loading: loadingUser } = useFetchData<UsershortInforprops>('/api/users/' + userName, [userName]);
    const [userData, setUserData] = useState<UsershortInforprops | null>(localStorageUserData);

    useEffect(() => {
        if (data) {
            setUserData(data)
            localStorage.setItem(data.userName, JSON.stringify(data));
        };
    }, [!data]);

    return <>
        {userData ?
            <Link to={'/' + userName} className="flex items-start justify-start gap-3 ">
                {
                    userData ?
                        <>
                            <Displayimage
                                id={'avater'}
                                placeHolder={avaterPlaceholder}
                                imageId={userData.displayImage || ' '}
                                parentClass='h-9 w-9'
                                imageClass='object-contain rounded-full'
                                onClick={() => ''}
                            />
                            {displayName ?
                                <div className='flex flex-col font-secondary '>
                                    <span id='name' className='text-sm font-semibold' >{userData.name}</span>
                                    <span id='userName' className='text-[0.8rem] opacity-50 ' >{userData.userName}</span>
                                </div> :
                                null}
                        </> :
                        null
                }
            </Link>
            :
            <div className="flex items-start justify-start gap-3 animate-pulse">
                <div id="image-pulse" className="h-9 w-9 bg-slate-200 rounded-full"></div>
                <div className="w-[80px] h-2 bg-slate-200 rounded-sm"></div>
            </div>}
    </>
}

export default UsershortInfor
