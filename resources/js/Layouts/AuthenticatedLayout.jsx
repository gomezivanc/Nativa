import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import TopHeader from '@/components/Navbar/TopHeader';
import Sidebar from '@/components/Navbar/Sidebar';
import NavPrin from '@/components/Navbar/NavPrin';
import {usePage} from "@inertiajs/react";
import Swal from "sweetalert2";
import { Helmet } from 'react-helmet';

export default function Layout({title,children }) {

    let {auth, ziggy, flash} = usePage().props;

    let [menuParent,setMenuParent] = useState(null);

    useEffect(() => {
        if(flash.message){
            Swal.fire({title: 'Mensaje',html: flash.message,icon: 'success'});
        }
        if(flash.error){
            Swal.fire({title: 'Error',html: flash.error,icon: 'error'});
        }
    }, [flash]);

    const changeMenuParent = (parent) => {
        setMenuParent(parent);
    }


    return (
        <>
        <Helmet titleTemplate="%s | Simnet" title={title} />
        <div className="flex flex-col">
            <div className="flex flex-col h-screen">
            <div className="md:flex shadow-md">
                <TopHeader/>
                <Navbar/>
            </div>
            <div className="md:flex shadow-md z-10 centrar">
               <NavPrin onChange={changeMenuParent}/>
            </div>
            <div className="flex flex-grow overflow-hidden">
           <Sidebar parent={menuParent}/>
            {/* To reset scroll region (https://inertiajs.com/pages#scroll-regions) add `scroll-region="true"` to div below */}
            <div className="w-full px-4 py-8 overflow-hidden overflow-y-auto md:p-12 ">
              {children}
            </div>
          </div>
            </div>
        </div>
        </>
    );
}
