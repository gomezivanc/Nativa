import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import DropdownG from "../../../components/Globals/Drodown";
import { useLoading } from "../../../Context/preloadContext";
import Switch from "../../../components/Globals/Switch";

export default function Index({ id, typeBodies, translations, buildings }) {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
        control,
        watch,
        clearErrors,
    } = useForm();
    const { fields, append, prepend, remove, swap, move, insert } =
        useFieldArray({
            control, // control props comes from useForm (optional: if you are using FormProvider)
            name: "physical_spaces_ubications", // unique name for your Field Array
        });

    const [departaments, setSelectDepartaments] = useState([]);
    const [cities, setSelectCities] = useState([]);
    const { setIsLoading } = useLoading();

    const dep_id = watch("dep_id");
    const building_id = watch("building_id");
    const is_exist = watch("is_exist");
    useEffect(() => {
        if (id) {
            getItem(id);
        }
        getDepartaments();
    }, []);
    useEffect(() => {
        getCities();
    }, [dep_id]);
    useEffect(() => {
        clearErrors();
        if(!is_exist) {
            setValue('building_id', null)
        }
    }, [is_exist]);
    useEffect(() => {
        if (!building_id) {
            return;
        }
    }, [building_id]);

    async function submit(data) {
        setIsLoading(true);
        try {
            delete data.ubication;
            const res = await axios.post(route("physicalspace.store"), data);
            toast.success(translations.auth.success);
            router.visit(route("physicalspace.index"));
        } catch (error) {
            toast.error(translations.auth.error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }
    async function getDepartaments() {
        const res = await axios.get(route("departamento.selectDepartamento"),{
            params: {
                country_id: 48
            }
        });
        setSelectDepartaments(res.data.departamentos);
    }
    async function getCities() {
        const res = await axios.post(route("ciudad.ciudades"), {
            id_departamento: getValues("dep_id"),
        });
        setSelectCities(res.data);
    }

    async function getItem(id) {
        const res = await axios.get(route("physicalspace.show", id));
        for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
                setValue(key, res.data[key]);
            }
        }

        res.data.ubications.forEach((u) => {
            append({
                floor: u.floor,
                file_area: u.file_area,
                rack: u.rack,
                module: u.module,
                panel: u.panel,
                box: u.box,
                type_body_id: u.type_body_id,
            });
        });
    }

    function pushUbication() {
        const form = getValues("ubication");

        if (!form.floor) {
            toast.error(
                translations.archive_gestion.physicalSpace.form.error.floor
            );
            return;
        }

        append(form);
        setValue("ubication", {
            floor: "",
            file_area: "",
            rack: "",
            module: "",
            panel: "",
            box: "",
        });
    }

    function deleteUbication(index) {
        remove(index);
    }

    return (
        <div>
            <div className="md:px-20">
                <Card
                    header={
                        <div className="p-5 flex gap-1 flex-col">
                            <div>
                                <Link href={route("physicalspace.index")}>
                                    <Button
                                        label={translations.auth.back}
                                        size="small"
                                    />
                                </Link>
                            </div>
                        </div>
                    }
                >
                    <form
                        onSubmit={handleSubmit(submit)}
                        className="grid gap-2 grid-cols-1 md:grid-cols-3 items-end"
                    >
                        <h2 className="md:col-span-3 font-bold">
                            {
                                translations.archive_gestion.physicalSpace.form
                                    .title1
                            }
                        </h2>
                        <hr className="md:col-span-3" />

                        <span className="flex flex-col">
                            <label htmlFor="">
                                {
                                    translations.archive_gestion.physicalSpace
                                        .form.is_exist
                                }
                            </label>
                            <Switch
                                control={control}
                                name="is_exist"
                                trueLabel={translations.auth.yes_not.yes}
                                falseLabel={translations.auth.yes_not.no}
                            />
                        </span>
                        {is_exist == 1 ? (
                            <>
                                <span className="flex flex-col">
                                    <label htmlFor="building_id">
                                        {
                                            translations.archive_gestion
                                                .physicalSpace.form.name
                                        }
                                    </label>
                                    <DropdownG
                                        control={control}
                                        rules={{
                                            validate: (value) =>
                                                value || watch("name")
                                                    ? true
                                                    : translations.validation
                                                          .attributes
                                                          .field_required,
                                        }}
                                        optionValue="id"
                                        optionLabel="name"
                                        name="building_id"
                                        options={buildings}
                                    />
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="flex flex-col">
                                    <label htmlFor="name">
                                        {
                                            translations.archive_gestion
                                                .physicalSpace.form.name
                                        }
                                    </label>
                                    <InputText
                                        {...register("name", {
                                            validate: (value) =>
                                                value || watch("building_id")
                                                    ? true
                                                    : translations.validation
                                                          .attributes
                                                          .field_required,
                                        })}
                                        className={{
                                            "p-invalid": errors?.name,
                                            "w-full": true,
                                        }}
                                    />
                                    {errors?.name && (
                                        <span className="text-red-600">
                                            {errors.name?.message}
                                        </span>
                                    )}
                                </span>
                            </>
                        )}

                        <span className="flex flex-col">
                            <label htmlFor="username">
                                {
                                    translations.archive_gestion.physicalSpace
                                        .form.dep_id
                                }
                            </label>
                            <DropdownG
                                control={control}
                                rules={{
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                }}
                                optionValue="id"
                                optionLabel="nombre"
                                name="dep_id"
                                options={departaments}
                            />
                        </span>
                        <span className="flex flex-col">
                            <label htmlFor="username">
                                {
                                    translations.archive_gestion.physicalSpace
                                        .form.ciu_id
                                }
                            </label>
                            <DropdownG
                                control={control}
                                rules={{
                                    required:
                                        translations.validation.attributes
                                            .field_required,
                                }}
                                optionValue="id"
                                optionLabel="nombre"
                                name="ciu_id"
                                options={cities}
                            />
                        </span>

                        <h3 className="md:col-span-3 font-bold">
                            {
                                translations.archive_gestion.physicalSpace.form
                                    .title2
                            }
                        </h3>
                        <hr className="md:col-span-3" />

                        {!id && (
                            <>
                                <span className="flex flex-col">
                                    <label htmlFor="username">
                                        {
                                            translations.archive_gestion
                                                .physicalSpace.form.floor
                                        }
                                    </label>
                                    <InputText
                                        type="number"
                                        {...register("ubication.floor")}
                                        className={{
                                            "p-invalid": errors?.floor,
                                            "w-full": true,
                                        }}
                                    />
                                    {errors?.floor && (
                                        <span className="text-red-600">
                                            {errors.floor?.message}
                                        </span>
                                    )}
                                </span>
                                <span className="flex flex-col">
                                    <label htmlFor="username">
                                        {
                                            translations.archive_gestion
                                                .physicalSpace.form.file_area
                                        }
                                    </label>
                                    <InputText
                                        {...register("ubication.file_area")}
                                        className={{
                                            "p-invalid": errors?.file_area,
                                            "w-full": true,
                                        }}
                                    />
                                    {errors?.file_area && (
                                        <span className="text-red-600">
                                            {errors.file_area?.message}
                                        </span>
                                    )}
                                </span>
                                <span className="flex flex-col">
                                    <label htmlFor="username">
                                        {
                                            translations.archive_gestion
                                                .physicalSpace.form.rack
                                        }
                                    </label>
                                    <InputText
                                        type="number"
                                        {...register("ubication.rack")}
                                        className={{
                                            "p-invalid": errors?.rack,
                                            "w-full": true,
                                        }}
                                    />
                                    {errors?.rack && (
                                        <span className="text-red-600">
                                            {errors.rack?.message}
                                        </span>
                                    )}
                                </span>
                                <span className="flex flex-col">
                                    <label htmlFor="username">
                                        {
                                            translations.archive_gestion
                                                .physicalSpace.form.module
                                        }
                                    </label>
                                    <InputText
                                        type="number"
                                        {...register("ubication.module")}
                                        className={{
                                            "p-invalid": errors?.module,
                                            "w-full": true,
                                        }}
                                    />
                                    {errors?.module && (
                                        <span className="text-red-600">
                                            {errors.module?.message}
                                        </span>
                                    )}
                                </span>
                                <span className="flex flex-col">
                                    <label htmlFor="username">
                                        {
                                            translations.archive_gestion
                                                .physicalSpace.form.panel
                                        }
                                    </label>
                                    <InputText
                                        type="number"
                                        {...register("ubication.panel")}
                                        className={{
                                            "p-invalid": errors?.panel,
                                            "w-full": true,
                                        }}
                                    />
                                    {errors?.panel && (
                                        <span className="text-red-600">
                                            {errors.panel?.message}
                                        </span>
                                    )}
                                </span>
                                <span className="flex flex-col">
                                    <label htmlFor="username">
                                        {
                                            translations.archive_gestion
                                                .physicalSpace.form.box
                                        }
                                    </label>
                                    <InputText
                                        type="number"
                                        {...register("ubication.box")}
                                        className={{
                                            "p-invalid": errors?.box,
                                            "w-full": true,
                                        }}
                                    />
                                    {errors?.box && (
                                        <span className="text-red-600">
                                            {errors.box?.message}
                                        </span>
                                    )}
                                </span>

                                <span className="flex flex-col">
                                    <label htmlFor="username">
                                        {
                                            translations.archive_gestion
                                                .physicalSpace.form.type_body_id
                                        }
                                    </label>
                                    <DropdownG
                                        control={control}
                                        options={typeBodies}
                                        optionValue="id"
                                        optionLabel="name"
                                        name="ubication.type_body_id"
                                    />
                                </span>

                                <span className="flex flex-col">
                                    <Button
                                        label={
                                            translations.archive_gestion
                                                .physicalSpace.form.add_ubi
                                        }
                                        type="button"
                                        onClick={pushUbication}
                                    />
                                </span>
                            </>
                        )}
                        <div className="flex flex-col md:col-span-3">
                            <Accordion multiple>
                                {fields.map((ubication, index) => (
                                    <AccordionTab
                                        header={
                                            <div className="w-full">
                                                <span className="flex items-center justify-between gap-2 w-full">
                                                    {`${translations.archive_gestion.physicalSpace.form.floor} ${ubication.floor}`}
                                                    {!id && (
                                                        <Button
                                                            icon="pi pi-trash"
                                                            severity="danger"
                                                            onClick={() =>
                                                                deleteUbication(
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                        }
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <table className="text-sm border-collapse border border-gray-300">
                                                <thead className="bg-gray-100 text-gray-700">
                                                    <tr>
                                                        <th className="text-center p-3 font-semibold border border-gray-300">
                                                            {
                                                                translations
                                                                    .archive_gestion
                                                                    .physicalSpace
                                                                    .form
                                                                    .file_area
                                                            }
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="text-gray-600">
                                                        <td className="p-3 text-center border border-gray-300">
                                                            {
                                                                ubication.file_area
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className="text-sm border-collapse border border-gray-300">
                                                <thead className="bg-gray-100 text-gray-700">
                                                    <tr>
                                                        <th className="text-center p-3 font-semibold border border-gray-300">
                                                            {
                                                                translations
                                                                    .archive_gestion
                                                                    .physicalSpace
                                                                    .form.module
                                                            }
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="text-gray-600">
                                                        <td className="p-3 text-center border border-gray-300">
                                                            {ubication.module}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className="text-sm border-collapse border border-gray-300">
                                                <thead className="bg-gray-100 text-gray-700">
                                                    <tr>
                                                        <th className="text-center p-3 font-semibold border border-gray-300">
                                                            {
                                                                translations
                                                                    .archive_gestion
                                                                    .physicalSpace
                                                                    .form.panel
                                                            }
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="text-gray-600">
                                                        <td className="p-3 text-center border border-gray-300">
                                                            {ubication.panel}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className="text-sm border-collapse border border-gray-300">
                                                <thead className="bg-gray-100 text-gray-700">
                                                    <tr>
                                                        <th className="text-center p-3 font-semibold border border-gray-300">
                                                            {
                                                                translations
                                                                    .archive_gestion
                                                                    .physicalSpace
                                                                    .form.rack
                                                            }
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="text-gray-600">
                                                        <td className="p-3 text-center border border-gray-300">
                                                            {ubication.rack}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </AccordionTab>
                                ))}
                            </Accordion>
                        </div>

                        <div className="md:col-span-3">
                            <Button
                                label={translations.configuration.trd.save}
                                className="col-span-2"
                                size="small"
                            />
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
