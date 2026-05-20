import { Link, router, usePage } from '@inertiajs/react'
import { Card } from 'primereact/card'
import { useState } from "react";
import { Dialog } from 'primereact/dialog'
import SubserieForm from './Dialogs/SubserieForm'
import SerieForm from './Dialogs/SerieForm'
import IndiceForm from './Dialogs/IndiceForm'
import RetentionDetail from './Dialogs/RetentionDetail'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import axios from 'axios'

export default function Detail({ dependency }) {

    const { translations } = usePage()?.props
    const [openSerie, setOpenSerie] = useState(null)
    const [openSubserie, setOpenSubserie] = useState(null)
    const [showSerieDialog, setShowSerieDialog] = useState(false)
    const [showSubserieDialog, setShowSubserieDialog] = useState(false)
    const [serieSelected, setSerieSelected] = useState(null)
    const [subserieSelected, setSubserieSelected] = useState(null)
    const [showIndiceDialog, setShowIndiceDialog] = useState(false)
    const [retencionSelected, setRetencionSelected] = useState(null)
    const [indiceSelected, setIndiceSelected] = useState(null)
    const [modoIndice, setModoIndice] = useState('crear')
    

    const toggleSerie = (id) => {
        setOpenSerie(openSerie === id ? null : id)
        setOpenSubserie(null)
    }

    const toggleSubserie = (id) => {
        setOpenSubserie(openSubserie === id ? null : id)
    }

    const formatFecha = (fecha) => {
        if (!fecha) return '';

        return new Date(fecha).toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const addSerie = () => {   
        setSerieSelected(null)
        setShowSerieDialog(true)
    }

    const editSerie = (serie) => {
        setSerieSelected(serie)
        setShowSerieDialog(true)
    }

    const addSubserie = (serie) => {

        if (serie.retencion) {
            toast.warn("No puedes crear subseries en una serie que ya tiene retención");
            return;
        }

        setSerieSelected(serie)
        setSubserieSelected(null)
        setShowSubserieDialog(true)
    }

    const editSubserie = (subserie) => {
        setSubserieSelected(subserie)
        setShowSubserieDialog(true)
    }

    const disableSerie = (serie) => {
        if (serie.subseries?.length > 0) {
            toast.warn("No puedes deshabilitar una serie con subseries");
            return;
        }

        confirmDialog({
            message: '¿Estás seguro de deshabilitar esta serie?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, deshabilitar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await axios.delete(route('series.delete', { id: serie.id }));
                    toast.success("Serie deshabilitada correctamente");
                    router.reload();
                } catch (error) {
                    toast.error("Error al deshabilitar la serie");
                }
            }
        });
    };

    const disableSubserie = (subserie) => {
        confirmDialog({
            message: `Se deshabilitará la subserie "${subserie.name}"`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, deshabilitar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await axios.delete(route('subseries.delete', { id: subserie.id }));
                    toast.success("Subserie deshabilitada correctamente");
                    router.reload();
                } catch (error) {
                    toast.error("Error al deshabilitar la subserie");
                }
            }
        });
    };

    const deleteIndice = (indice, retencion) => {
        confirmDialog({
            message: `Se eliminará el índice "${indice.nombre || indice.name}"`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await axios.delete(route('retencion_indices.delete', { id: indice.id }));

                    toast.success("Índice eliminado correctamente");
                    router.reload();

                } catch (error) {
                    console.error(error);
                    toast.error("Error al eliminar el índice");
                }
            }
        });
    };
    
    const addIndice = (retencion) => {
        setModoIndice('crear')
        setRetencionSelected(retencion)
        setIndiceSelected(null)
        setShowIndiceDialog(true)
    }

    const editIndice = (indice, retencion) => {
        setModoIndice('editar')
        setRetencionSelected(retencion)
        setIndiceSelected(indice)
        setShowIndiceDialog(true)
    }

    return (
        <>
        <ConfirmDialog />
            <Card className="flex flex-col p-4">

                {/* HEADER */}
                <div className="bg-gray-50 border rounded-lg p-4 mb-6">

                    <div className="grid md:grid-cols-2 gap-4 text-sm">

                        {dependency.gd_dependency && (
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs"> {translations.documental_gestion.dependency.form.g_d_parent_id}</span>
                                <span className="font-semibold">{dependency.gd_dependency?.code} - {dependency.gd_dependency?.name}</span>
                            </div>
                        )}

                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs"> {translations.documental_gestion.dependency.form.updated_at} </span>
                            <span className="font-semibold"> {formatFecha(dependency.updated_at)} </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs"> {translations.documental_gestion.dependency.form.ofi_prod} </span>
                            <span className="font-semibold"> {dependency.code} - {dependency.name} </span>
                        </div>

                        {dependency.regional && (
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs"> {translations.documental_gestion.dependency.form.regional}  </span>
                                <span className="font-semibold"> {dependency.regional.name} </span>
                            </div>
                        )}

                    </div>
                </div>

                {/* HEADER SERIES */}
                <div className="flex justify-between items-center mb-4">

                    <h3 className="font-semibold text-lg flex items-center gap-2"> 
                        <i className="pi pi-folder text-yellow-600"></i> {translations.documental_gestion.retention.table.documentary_series}
                    </h3>

                    <button onClick={addSerie} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        <i className="pi pi-plus"></i> {translations.documental_gestion.trd_versioning.table.serie}
                    </button>

                </div>

                {/* TREE */}
                <div className="space-y-1">

                    {dependency.series?.map((serie) => (

                        <div key={serie.id}>

                            {/* SERIE */}
                            <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 transition">

                                <div onClick={() => toggleSerie(serie.id)} className="flex items-center gap-2 cursor-pointer">
                                    <i className={`pi ${openSerie === serie.id ? 'pi-chevron-down' : 'pi-chevron-right'}`}></i>
                                    <i className={`pi ${openSerie === serie.id ? 'pi-folder-open' : 'pi-folder'} text-yellow-600`}></i>
                                    <span className="font-medium">{serie.code} - {serie.name} </span>
                                </div>                            

                                {/* ACCIONES SERIE */}
                                <div className="flex gap-3 text-gray-500">                                
                                    <i onClick={() => addSubserie(serie)} className="pi pi-plus cursor-pointer hover:text-blue-600" title="Agregar subserie"></i>
                                    <i onClick={() => editSerie(serie)} className="pi pi-pencil cursor-pointer hover:text-green-600" title="Editar" ></i>
                                    <i onClick={() => disableSerie(serie)} className="pi pi-ban cursor-pointer hover:text-red-600" title="Deshabilitar" ></i>
                                </div>

                            </div>

                            {/* Detalle Retencion cuando no hay subseries */}
                            {(!serie.subseries || serie.subseries.length === 0) && (
                                <div className={`ml-8 overflow-hidden transition-all duration-300 ${openSerie === serie.id ? "max-h-[600px] mt-2" : "max-h-0"}`}>
                                    <RetentionDetail retencion={serie.retencion} translations={translations} onAddIndice={addIndice} onEditIndice={editIndice} deleteIndice={deleteIndice}/>
                                </div>
                            )}

                            {/* SUBSERIES */}
                            <div className={`ml-8 overflow-hidden transition-all duration-300 ${ openSerie === serie.id ? "max-h-[900px]" : "max-h-0"}`}>

                                {serie.subseries?.map((subserie) => (

                                    <div key={subserie.id} className="mt-1">

                                        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100">

                                            <div onClick={() => toggleSubserie(subserie.id)} className="flex items-center gap-2 cursor-pointer" >
                                                <i className={`pi ${openSubserie === subserie.id ? 'pi-chevron-down' : 'pi-chevron-right'}`}></i>
                                                <i className="pi pi-file text-gray-600"></i>
                                                <span> {subserie.code} - {subserie.name} </span>
                                            </div>

                                            {/* ACCIONES SUBSERIE */}
                                            <div className="flex gap-3 text-gray-500">
                                                <i onClick={() => editSubserie(subserie)}  className="pi pi-pencil cursor-pointer hover:text-green-600" title={translations.documental_gestion.dependency.dial.edit}></i>
                                                <i onClick={() => disableSubserie(subserie)} className="pi pi-ban cursor-pointer hover:text-red-600" title={translations.documental_gestion.dependency.dial.delete}></i>
                                            </div>

                                        </div>

                                        {/* Detalle Retencion */}
                                        <div className={`ml-8 overflow-hidden transition-all duration-300 ${openSubserie === subserie.id ? "max-h-[600px] mt-2" : "max-h-0"}`}>
                                            <RetentionDetail retencion={subserie.retencion} translations={translations} onAddIndice={addIndice} onEditIndice={editIndice} deleteIndice={deleteIndice}/>
                                        </div>

                                    </div>

                                ))}

                            </div>
                        </div>

                    ))}

                </div>
                
                <Dialog modal position="center" visible={showSerieDialog} header={serieSelected ? "Editar serie" : "Crear serie"} style={{ width: '40vw' }} onHide={() => setShowSerieDialog(false)}>
                    <SerieForm dependency={dependency} serie={serieSelected} onFinish={() => {
                            setShowSerieDialog(false)
                            setSerieSelected(null)
                    }} />
                </Dialog>

                <Dialog modal position="center" visible={showSubserieDialog} header={subserieSelected ? "Editar subserie" : "Crear subserie"} style={{ width: '50vw' }} onHide={() => setShowSubserieDialog(false)}>
                    <SubserieForm serie={serieSelected} subserie={subserieSelected} onFinish={()  => {
                        setShowSubserieDialog(false)
                        setSubserieSelected(null)
                    }} />
                </Dialog>

                <Dialog modal position="center" visible={showIndiceDialog} header={modoIndice === 'editar' ? 'Editar índice' : 'Agregar índice'} style={{ width: '40vw' }} 
                    onHide={() => {
                        setShowIndiceDialog(false)
                        setIndiceSelected(null)
                        setModoIndice('crear')
                    }}
                >
                    <IndiceForm retencion={retencionSelected} indice={indiceSelected} modo={modoIndice}
                        onFinish={() => {
                            setShowIndiceDialog(false)
                            setIndiceSelected(null)
                            setModoIndice('crear')
                            router.reload()
                        }}
                    />
                </Dialog>
                
            </Card>
        </>
    )
}