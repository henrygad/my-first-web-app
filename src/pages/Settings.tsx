import { CgProfile } from "react-icons/cg";
import { Backwardnav, Button, Menu } from "../components";
import { Deleteuseraccount, Signoutuser } from "../components";
import { Link } from "react-router-dom";
import { GrShieldSecurity } from "react-icons/gr";
import { FaQuestion } from "react-icons/fa";
import { SlEarphonesAlt } from "react-icons/sl";
import { MdOutlinePrivacyTip } from "react-icons/md";

const Settings = () => {

    const settingsMenus = [
        {
            name: 'editprofile',
            content: <Link to="/editprofile">
                <Button
                    id="edit-profile-btn"
                    buttonClass="flex items-center gap-2 font-secondary text-xl "
                    children={<><CgProfile size={24} /> Edit Profile</>}
                />
            </Link>
        },
        {
            name: 'security',
            content:<Button
                    id="security-btn"
                    buttonClass="flex items-center gap-2 font-secondary text-xl "
                    children={<><GrShieldSecurity size={24} /> Security</>}
                />
        },
        {
            name: 'logout',
            content: <Signoutuser />,
        },
        {
            name: 'delete-profile',
            content: <Deleteuseraccount />,
        },
        {
            name: 'FAQ',            
            content: <Button
               id="faq-btn"
               buttonClass="flex items-center gap-2 font-secondary text-xl "
               children={<><FaQuestion size={22} /> FQA</>}
           />
        },
        {
            name: 'help',
            content: <Button
            id="help-btn"
            buttonClass="flex items-center gap-2 font-secondary text-xl "
            children={<><SlEarphonesAlt size={20} /> Help</>}/>
        },
        {
            name: 'privacy policy',
            content: <Button
            id="privacy-policy"
            buttonClass="flex items-center gap-2 font-secondary text-xl "
            children={<><MdOutlinePrivacyTip  size={24} /> Privacy Policy</>}/>
        },
    ];

    return <div>
        <Backwardnav pageName="settings" />
        <div className="flex justify-start py-2">
            <Menu
                id="settings-menu"
                arrOfMenu={settingsMenus}
                parentClass="space-y-5"
                childClass=""
            />
        </div>
    </div>
};

export default Settings;