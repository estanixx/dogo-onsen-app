"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DogoIcon from "../shared/dogo-icon";

export default function Navbar(){
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/employee" },
        { name: "Recepción", href: "/employee/reception" },
        { name: "Banquete", href: "/employee/banquete" },
    ];

    return (
        <nav className="w-full h-16 bg-gray-900 rounded-t-lg font-serif uppercase flex items-center justify-between px-6 text-white sticky top-0 z-50">
        {/* Logo */}
        <div>
            <Link href={"/"} className="flex justify-center items-center space-x-3">
                <DogoIcon className="fill-primary w-10 h-10" />
                <h1 className="tracking-[3px] text-2xl text-primary">Dogo Onsen</h1>
            </Link>
        </div>

        {/* Navigation links */}
        <div className="flex items-center space-x-10 text-sm">
            {links.map((link) => (
            <Link
                key={link.href}
                href={link.href}
                className={`transition-all duration-150 pb-1 ${
                pathname === link.href
                    ? "text-primary border-b-2 border-primary"
                    : "hover:text-primary"
                }`}
            >
                {link.name}
            </Link>
            ))}
        </div>

        {/* User */}
        <div className="flex items-center space-x-3">
            <h1>Espacio para usuario</h1>
        </div>
        </nav>
    );
}