import React, { useEffect, useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import DynamicSelect from "@/components/DynamicSelect";
import DynamicTreeSelect from "@/components/DynamicTreeSelect";
import { iconList } from "@/components/models/iconList";
import { typeMethods } from "@/components/models/typeMethods";
import { typeOptions } from "@/components/models/typeOptions";
import { typeTargets } from "@/components/models/typeTargets";
import InputLabel from "@/components/InputLabel";
import TextInputs from "@/components/TextInputs";

export default function Edit({ auth }) {
    const { menu } = usePage().props;
    const { data, setData, errors, put } = useForm({
        id: menu.id,
        title: menu.title || "",
        type: menu.type || 1,
        uri: menu.uri || "",
        parent_id: menu.parentId || "0",
        target: menu.target || "",
        icon: menu.icon || "",
        method: menu.method || "GET",
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route("menus.update", menu.id));
    }

    const getSelectedType = (selectedOption) => {
        setData("type", selectedOption.id);
    };

    const getSelectedTarget = (selectedOption) => {
        setData("target", selectedOption.id);
    };

    const getSelectedMethod = (selectedOption) => {
        setData("method", selectedOption.id);
    };

    const getSelectedParent = (selectedOption, treeOpitons) => {
        setData("parent_id", selectedOption.value);
    };

    const getSelectedIcon = (selectedOption) => {
        setData("icon", selectedOption.id);
    };

    const getSelectedRoute = (selectedOption) => {
        setData("uri", selectedOption.id);
    };

    return (
        <>
            <Head title="Editar Menú" />
            <div>
                <div className="max-w-[97%] mx-auto sm:px-6">
                    <div className="h-8 py px-2 overflow-hidden shadow-sm sm:rounded-md mb-5 border-[#E5E7EB] border">
                        <Link
                            href={route("menus.index")}
                            className="text-[#02558A] hover:text-[#0088be8c] text-lg font-roboto italic"
                        >
                            Menus Edit
                        </Link>
                    </div>
                </div>
                <div className="mx-auto my-2 px-4">
                    <div className="p-8 bg-white rounded shadow">
                        <form name="createForm" onSubmit={handleSubmit}>
                            <div className="flex flex-col">
                                <div className="grid grid-cols-6 gap-3">
                                    <div className="col-span-3 lg:col-span-2">
                                        <div>
                                            <InputLabel
                                                forInput="title"
                                                value="Título"
                                                className="text-sm font-medium"
                                            />
                                            <TextInputs
                                                id="title"
                                                type="text"
                                                label="Titulo"
                                                className="mt-1 block"
                                                name="title"
                                                placeholder="Título"
                                                errors={errors.title}
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-3 lg:col-span-2">
                                        <div>
                                            <InputLabel
                                                forInput="tipo"
                                                value="Tipo"
                                                className="text-sm font-medium"
                                            />
                                            <DynamicSelect
                                                multiple={false}
                                                options={typeOptions}
                                                value={data.type}
                                                valueKey="id"
                                                labelKey="title"
                                                onChange={getSelectedType}
                                            />
                                            <span className="text-red-600">
                                                {errors.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 lg:col-span-2">
                                        <div>
                                            <InputLabel
                                                forInput="URL/Ruta"
                                                value="URL/Ruta"
                                                className="text-sm font-medium"
                                            />
                                            {data.type === 1 && (
                                                <DynamicSelect
                                                    urlRoute={"routes.index"}
                                                    multiple={false}
                                                    value={data.uri}
                                                    onChange={getSelectedRoute}
                                                />
                                            )}
                                            {data.type !== 1 && (
                                                <TextInputs
                                                    id="uri"
                                                    type="text"
                                                    label="URL/Ruta"
                                                    className="mt-1 block"
                                                    name="uri"
                                                    placeholder="URL/Ruta"
                                                    errors={errors.uri}
                                                    value={data.uri}
                                                    onChange={(e) =>
                                                        setData(
                                                            "uri",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-3 lg:col-span-2">
                                        <div>
                                            <InputLabel
                                                forInput="Padre"
                                                value="Padre"
                                                className="text-sm font-medium"
                                            />
                                            <DynamicTreeSelect
                                                urlRoute={"menus.all"}
                                                labelKey="title"
                                                valueKey="id"
                                                mode="radioSelect"
                                                onChange={getSelectedParent}
                                                placeholder="Seleccione Padre"
                                                defaultValue={data.parent_id}
                                            />
                                            <span className="text-red-600">
                                                {errors.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 lg:col-span-2">
                                        <div>
                                            <InputLabel
                                                forInput="Destino"
                                                value="Destino"
                                                className="text-sm font-medium"
                                            />
                                            <DynamicSelect
                                                multiple={false}
                                                options={typeTargets}
                                                value={data.target}
                                                valueKey="id"
                                                labelKey="title"
                                                onChange={getSelectedTarget}
                                            />
                                            <span className="text-red-600">
                                                {errors.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 lg:col-span-2">
                                        <div>
                                            <InputLabel
                                                forInput="Icono"
                                                value="Icono"
                                                className="text-sm font-medium"
                                            />
                                            <DynamicSelect
                                                multiple={false}
                                                withIcons={true}
                                                options={iconList}
                                                value={data.icon}
                                                valueKey="id"
                                                labelKey="name"
                                                onChange={getSelectedIcon}
                                            />
                                            <span className="text-red-600">
                                                {errors.icon}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 lg:col-span-2">
                                        <div>
                                            <InputLabel
                                                forInput="Método"
                                                value="Método"
                                                className="text-sm font-medium"
                                            />
                                            <DynamicSelect
                                                multiple={false}
                                                options={typeMethods}
                                                value={data.method}
                                                valueKey="id"
                                                labelKey="title"
                                                onChange={getSelectedMethod}
                                            />
                                            <span className="text-red-600">
                                                {errors.method}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid justify-items-stretch px-8 py-4 border-t border-gray-200">
                                <div className="mt-4 justify-self-end space-x-2">
                                    <button
                                        type="submit"
                                        className="px-3 py-2 rounded bg-[#002F65] text-white text-sm font-bold whitespace-nowrap hover:bg-[#001E41] focus:bg-[#001E41]"
                                    >
                                        Actualizar
                                    </button>
                                    <Link
                                        href={route("menus.index")}
                                        className="px-3 py-2 rounded bg-[#667379] text-white text-sm font-bold whitespace-nowrap hover:bg-[#595D60] focus:bg-[#6F7477]"
                                    >
                                        Atrás
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
