

const Profilepageplaceholder = () => {
    return <div className="w-full space-y-6 animate-pulse ">
        <div className="flex justify-between">
            <div className="w-full space-y-2">
                <div id="image-pulse" className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div className="w-[100px] h-2 bg-slate-200 rounded-sm mt-2"></div>
            </div>
            <div className="flex items-start gap-3">
                <div className="h-4 w-12 bg-slate-100 rounded-md"></div>
                <div className="w-1 h-4 bg-slate-200 rounded-sm"></div>                
            </div>
        </div>
        <div className="w-[40%] h-20 bg-slate-200 rounded-sm"></div>
        <div className="w-full h-6 bg-slate-200 rounded-sm"></div>
    </div>
};

export default Profilepageplaceholder;
