import { useEffect } from "react";
import { Singleuser } from "../components";
import { useFetchData } from "../hooks";
import { upDatefollowers } from "../redux/slices/userProfileSlices";
import { useAppDispatch } from "../redux/slices";

const Followerssec = ({ arrOfFollowers }: { arrOfFollowers: string[] }) => {
    const { fetchData } = useFetchData<{ followers: string[] }>('');
    const appDispatch = useAppDispatch();

    const handleRefreshFollowers = () => {
        fetchData('/api/followers')
            .then((res) => {
                const {data} = res;
                if(data){                   
                    appDispatch(upDatefollowers({followers: data.followers}));
                };
            });
    };

    useEffect(() => {
        setInterval(() => {
            handleRefreshFollowers();
        }, 10000);
    }, []);

    return <div className="space-y-3 pt-4 pb-6 " >
        {arrOfFollowers &&
            arrOfFollowers.length ?
            <>
                {
                    arrOfFollowers.map((item, index) =>
                        <Singleuser key={item} userName={item} index={index} />
                    )
                }</> :
            null
        }
    </div>
};

export default Followerssec;
