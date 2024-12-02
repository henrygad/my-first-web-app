import { Backwardnav, Conpanylogo } from "../components";

const Page404 = () => {

    return <div className="w-full h-screen flex justify-center gap-4">
        <div className="mt-40">
            <Conpanylogo />
            <span className="text-4xl font-primary">404 Page Not Found</span>
            <Backwardnav pageName="Return back" to="/" />            
        </div>
    </div>

};

export default Page404;
