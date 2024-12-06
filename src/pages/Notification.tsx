import { useAppSelector } from "../redux/slices";
import { Backwardnav, Notificationplaceholder, Singlenotification } from "../components";
import { Notificationsprops } from "../entities";

const Notification = () => {
  const { userProfile: { data: profileData, loading: loadingProfile } } = useAppSelector((state) => state.userProfileSlices);

  const handleStructureToDisplayNotifications = (arr: Notificationsprops[]) => {
    return arr.reduce((acc: Notificationsprops[], curr: Notificationsprops) => {
      const preValue = acc?.[acc.length - 1]

      if (
        (curr.typeOfNotification === 'blogpostLike' ||
          curr.typeOfNotification === 'commentLike' ||
          curr.typeOfNotification === 'blogpostComment' ||
          curr.typeOfNotification === 'replyComment' ||
          curr.typeOfNotification === 'follow' ||
          curr.typeOfNotification === 'unfollow'
        ) &&
        (preValue?.typeOfNotification === curr.typeOfNotification && preValue?.msg === curr.msg)
      ) {
        const prePegs = preValue.pegs || [];
        acc[acc.length - 1] = { ...preValue, pegs: [...prePegs, curr] };

      } else {
        acc.push(curr);
      };

      return acc;
    }, [])
  };
  
  return <div>
    <Backwardnav pageName="Notifications" />
    <div className="w-full space-y-2">
      {!loadingProfile ?
        <>
          {profileData &&
            profileData.notifications &&
            profileData.notifications.length ?
            <>
              {handleStructureToDisplayNotifications(profileData.notifications?.map(item => item).reverse())
                .map((item) => {
                  if (item.typeOfNotification === 'view') {
                    return <Singlenotification key={item._id} notification={item} displayImage={false} />
                  }

                  return <Singlenotification key={item._id} notification={item} displayImage={true} />
                }
                )}
            </> :
            null
          }
        </> :
        <>
          {Array(9).fill('').map((_, index) =>
            <Notificationplaceholder key={index} />
          )}
        </>
      }
    </div>
  </div>
};

export default Notification;
