
const Notificationplaceholder = () => {
    return <div className="flex justify-start items-center gap-3 w-full p-2 rounded-sm animate-pulse">
        <div className="w-5 h-5 bg-slate-200 rounded-sm"></div>
        <div id="image-pulse" className="w-10 h-10 bg-slate-200 rounded-full"></div>
        <div id="name-pulse" className="w-full h-4 bg-slate-200 rounded-sm mt-2"></div>
    </div>
};

export default Notificationplaceholder;
