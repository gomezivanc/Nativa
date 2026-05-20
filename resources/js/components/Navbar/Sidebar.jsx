import { useState, useEffect } from "react";
import { Link, usePage } from '@inertiajs/react';

const Sidebar = ({ parent }) => {
    let [menus, setMenus] = useState([]);
    const [open, setOpen] = useState(true);
    const [selected, setSelected] = useState(null);
    const { ziggy, translations, auth } = usePage().props;

    useEffect(() => {
        setSelected(null);
        setMenuItems();
    }, [parent, auth.current_role_id]);

    const setMenuItems = async () => {
        if (parent){
            try {
                const response = await axios.get(route('menus.all') + '?parent=' + parent.id);
                setMenus(response.data);
            } catch (error) {
                console.error('[Sidebar] Error cargando menus:', error.message);
                setMenus([]);
            }
        }else{
            setMenus([]);
        }
    }

    const handleSelectedItem = (menuId) =>{
        setSelected(menuId)
    }

    const handleNavLinkClick = () => {
        setOpen(false);
        setSelected(null);
    }

    const getNestedValue = (obj, path) => {
        // Divide el path por los puntos
        const keys = path.split('.');
      
        // Reduce el objeto siguiendo las claves
        return keys.reduce((acc, key) => acc && acc[key], obj);
    };

    return (
        <div className={` ${open ? "w-64 max-2xl:w-64 max-lg:w-36 max-sm:w-32" : "w-20 max-sm:w-14 "}  flex flex-col bg-[#F1FCFF] duration-300 rounded-sm shadow-md`}>
            <div className={` ${open ? "w-64 max-2xl:w-64 max-lg:w-36 max-sm:w-32" : "w-20 max-sm:w-14 "}  h-full  p-5  pt-8 relative duration-300 rounded-sm shadow-md overflow-y-auto overflow-x-hidden`}>
                <img src={ziggy.url + "/images/assets/control.png"} className={`absolute cursor-pointer right-0 top-9 w-7 border-[#008bbf] border-2 rounded-full  ${!open && "rotate-180"}`}
                    onClick={() => {setOpen(!open);}} />
                <div className="centrar gap-x-4 items-center w-full flex-col h-14 p-1 ">
                    <img
                        src={ziggy.url + "/images/PNG/logo.png"}
                        className={`cursor-pointer duration-500 w-16 `}
                    />
                </div>
                <div className={`centrar gap-x-4 items-center w-full flex-col h-14 mb-3  ${!open && "scale-0 "}`}>
                    {parent && (
                        <h1 className={`centrar w-full letra_principal origin-left font-bold font-oswald text-xl max-lg:text-sm + duration-200  ${!open && "scale-0"}`} >
                            {getNestedValue(translations.menu,parent.title)}
                        </h1>
                    )}
                </div>
                <div className={`cw-full mb-2  centrar  ${!open && "-mt-14"}`}>
                    {/* <div className="mb-3 flex flex-col bg-yellow-800"> */}
                    <div className={`${!open && "mb-3 flex flex-col "}`}>

                        {menus.map((menu) => (
                            <div key={menu.id} className={`selected ${menu.id === selected ? 'bg-blue-100' : ''}`}>
                                <Link href={menu.type === 1 ? route(menu.uri) : menu.uri}
                                    key={menu.id}
                                    preserveState
                                    preserveScroll
                                    as="button"
                                    className={`text-gray-500 hover:text-gray-700 p-2 text-base flex items-center text-start hover:bg-blue-100 w-full my-1
                                                ${!open ? "" : "gap-2"}`} 
                                                onClick={() => handleSelectedItem(menu.id)}>
                                    {menu.icon && (
                                        <div className={`${!open && "text-3xl "} `}>
                                            <i className={menu.icon}></i>
                                        </div>
                                    )}
                                    <div className={"text-[#002F65] group-hover:text-[#001E41] font-semibold max-lg:text-xs"}>
                                        <span className={`${!open && "hidden"} origin-left duration-200`}>
                                            {getNestedValue(translations.menu,menu.title)}
                                        </span>
                                    </div>
                                </Link>
                                {menu.children && menu.children.length > 0 && (
                                    <div className="ml-4">
                                        {menu.children.map((child) => (
                                            <div key={child.id}>
                                                <Link href={child.type === 1 ? route(child.uri) : child.uri}
                                                    key={child.id}
                                                    preserveState
                                                    preserveScroll
                                                    as="button"
                                                    className={`p-2 centrar flex rounded-md max-sm:p-1 cursor-pointer hover:bg-blue-100 letra_principal text-base max-sm:text-xs font-semibold items-center max-sm:gap-1 mb-1 ${!open ? "" : "gap-2"}`}
                                                >
                                                    {child.icon && (
                                                        <div className={`${!open && "text-3xl "}`}>
                                                            <i className={child.icon}></i>
                                                        </div>
                                                    )}
                                                    <div className={"text-[#002F65] group-hover:text-[#001E41] font-semibold max-lg:text-xs"}>
                                                        <span className={`${!open && "hidden"} origin-left duration-200`}>
                                                            {getNestedValue(translations.menu,child.title)}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <footer className="centrar max-w-full h-12 bottom-0 border-t-2 border-gray-50">
                {/* <img src={ziggy.url + "/images/SVG/Nativa.svg"} className="object-contain w-32" /> */}
            </footer>
        </div>
    );
};

export default Sidebar;