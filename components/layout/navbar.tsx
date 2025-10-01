import DogoIcon from "../shared/dogo-icon";

export default function Navbar(){
    return (
        <nav className="w-full h-16 bg-gray-900 rounded-t-lg font-serif uppercase flex items-center px-5">
            <DogoIcon className="fill-primary size-15"/>
            <h1 className="tracking-[3px] text-3xl text-primary">Dogo Onsen</h1>
        </nav>
    )
}