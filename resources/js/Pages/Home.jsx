import {React, useEffect, useState} from 'react';
import Layout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import Icon from '@/components/Icon';

const Home = () => {
    const [rolesActual, setRolesActual] = useState('');

    const rolActual = (e) => {
        axios.get(route('main.rol')).then((response) => {
            setRolesActual(response.data.roles);
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        rolActual();
      }, []);


    return (
        <>
            <Head title="Inicio" />
            <div className="flex flex-col h-screen" style={{
                backgroundImage: "url('images/PNG/logo.png')",
                backgroundSize: "auto 300px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "58% 78%",
                opacity: 0.12,
                position: "absolute",
                inset: '0px',
                margin: 'auto',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -35,
            }}>
            </div> 
            <div className="flex-1 ">
                <div className="max-w-[99%] mx-auto sm:px-6 lg:px-8  ">
                    <div className="h-10 overflow-hidden shadow-sm sm:rounded-lg border-2 border-[#dfefff] mb-5 flex items-center font-oswald">
                        <div className="px-5 pt-1 text-[#048FC2]">Aplicación Plantilla</div>
                    </div>
                </div>
                {(rolesActual === 'Agendador' || rolesActual === 'Administrador') && (
                <div className='w-full centrar mb-4'>
                    <div className='text-[#003066] text-2xl font-bold font-oswald'>
                        Notificaciones
                    </div>
                </div>
                )}

                <div className="max-w-[97%] mx-auto sm:px-6 mb-10">
                    <div className="flex-col overflow-hidden shadow-sm sm:rounded-lg border-2 border-gray-200">
                 
                    </div>
                </div>
            </div>
        </>
    );
};
Home.layout = page => <Layout title="Principal" children={page} />;
export default Home;