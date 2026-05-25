import { Link } from '@inertiajs/react';

export default function NavLink({ href, active, onClick, children }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={
                active
                    ? 'inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-ibg-900 dark:text-ibg-300 border-b-2 border-ibg-900 dark:border-ibg-400 focus:outline-none transition duration-150 ease-in-out'
                    : 'inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 border-b-2 border-transparent focus:outline-none transition duration-150 ease-in-out'
            }
        >
            {children}
        </Link>
    );
}
