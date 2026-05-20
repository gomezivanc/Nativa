import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import Icon from "@/components/Icon";
import NavLinkPrin from "@/components/NavLinkPrin";
import Dropdown from "@/components/Dropdown";
import NavLink from "@/components/NavLink";
import { LanguageSwitcher } from "../LanguageSwitcher";

const Navbar = () => {
    const { auth, translations } = usePage().props;
    const [menuOpenedCon, setMenuOpenedCon] = useState(false);
    const [menuOpened, setMenuOpened] = useState(false);
    const [menuConfigOpen, setMenuConfigOpen] = useState(false);
    const [rolConfigOpen, setRolConfigOpen] = useState(false);

    const handleSwitchRole = (roleId) => {
        setRolConfigOpen(false);
        router.post(route('main.switch-role'), { role_id: roleId });
    };

    // Obtener rol actual
    const currentRole = auth.user?.roles?.find(r => r.id === auth.current_role_id);
    
    return (
        <>
            <div className="flex items-center justify-end w-full p-4 text-sm fondo_color_right md:py-0 md:px-12 d:text-md shadow-lg space-x-2 border-none">
                {/* Boton de cambio de roles */}
                {auth.user?.roles && (
                    <div
                        className="flex items-center cursor-pointer select-none group space-x-1"
                        onClick={() => setRolConfigOpen(!rolConfigOpen)}
                    >
                        <div className="mr-1 text-white font-semibold whitespace-nowrap group-hover:text-indigo-50 focus:text-indigo-50">
                            <span>{currentRole?.name || 'Rol'}</span>
                        </div>
                        <Icon
                            className="w-5 h-5 text-white fill-current group-hover:text-gray-300 focus:text-gray-600"
                            name="cheveron-down"
                        />
                    </div>
                )}

                {rolConfigOpen && (
                    <>
                        <div className="absolute max-sm:top-[4.5rem] max-sm:right-52 top-8 right-80 z-50 py-2 mt-8 text-sm whitespace-nowrap bg-white rounded shadow-xl">
                            <div className="flex flex-col mx-2">
                                {auth.user?.roles?.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => handleSwitchRole(role.id)}
                                        className={`block px-6 py-2 text-left w-full ${
                                            role.id === auth.current_role_id
                                                ? 'bg-indigo-600 text-white font-semibold'
                                                : 'hover:bg-indigo-600 hover:text-white'
                                        }`}
                                    >
                                        {" "}&nbsp; {role.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div
                            onClick={() => setRolConfigOpen(false)}
                            className="fixed inset-0 z-10 bg-black opacity-25"
                        ></div>
                    </>
                )}

                {(auth.user?.roles && auth.user.roles[0]?.name.toLowerCase() === 'super_administrador') && (
                    <div
                        className="flex items-center cursor-pointer select-none group space-x-1"
                        onClick={() => setMenuConfigOpen(true)}
                    >
                        <Icon
                            className="w-4 h-4 text-white fill-current group-hover:text-gray-300 focus:text-gray-600"
                            name="service"
                        />
                        <div className="mr-1 text-white font-semibold whitespace-nowrap group-hover:text-indigo-50 focus:text-indigo-50">
                            <span>{translations.menu.navbar.administration}</span>
                            {/* <span className="ml-1 md:inline">{auth.user.usuario}</span> */}
                        </div>
                        <Icon
                            className="w-5 h-5 text-white fill-current group-hover:text-gray-300 focus:text-gray-600"
                            name="cheveron-down"
                        />
                    </div>
                )}

                <div className={menuConfigOpen ? "" : "hidden"}>
                    <div className="absolute max-sm:top-[4.5rem] max-sm:right-52 top-8 right-60 z-50 py-2 mt-8 text-sm whitespace-nowrap bg-white rounded shadow-xl">
                        <div className="flex flex-col mx-2">
                            <NavLink
                                href={route("usuarios.index")}
                                className="block px-6 py-2 hover:bg-indigo-600 hover:text-white"
                                onClick={() => setMenuConfigOpen(false)}
                            >
                                <i className="fa-solid fa-user"></i>
                                {"  "}&nbsp; {translations.menu.navbar.list_configuration.users}
                            </NavLink>

                            {(auth.user.roles[0]?.name) && (
                                <>
                                    <NavLink
                                        href={route("menus.index")}
                                        className="block px-6 py-2 hover:bg-indigo-600 hover:text-white"
                                        onClick={() => setMenuConfigOpen(false)}
                                    >
                                        <i className="fa-solid fa-bars"></i>{" "}
                                        &nbsp; {translations.menu.navbar.list_configuration.menus}
                                    </NavLink>
                                    <NavLink
                                        href={route("roles.index")}
                                        className="block px-6 py-2 hover:bg-indigo-600 hover:text-white"
                                        onClick={() => setMenuConfigOpen(false)}
                                    >
                                        <i
                                            className="fa fa-users"
                                            aria-hidden="true"
                                        ></i>{" "}
                                        &nbsp;{translations.menu.navbar.list_configuration.rol}
                                    </NavLink>
                                    <NavLink
                                        href={route("permisos.index")}
                                        className="block px-6 py-2 hover:bg-indigo-600 hover:text-white"
                                        onClick={() => setMenuConfigOpen(false)}
                                    >
                                        <i className="fa-solid fa-lock"></i>{" "}
                                        &nbsp; {translations.menu.navbar.list_configuration.permissions}
                                    </NavLink>
                                    <NavLink
                                        href={route("main.company")}
                                        className="block px-6 py-2 hover:bg-indigo-600 hover:text-white"
                                        onClick={() => setMenuConfigOpen(false)}
                                    >
                                        <i className="fa-solid fa-lock"></i>{" "}
                                        &nbsp; {translations.menu.navbar.company}
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            setMenuConfigOpen(false);
                        }}
                        className="fixed inset-0 z-10 bg-black opacity-25"
                    ></div>
                </div>
                <div className="relative">
                    <div
                        className="flex items-center cursor-pointer select-none group space-x-1"
                        onClick={() => setMenuOpened(true)}
                    >
                        <Icon
                            className="w-4 h-4 text-white fill-current group-hover:text-gray-300 focus:text-gray-600"
                            name="user"
                        />
                        <div className="mr-1 text-white font-semibold whitespace-nowrap group-hover:text-indigo-50 focus:text-indigo-50">
                            <span>{auth.user.usuario}</span>
                        </div>
                        <Icon
                            className="w-5 h-5 text-white fill-current group-hover:text-indigo-50 focus:text-indigo-50"
                            name="cheveron-down"
                        />
                    </div>
                    <div className={menuOpened ? "" : "hidden"}>
                        <div className=" absolute top-0 right-0 left-auto z-20 py-2 mt-10 text-sm whitespace-nowrap bg-white rounded shadow-xl">
                            <div className="flex flex-col mx-2">
                                <NavLink
                                    href={route("usuarios.edit-user-login", auth.user.id)}
                                    className="block px-6 py-2 hover:bg-indigo-600 hover:text-white"
                                    onClick={() => setMenuOpened(false)}
                                >
                                    <i className="fa-solid fa-address-card"></i>{" "}
                                    &nbsp; {translations.menu.navbar.list_profile.profile}
                                </NavLink>
                                <Link
                                    as="button"
                                    href={route("logout")}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-[#F50808] hover:text-red-500 hover:border-red-300 focus:outline-none focus:text-red-500 focus:border-red-300 transition duration-150 ease-in-out"
                                    method="post"
                                >
                                    <i
                                        className="fa fa-sign-out"
                                        aria-hidden="true"
                                    ></i>{" "}
                                    &nbsp; {translations.menu.navbar.list_profile.log_out}
                                </Link>
                            </div>
                        </div>
                        <div
                            onClick={() => {
                                setMenuOpened(false);
                            }}
                            className="fixed inset-0 z-10 bg-black opacity-25"
                        ></div>
                    </div>
                </div>
                <div className="relative">
                    <LanguageSwitcher isFixed={false} btn_class="text-white" fontSize="1.4rem" />
                </div>
            </div>
        </>
    );
};

export default Navbar;