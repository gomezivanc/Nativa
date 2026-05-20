import { useState } from "react";
import { Head , usePage} from '@inertiajs/react';


const Dashboard = (props) => {
    const {ziggy} = usePage().props;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col h-full">

                <div className="flex-1">
                    <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                        <div className="h-10 overflow-hidden shadow-sm sm:rounded-lg border-2 border-[#dfefff] mb-5  ">
                            <div className="px-5 pt-1 text-[#048FC2]">Aplicación Plantilla</div>
                        </div>
                    </div>
                    <div className="max-w-[97%] mx-auto sm:px-6">
                        <div className="flex-col overflow-hidden shadow-sm sm:rounded-lg border-2 border-gray-200">
                            <div className="w-full centrar p-6 font-bold text-2xl text-[#6F7477]">Bienvenido</div>
                            <div className="w-full centrar -mt-4 p-6 font-semibold text-xl text-[#026882] max-2xl:text-lg max-2xl:-mt-8 max-lg:text-sm max-lg:-mt-4"> Selecciona una opción del menú que esta ubicado en la parte superior</div>
                            <div className="centrar w-full">
                                <img src={ziggy.url+"/images/SVG/muñeco.svg"} className="max-2xl:h-60" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
