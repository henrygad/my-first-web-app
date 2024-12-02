
const Commentplaceholder = () => {

    return <div className="w-full space-y-6 rounded-sm p-4 animate-pulse" >
    <div className="w-full flex justify-center">
        <div className="w-full flex justify-start items-start gap-2">
            <div id="image-pulse" className="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div className="w-[80px] h-2 bg-slate-200 rounded-sm mt-2"></div>
        </div>
        <div className="w-1 h-4 bg-slate-200 rounded-sm"></div>
    </div>
    <div className="w-[80%] h-4 bg-slate-200 rounded-sm"></div>
    <div className="w-full h-10 bg-slate-200 rounded-sm"></div>
</div>
};

export default Commentplaceholder;
