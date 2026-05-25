import { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Sidebar = ({ collapsed, onToggle }) => {
    const { auth, ziggy, translations } = usePage().props;

    const [menus, setMenus] = useState([]);
    const [activeParent, setActiveParent] = useState(null);
    const [subMenus, setSubMenus] = useState([]);
    const [selectedSub, setSelectedSub] = useState(null);
    const [loading, setLoading] = useState(false);

    const [rolOpen, setRolOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const sidebarRef = useRef(null);

    // Load main menus
    useEffect(() => {
        setMenus([]);
        setActiveParent(null);
        setSubMenus([]);
        setSelectedSub(null);
        loadMainMenus();
    }, [auth.current_role_id]);

    const loadMainMenus = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route("menus.all") + "?parent=0");
            setMenus(response.data);
        } catch (error) {
            console.error('[Sidebar] Error cargando menus:', error.message);
            setMenus([]);
        } finally {
            setLoading(false);
        }
    };

    // Load submenus when parent changes
    useEffect(() => {
        setSelectedSub(null);
        loadSubMenus();
    }, [activeParent, auth.current_role_id]);

    const loadSubMenus = async () => {
        if (activeParent) {
            try {
                const response = await axios.get(route('menus.all') + '?parent=' + activeParent.id);
                setSubMenus(response.data);
            } catch (error) {
                console.error('[Sidebar] Error cargando submenus:', error.message);
                setSubMenus([]);
            }
        } else {
            setSubMenus([]);
        }
    };

    const handleSwitchRole = (roleId) => {
        setRolOpen(false);
        router.post(route('main.switch-role'), { role_id: roleId });
    };

    const currentRole = auth.user?.roles?.find(r => r.id === auth.current_role_id);

    const getNestedValue = (obj, path) => {
        const keys = path.split('.');
        const value = keys.reduce((acc, key) => acc && acc[key], obj);
        if (typeof value === 'object' && value !== null) return path;
        if (typeof value === 'string') return value;
        return path;
    };

    const toggleParent = (menu) => {
        if (activeParent?.id === menu.id) {
            setActiveParent(null);
        } else {
            setActiveParent(menu);
        }
    };

    const isActiveMain = (menu) => {
        if (activeParent?.id === menu.id) return true;
        if (menu.type === 1 && route().current(menu.uri)) return true;
        return false;
    };

    const isSuperAdmin = auth.user?.super_administrador == 1;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setRolOpen(false);
                setAdminOpen(false);
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        if (isDark) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <aside
            ref={sidebarRef}
            className={`relative flex flex-col h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out z-40 ${collapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Floating toggle handle — ALWAYS visible */}
            <button
                onClick={onToggle}
                className={`absolute top-6 -right-3 z-50 w-6 h-10 flex items-center justify-center rounded-r-lg bg-ibg-900 text-white shadow-lg hover:bg-ibg-800 transition-colors`}
                title={collapsed ? "Expandir menú" : "Colapsar menú"}
            >
                <i className={`pi ${collapsed ? 'pi-angle-right' : 'pi-angle-left'} text-xs`}></i>
            </button>

            {/* Logo Header */}
            <div className={`flex items-center h-16 px-4 border-b border-slate-100 dark:border-slate-800 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                <Link href="/main" className="flex items-center gap-3 overflow-hidden">
                    <img
                        src={ziggy.url + "/images/PNG/logo_blanco.png"}
                        className="h-8 w-auto object-contain brightness-0 dark:brightness-100 invert dark:invert-0 transition-all"
                        alt="Logo"
                    />
                    {!collapsed && (
                        <span className="font-bold text-lg text-ibg-900 dark:text-white whitespace-nowrap tracking-tight">
                            Gestor Documental
                        </span>
                    )}
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
                {/* Dashboard shortcut */}
                <Link
                    href={route('main')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        route().current('main')
                            ? 'bg-ibg-900 text-white shadow-md shadow-ibg-900/20'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Dashboard' : undefined}
                >
                    <i className="pi pi-home text-base"></i>
                    {!collapsed && <span className="truncate">Dashboard</span>}
                </Link>

                <div className="my-3 border-t border-slate-100 dark:border-slate-800"></div>

                {/* Dynamic Menus */}
                {menus.map((menu) => (
                    <div key={menu.id}>
                        <button
                            onClick={() => toggleParent(menu)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActiveMain(menu)
                                    ? 'bg-ibg-50 dark:bg-ibg-900/30 text-ibg-900 dark:text-ibg-300'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            } ${collapsed ? 'justify-center' : ''}`}
                            title={collapsed ? getNestedValue(translations.menu, menu.title) : undefined}
                        >
                            {menu.icon && <i className={`${menu.icon} text-base`}></i>}
                            {!collapsed && (
                                <>
                                    <span className="flex-1 text-left truncate">{getNestedValue(translations.menu, menu.title)}</span>
                                    <i className={`pi pi-chevron-down text-xs transition-transform duration-200 ${activeParent?.id === menu.id ? 'rotate-180' : ''}`}></i>
                                </>
                            )}
                        </button>

                        {/* Accordion submenu */}
                        {!collapsed && activeParent?.id === menu.id && subMenus.length > 0 && (
                            <div className="ml-2 mt-1 space-y-0.5 border-l-2 border-slate-100 dark:border-slate-800 pl-2">
                                {subMenus.map((sub) => (
                                    <div key={sub.id}>
                                        <Link
                                            href={sub.type === 1 ? route(sub.uri) : sub.uri}
                                            preserveState
                                            preserveScroll
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                selectedSub === sub.id
                                                    ? 'bg-ibg-100 dark:bg-ibg-900/40 text-ibg-900 dark:text-ibg-300 font-semibold'
                                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                                            }`}
                                            onClick={() => setSelectedSub(sub.id)}
                                        >
                                            {sub.icon && <i className={`${sub.icon} text-xs`}></i>}
                                            <span className="truncate">{getNestedValue(translations.menu, sub.title)}</span>
                                        </Link>
                                        {sub.children && sub.children.length > 0 && (
                                            <div className="ml-5 mt-0.5 space-y-0.5">
                                                {sub.children.map((child) => (
                                                    <Link
                                                        key={child.id}
                                                        href={child.type === 1 ? route(child.uri) : child.uri}
                                                        preserveState
                                                        preserveScroll
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                                    >
                                                        {child.icon && <i className={`${child.icon} text-[10px]`}></i>}
                                                        <span className="truncate">{getNestedValue(translations.menu, child.title)}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Bottom Actions — Collapsible Settings Section */}
            <div className="px-3 pb-5 border-t border-slate-100 dark:border-slate-800">
                {!collapsed && (
                    <button
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <span>Configuración</span>
                        <i className={`pi pi-chevron-down text-xs transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`}></i>
                    </button>
                )}

                {/* Collapsed sidebar: single gear icon that opens a popover with all settings */}
                {collapsed && (
                    <div className="pt-3 flex flex-col items-center gap-2">
                        <button
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${settingsOpen ? 'bg-ibg-50 dark:bg-ibg-900/30 text-ibg-900 dark:text-ibg-300' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title="Configuración"
                        >
                            <i className="pi pi-cog text-lg"></i>
                        </button>
                        {settingsOpen && (
                            <div className="absolute bottom-16 left-20 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                                <button onClick={toggleDarkMode} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                                    <i className="pi pi-moon"></i>Modo oscuro
                                </button>
                                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700">
                                    <LanguageSwitcher isFixed={false} btn_class="text-slate-600 dark:text-slate-300 text-sm" fontSize="0.875rem" />
                                </div>
                                {auth.user?.roles && auth.user.roles.length > 1 && auth.user.roles.map((role) => (
                                    <button key={role.id} onClick={() => handleSwitchRole(role.id)} className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 ${role.id === auth.current_role_id ? 'bg-ibg-900 text-white font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                                        <i className="pi pi-id-card"></i>{role.name}
                                    </button>
                                ))}
                                {isSuperAdmin && (
                                    <>
                                        <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                        <Link href={route("usuarios.index")} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"><i className="fa-solid fa-user mr-2"></i>{translations.menu.navbar.list_configuration.users}</Link>
                                        <Link href={route("menus.index")} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"><i className="fa-solid fa-bars mr-2"></i>{translations.menu.navbar.list_configuration.menus}</Link>
                                        <Link href={route("roles.index")} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"><i className="fa fa-users mr-2"></i>{translations.menu.navbar.list_configuration.rol}</Link>
                                        <Link href={route("permisos.index")} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"><i className="fa-solid fa-lock mr-2"></i>{translations.menu.navbar.list_configuration.permissions}</Link>
                                        <Link href={route("main.company")} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"><i className="fa-solid fa-building mr-2"></i>{translations.menu.navbar.company}</Link>
                                    </>
                                )}
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                <Link href={route("usuarios.edit-user-login", auth.user.id)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"><i className="fa-solid fa-address-card mr-2"></i>{translations.menu.navbar.list_profile.profile}</Link>
                                <Link as="button" href={route("logout")} method="post" className="block w-full text-left px-4 py-2 text-sm text-terracotta-500 hover:bg-slate-50 dark:hover:bg-slate-700"><i className="fa fa-sign-out mr-2"></i>{translations.menu.navbar.list_profile.log_out}</Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Expanded sidebar: accordion content */}
                {!collapsed && settingsOpen && (
                    <div className="space-y-0.5 pt-1 pb-2">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <i className="pi pi-moon text-base"></i>
                            <span>Modo oscuro</span>
                        </button>

                        {/* Language Switcher */}
                        <div className="px-3 py-2">
                            <LanguageSwitcher isFixed={false} btn_class="text-slate-600 dark:text-slate-300" fontSize="1rem" />
                        </div>

                        {/* Role Switcher */}
                        {auth.user?.roles && auth.user.roles.length > 1 && (
                            <div className="relative">
                                <button
                                    onClick={() => { setRolOpen(!rolOpen); setAdminOpen(false); setProfileOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        rolOpen ? 'bg-ibg-50 dark:bg-ibg-900/30 text-ibg-900 dark:text-ibg-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <i className="pi pi-id-card text-base"></i>
                                    <span className="flex-1 text-left truncate">{currentRole?.name || 'Rol'}</span>
                                    <i className="pi pi-chevron-down text-xs"></i>
                                </button>
                                {rolOpen && (
                                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-50">
                                        {auth.user.roles.map((role) => (
                                            <button
                                                key={role.id}
                                                onClick={() => handleSwitchRole(role.id)}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                                    role.id === auth.current_role_id
                                                        ? 'bg-ibg-900 text-white font-semibold'
                                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                {role.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Admin dropdown */}
                        {isSuperAdmin && (
                            <div className="relative">
                                <button
                                    onClick={() => { setAdminOpen(!adminOpen); setRolOpen(false); setProfileOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        adminOpen ? 'bg-ibg-50 dark:bg-ibg-900/30 text-ibg-900 dark:text-ibg-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <i className="pi pi-cog text-base"></i>
                                    <span className="flex-1 text-left truncate">{translations.menu.navbar.administration}</span>
                                    <i className="pi pi-chevron-down text-xs"></i>
                                </button>
                                {adminOpen && (
                                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-50">
                                        <Link href={route("usuarios.index")} onClick={() => setAdminOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            <i className="fa-solid fa-user mr-2"></i>{translations.menu.navbar.list_configuration.users}
                                        </Link>
                                        <Link href={route("menus.index")} onClick={() => setAdminOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            <i className="fa-solid fa-bars mr-2"></i>{translations.menu.navbar.list_configuration.menus}
                                        </Link>
                                        <Link href={route("roles.index")} onClick={() => setAdminOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            <i className="fa fa-users mr-2"></i>{translations.menu.navbar.list_configuration.rol}
                                        </Link>
                                        <Link href={route("permisos.index")} onClick={() => setAdminOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            <i className="fa-solid fa-lock mr-2"></i>{translations.menu.navbar.list_configuration.permissions}
                                        </Link>
                                        <Link href={route("main.company")} onClick={() => setAdminOpen(false)} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            <i className="fa-solid fa-building mr-2"></i>{translations.menu.navbar.company}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* User Profile */}
                        <div className="relative pt-1 border-t border-slate-100 dark:border-slate-800 mt-1">
                            <button
                                onClick={() => { setProfileOpen(!profileOpen); setRolOpen(false); setAdminOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                    profileOpen ? 'bg-ibg-50 dark:bg-ibg-900/30 text-ibg-900 dark:text-ibg-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ibg-700 to-ibg-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {auth.user.usuario?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="flex-1 text-left truncate">{auth.user.usuario}</span>
                                <i className="pi pi-chevron-down text-xs"></i>
                            </button>
                            {profileOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-50">
                                    <Link
                                        href={route("usuarios.edit-user-login", auth.user.id)}
                                        onClick={() => setProfileOpen(false)}
                                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    >
                                        <i className="fa-solid fa-address-card mr-2"></i>{translations.menu.navbar.list_profile.profile}
                                    </Link>
                                    <Link
                                        as="button"
                                        href={route("logout")}
                                        method="post"
                                        className="block w-full text-left px-4 py-2 text-sm text-terracotta-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    >
                                        <i className="fa fa-sign-out mr-2"></i>{translations.menu.navbar.list_profile.log_out}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
