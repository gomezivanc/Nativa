import { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import axios from "axios";
import { router, usePage } from "@inertiajs/react";

const CompanyProfileFormal = ({ translations,company, entrada, salida, usuariosActivos , usuariosEliminados }) => {
    const [formData, setFormData] = useState({
        nit: company?.nit,
        name: company?.name,
        address: company?.address,
        phone: company?.phone,
        website: company?.website,
        email: company?.email,
        description: company?.description,
        logo: company?.logo,
        political_description: company?.political_description
    });
    const { ziggy} = usePage().props;

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    };

    const handleUpload = (event) => {
        const file = event.files[0];
        
        if (file) {
            setFormData({ ...formData, logo: file });
            toast.current.show({
                severity: "success",
                summary: translations.auth.company.update_logo_success,
                detail: translations.auth.company.update_logo_success,
                life: 3000,
            });
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            let formDataSend = new FormData()
            for (const key in formData) {
                if(formData[key]) {
                    formDataSend.append(key,formData[key])
                }
            }

            const res = await axios.post(route('main.company.store'),formDataSend,{
                headers: {
                    'Content-Type': 'multipart/form-data', // Asegúrate de enviar el encabezado adecuado
                },
            })
            toast.current.show({
                severity: "success",
                summary: translations.auth.company.update_success,
                detail: translations.auth.company.update_success_detail,
                life: 3000,
            });
            router.visit(route('main.company'))
        } catch (error) {
        } finally {
            setLoading(false);
            setEditMode(false);
        }
    };

    const handleCancel = () => {
    setEditMode(false);
    toast.current.show({
        severity: "info",
        summary: translations.auth.company.cancel_operation,
        detail: translations.auth.company.cancel_operation_detail,
        life: 3000,
    });
    };

    const renderField = (label, value, name, placeholder = "", type = "text", options = null) => {
    return (
        <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 block mb-2">{label}</label>
        {editMode ? (
            type === "dropdown" ? (
            <Dropdown
                id={name}
                name={name}
                value={formData[name]}
                options={options}
                onChange={(e) => setFormData({ ...formData, [name]: e.value })}
                placeholder={placeholder}
                className="w-full"
            />
            ) : type === "mask" ? (
            <InputMask
                id={name}
                name={name}
                mask="999.999.999-9"
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full"
            />
            ) : type === "phone" ? (
            <InputMask
                id={name}
                name={name}
                mask="(999) 999-9999"
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full"
            />
            ) : type === "textarea" ? (
            <textarea
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
            />
            ) : (
            <InputText
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full"
            />
            )
        ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded text-gray-800 text-wrap">{value || "-"}</div>
        )}
        </div>
    );
    };

    return (
    <div className="p-4 bg-gray-100 min-h-screen">
        <Toast ref={toast} />

        <div className="max-w-7xl mx-auto">
        <Card className="shadow-sm mb-4 border-0">
            <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 m-0">{translations.auth.company.profile_title}</h1>
            <div>
                {!editMode ? (
                <Button
                    label={translations.auth.company.edit_info}
                    icon="pi pi-pencil"
                    className="p-button-outlined p-button-secondary"
                    onClick={() => setEditMode(true)}
                />
                ) : (
                <div className="flex gap-2">
                    <Button
                    label={translations.auth.company.save_changes}
                    icon="pi pi-check"
                    className="p-button-outlined p-button-success"
                    loading={loading}
                    onClick={handleSave}
                    />
                    <Button
                    label={translations.auth.company.cancel}
                    icon="pi pi-times"
                    className="p-button-outlined p-button-secondary"
                    onClick={handleCancel}
                    />
                </div>
                )}
            </div>
            </div>

            <Divider className="my-3" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Columna izquierda - Logo e información básica */}
            <div className="lg:col-span-1">
                <div className="flex flex-col items-center mb-4">
                    <div className="w-48 h-48 bg-white border border-gray-300 rounded-md flex items-center justify-center overflow-hidden mb-3">
                        {formData.logo ? (
                            // Verifica si formData.logo es un archivo (File) o una URL (string)
                            typeof formData.logo === 'object' && formData.logo instanceof File ? (
                                <Image
                                    src={URL.createObjectURL(formData.logo) || "/placeholder.svg"}
                                    alt="Logotipo corporativo"
                                    width="100%"
                                    preview
                                />
                            ) : (
                                <Image
                                    src={ `${ziggy.url}`+'/getfile/?path='+formData.logo}
                                    alt="Logotipo corporativo"
                                    width="100%"
                                    preview
                                />
                            )
                        ) : (
                            <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                                <i className="pi pi-building text-5xl text-gray-400"></i>
                            </div>
                        )}
                    </div>

                {editMode && (
                    <FileUpload
                    mode="basic"
                    accept="image/*"
                    maxFileSize={2000000}
                    chooseLabel={translations.auth.company.update_logo}
                    className="w-full text-center"
                    customUpload
                    onSelect={handleUpload}
                    />
                )}
                </div>

                <Panel header={translations.auth.company.contact_info} className="mb-4">
                <div className="space-y-3">
                    <div className="flex items-start">
                    <i className="pi pi-envelope text-gray-600 mr-3 mt-1"></i>
                    <div className="w-full">
                        <p className="text-sm text-gray-600 font-semibold ">{translations.auth.company.email}</p>
                        <p className="break-words whitespace-normal w-full">{formData.email}</p>
                    </div>
                    </div>
                    <div className="flex items-start">
                    <i className="pi pi-phone text-gray-600 mr-3 mt-1"></i>
                    <div>
                        <p className="text-sm text-gray-600 font-semibold text-wrap">{translations.auth.company.phone}</p>
                        <p className="text-wrap">{formData.phone}</p>
                    </div>
                    </div>
                </div>
                </Panel>

                <Panel header={translations.auth.company.location}>
                <div className="space-y-3">
                    <div className="flex items-start">
                        <i className="pi pi-map-marker text-gray-600 mr-3 mt-1"></i>
                        <div>
                            <div className="text-sm text-gray-600 font-semibold">{translations.auth.company.address}</div>
                            <div>{formData.address}</div>
                        </div>
                    </div>
                </div>
                </Panel>
            </div>

            {/* Columna derecha - Información detallada */}
            <div className="lg:col-span-3">
                <Panel header={translations.auth.company.general_info} className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField(translations.auth.company.razon_social, formData.name, "name", translations.auth.company.razon_social)}
                    {renderField(translations.auth.company.nit, formData.nit, "nit", "Ej: 900.123.456-7", "mask")}
                </div>

                <div className="mt-4">
                    {renderField(
                    translations.auth.company.description,
                    formData.description,
                    "description",
                    translations.auth.company.description,
                    "textarea"
                    )}
                </div>

                <div className="mt-4">
                    {renderField(
                    translations.auth.company.data_processing,
                    formData.political_description,
                    "political_description",
                    translations.auth.company.data_processing,
                    "textarea"
                    )}
                </div>
                </Panel>

                <Panel header={`${translations.auth.company.location} y ${translations.auth.company.contact_info}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField(translations.auth.company.address, formData.address, "address", translations.auth.company.address)}
                    {renderField(translations.auth.company.phone, formData.phone, "phone", "(123) 456-7890", "phone")}
                    {renderField(
                    translations.auth.company.email,
                    formData.email,
                    "email",
                    translations.auth.company.email,
                    "email"
                    )}
                    {renderField(translations.auth.company.web, formData.website, "website", "https://www.google.com/", "website")}
                </div>
                </Panel>
                <br />

                <Panel header={`Datos Generales`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('Radicado Entrada', entrada)}
                    {renderField('Radicado Salida', salida)}
                    {renderField('Usuarios Activos',usuariosActivos)}
                    {renderField('Usuarios Inactivos', usuariosEliminados)}
                </div>
                </Panel>
            </div>
            </div>
        </Card>

        <div className="text-right text-sm text-gray-500 mt-2">
            {translations.auth.company.last_update.replace(':date', new Date().toLocaleDateString())}
        </div>
        </div>
    </div>
  );
};

export default CompanyProfileFormal;