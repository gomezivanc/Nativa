import ApplicationLogo from '@/components/ApplicationLogo';
import { Link , usePage} from "@inertiajs/react";

export default function Guest({ children }) {
    const { ziggy } = usePage().props;
    return (
        <div className="w-full h-screen flex items-center justify-center bg-cover bg-left-bottom" style={{backgroundImage: ziggy?.url? `url(${ziggy.url}/images/SVG/fondo.svg)`: 'none' }}>
            <div className='w-5/6 h-5/6 rounded-[20px] drop-shadow bg-white grid grid-cols-2 max-lg:grid-cols-1 overflow-hidden'>

                <div className='flex items-start justify-center pt-10 p-6 max-lg:hidden'>
                    <img
                        src={ziggy.url +"/images/PNG/gestion_documental_login.png"}
                        alt="Gestion documental"
                        className='object-contain max-w-[70%] max-h-[70%] w-auto h-auto'
                    />
                </div>

                <div className='flex items-center justify-start pt-10 p-4 overflow-hidden'>
                    {children}
                </div>
            </div>
        </div>
    );
}
