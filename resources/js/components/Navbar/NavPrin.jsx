import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import NavLink from "@/components/NavLink";

const NavPrin = ({ onChange }) => {
    let { auth, ziggy, translations } = usePage().props;
    let [menus, setMenus] = useState([]);
    let [selectedMenu, setSelectedMenu] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSelected(null);
        setSelectedMenu([]);
        setMenus([]);
        setMainMenus();
    }, [auth.current_role_id]);

    const setMainMenus = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route("menus.all") + "?parent=0");
            setMenus(response.data);
        } catch (error) {
            console.error('[NavPrin] Error cargando menus:', error.message);
            setMenus([]);
        } finally {
            setLoading(false);
        }
    };

    const setActiveParent = (menu) => {
        setSelectedMenu(menu);
        onChange(menu);
        return true;
    };

    const handleSelectedItem = (menuId) => {
        setSelected(menuId);
    };

    const getNestedValue = (obj, path) => {
        // Divide el path por los puntos
        const keys = path.split(".");

        // Reduce el objeto siguiendo las claves
        const value = keys.reduce((acc, key) => acc && acc[key], obj);
        
        // Si el resultado es un objeto, retorna la etiqueta de la propiedad
        if (typeof value === 'object' && value !== null) {
            return path; // Retorna la ruta si es un objeto
        }
        
        // Si es un string, retorna el valor
        if (typeof value === 'string') {
            return value;
        }
        
        // En otros casos, retorna la ruta como fallback
        return path;
    };

    return (
        <nav className="w-full bg-white shadow min-h-10 overflow-x-auto 2xl:overflow-visible px-2">
            <ul className="flex flex-row lg:justify-center space-x-4 md:space-x-8 px-4 md:px-0 p-2 whitespace-nowrap min-w-max">
                {menus.map((menu) => (
                    <li
                        key={menu.id}
                        className={`${
                            menu.id === selected
                                ? "border-b-2 border-gray-500 text-gray-900"
                                : "text-gray-700"
                        }`}
                    >
                        <NavLink
                            active={
                                menu.type === 1
                                    ? route().current(menu.uri)
                                    : false
                            }
                            href={
                                menu.type === 1
                                    ? route(menu.uri)
                                    : menu.uri == "main"
                                    ? ""
                                    : menu.uri
                            }
                            target={menu.target}
                            className="flex items-center py-2 px-3 hover:text-gray-900 transition"
                            onClick={(e) =>
                                setActiveParent(menu) &&
                                handleSelectedItem(menu.id)
                            }
                        >
                            {menu.icon && (
                                <i className={`${menu.icon} mr-2`}></i>
                            )}
                            {typeof menu.title === 'string' && menu.title.length > 0
                                ? getNestedValue(translations.menu, menu.title)
                                : menu.title || 'Menu'
                            }
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavPrin;