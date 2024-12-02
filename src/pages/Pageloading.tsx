import { Screenloading } from "../components";


const Pageloading = () => {
  return <div className="w-full h-screen flex justify-center items-center">
    <Screenloading loading={true} />
  </div>
};

export default Pageloading;
