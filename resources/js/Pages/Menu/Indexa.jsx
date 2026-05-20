import React, { useEffect, useState, useRef } from "react";
import Icon from "@/components/Icon";
import TableButton from "@/components/TableButton";
import { useForm, Link, usePage, router, Head } from "@inertiajs/react";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";

export default function Index({ auth }) {
    const { menus, queryMenus, page, translations } = usePage().props;
    const {
        data,
        setData,
        get,
        delete: destroy,
        errors,
    } = useForm({
        queryMenus: queryMenus || "",
        page: page || "",
        status: "0",
    });

    const cambiarEstado = (id, estado) => {
        let nomEstado,
            titulo = "";
        if (estado == 1) {
            nomEstado = "activar";
            titulo = "Activado";
        } else {
            nomEstado = "inactivar";
            titulo = "Inactivado";
        }
        Swal.fire({
            title: "Esta seguro de " + nomEstado + " el Menu?",
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#026882",
            cancelButtonColor: "#AE0C22",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .put(route("menu.cambioEstado"), {
                        id: id,
                        estado: estado,
                    })
                    .then((response) => {
                        router.get(
                            route("menus.index"),
                            {},
                            { preserveScroll: true, preserveState: false }
                        );
                        Swal.fire(
                            "Exitoso!",
                            "El Menu ha sido " + titulo + " con éxito.",
                            "success"
                        );
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
        });
    };

    function handleSearch(e) {
        e.preventDefault();
        get(route("menus.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Menús" />
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <div className="max-w-[97%] mx-auto sm:px-6">
                        <div className="h-8 py px-2 overflow-hidden shadow-sm sm:rounded-md mb-5 border-[#E5E7EB] border">
                            <Link
                                href={route("menus.index")}
                                className="text-[#02558A] hover:text-[#0088be8c] text-lg font-roboto italic"
                            >
                                Menus
                            </Link>
                        </div>
                    </div>
                    <div className="max-w-[97%] mx-auto sm:px-6">
                        <div className="lg:flex items-center justify-between mb-6 px-1">
                            <div className="justify-start lg:w-1/2 w-full mb-5">
                                <div className="max-sm:ml-1 mt-2">
                                    <form
                                        className="inline-flex rounded-md shadow-sm w-full"
                                        onSubmit={handleSearch}
                                    >
                                        <input
                                            type="text"
                                            id="queryUsers"
                                            name="queryUsers"
                                            className="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                            value={data.queryMenus}
                                            placeholder="Buscar"
                                            onChange={(e) =>
                                                setData(
                                                    "queryMenus",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="submit"
                                            className="bg-transparent border-0 text-gray-900 -ml-6"
                                        >
                                            <i className="fa-solid fa-search"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <Link
                                className="btn_principal max-sm:text-xs"
                                href={route("menus.create")}
                                preserveScroll={true}
                                preserveState={true}
                            >
                                <div className="w-4 h-4 mr-2">
                                    <Icon
                                        className="w-4 h-4 text-white fill-current group-hover:text-gray-300 focus:text-gray-300"
                                        name="agregar"
                                    />
                                </div>{" "}
                                Crear Menú
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <table className="w-full border text-center text-base font-semibold table-auto whitespace-nowrap mb-5">
                            <thead className="border-t font-medium border-2 border-grey-900 ">
                                <tr className="font-bold text-center  bg-[#D0D3D4]">
                                    <th className="border-l px-6 pt-5 pb-4">
                                        #
                                    </th>
                                    <th className="border-l px-6 pt-5 pb-4">
                                        Titulo
                                    </th>
                                    <th className="border-l px-6 pt-5 pb-4">
                                        URL/Ruta
                                    </th>
                                    <th className="border-l p-2 px-6 pt-5 pb-4">
                                        Padre
                                    </th>
                                    <th className="border-l px-6 pt-5 pb-4">
                                        Estado
                                    </th>
                                    <th className="border-l px-6 pt-5 pb-4 text-center">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {menus.data.map((menus) => (
                                    <tr key={menus.id} className="">
                                        <td className="border-t border-l p-2 ">
                                            {menus.id}
                                        </td>
                                        <td className="border-t border-l p-2">
                                            {menus.title}
                                        </td>
                                        <td className="border-t border-l p-2">
                                            {menus.uri}
                                        </td>
                                        <td className="border-t border-l p-2">
                                            {menus.parent
                                                ? menus.title_parents
                                                : ""}
                                        </td>
                                        <td className="border-t border-l p-2">
                                            {menus.status == true ? (
                                                <span className="badge badge-outline-success">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="badge badge-outline-danger">
                                                    Inactivo
                                                </span>
                                            )}
                                        </td>
                                        <td className="border-t border-l p-2 whitespace-nowrap space-x-2 centrar">
                                            <Link
                                                type="button"
                                                tabIndex="1"
                                                href={route(
                                                    "menus.edit",
                                                    menus.id
                                                )}
                                            >
                                                <div className="w-6 h-6">
                                                    <Icon
                                                        className="editar_tabla "
                                                        name="edit"
                                                    />
                                                </div>
                                            </Link>{" "}
                                            {menus.status == true ? (
                                                <div className="w-8 h-8">
                                                    <TableButton
                                                        className="contenedor_boton_tabla "
                                                        onClick={() =>
                                                            cambiarEstado(
                                                                menus.id,
                                                                0
                                                            )
                                                        }
                                                    >
                                                        <div className="w-6 h-6  ">
                                                            <Icon
                                                                className="eliminar_tabla "
                                                                name="trash"
                                                            />
                                                        </div>
                                                    </TableButton>
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8">
                                                    <TableButton
                                                        className="contenedor_boton_tabla"
                                                        onClick={() =>
                                                            cambiarEstado(
                                                                menus.id,
                                                                1
                                                            )
                                                        }
                                                    >
                                                        <div className="w-6 h-6">
                                                            <Icon
                                                                className="activar_tabla"
                                                                name="comprobado"
                                                            />
                                                        </div>
                                                    </TableButton>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {menus.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-6 py-4 border-t"
                                            colSpan="5"
                                        >
                                            No hay men&uacute;s registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination className="mt-6" links={menus.links} />
                    </div>
                </div>
            </div>
        </>
    );
}
