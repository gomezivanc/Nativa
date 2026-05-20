import { Link } from '@inertiajs/react';

export default function NavLinkPrin({ href, active, icon, children }) {
    return (
        <Link
            href={href}
            className={
                active
                ? 'inline-flex items-center px-1 pt-1 border-b-2 border-indigo-50 text-sm font-medium leading-5 text-white focus:outline-none focus:border-indigo-100 transition duration-150 ease-in-out'
                : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-300 hover:text-gray-400 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out'
        }
        >
            {icon && (
                <i className={icon}></i>
            )}
            {children}
        </Link>
    );
}
