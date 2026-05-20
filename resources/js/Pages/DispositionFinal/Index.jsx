import { useEffect, useState } from "react"
import { Table } from "./Table"
import { usePage } from "@inertiajs/react";
import { Tooltip } from "primereact/tooltip";
import { SpeedDial } from "primereact/speeddial";
import { Dialog } from "primereact/dialog";
import EliminateForm from "./EliminateForm";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ArchiveDialog } from "../document_gestion/ExpFiles/Dialogs/Archive";
import Show from "../document_gestion/ExpFiles/Show";
import Detail from "../document_gestion/ExpFiles/Detail";
import axios from "axios";
import { Button } from "primereact/button";

export default function Index() {
    const { translations,auth } = usePage()?.props;

    const [loading,setLoading] = useState({
        ADataE: false,
        ADataS: false,
        ADataCT: false,
        ADataMD: false,
    })

    const [ ADataE ,setADataE ] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [ ADataS ,setADataS ] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [ ADataCT ,setADataCt ] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [ ADataMD ,setADataMd ] = useState({
        data: [],
        currentPage: 1,
        lastPage: 0,
    })
    const [selectedItem, setSelectedItem] = useState([]);
    const [optionsTool, setOptionsTool] = useState([
    ]);
    const [ dialogDelete, setDialogDelete ] = useState(false);
    const [ cnTotal, setCnTotal ] = useState(false);
    const [ selectShow, setSelectShow ] = useState(false);
    const [ epxFile, setExpFiles ] = useState({});

    useEffect(() => {
        if(selectedItem.length == 0) {
            setOptionsTool([])
            return
        }

        if(selectedItem.every(i => i.is_dispo_final_delete == 0) && selectedItem.length == 1) {
            setOptionsTool([
                {
                    label: translations.archive_gestion.disposition_final.table.dials.approve_delete,
                    icon: 'pi pi-trash',
                    command: async () => {
                        const observation = selectedItem[0].observation_delete; // Aquí va la observación predefinida
                        // Mostrar la alerta de confirmación con la observación predefinida
                        const { isConfirmed } = await Swal.fire({
                            title: translations.archive_gestion.disposition_final.validate.are_sure,
                            text: translations.archive_gestion.disposition_final.validate.are_sure2,
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: translations.auth.yes_not.yes,
                            cancelButtonText: translations.auth.yes_not.no,
                            html: `
                            <p><strong>${translations.archive_gestion.disposition_final.modal_delete.observation}:</strong></p>
                            <p>${observation}</p>
                            `, // Mostrar la observación predefinida en el cuerpo de la alerta
                        });

                        // Si el usuario confirmó la aprobación
                        if (isConfirmed) {
                            // Aquí puedes manejar la lógica de aprobación
                            const res = await axios.post(route("files-exp.storeOnlyExpFile"),{
                                ids: [selectedItem[0].id],
                                is_dispo_final_delete: 1,
                                approved_deleted_dispo_id: auth.user.id
                            })
                            toast.success(translations.auth.success)
                            getTableData()
                        }
                    }
                },
            ])
            return
        }
        if(selectedItem.some(i => i.is_dispo_final_delete == 1)) {
            setOptionsTool([])
            return
        }

        if(selectedItem.every(i => i.is_dispo_final_conservation == 0) && selectedItem.length == 1) {
            setOptionsTool([
                {
                    label: translations.archive_gestion.disposition_final.table.dials.approve_con,
                    icon: 'pi pi-lock',
                    command: async () => {
                        const observation = selectedItem[0].observation_con; // Aquí va la observación predefinida
                        // Mostrar la alerta de confirmación con la observación predefinida
                        const { isConfirmed } = await Swal.fire({
                            title: translations.archive_gestion.disposition_final.validate.are_sure,
                            text: translations.archive_gestion.disposition_final.validate.are_sure2,
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: translations.auth.yes_not.yes,
                            cancelButtonText: translations.auth.yes_not.no,
                            html: `
                            <p><strong>${translations.archive_gestion.disposition_final.modal_delete.observation}:</strong></p>
                            <p>${observation}</p>
                            `, // Mostrar la observación predefinida en el cuerpo de la alerta
                        });

                        // Si el usuario confirmó la aprobación
                        if (isConfirmed) {
                            // Aquí puedes manejar la lógica de aprobación
                            const res = await axios.post(route("files-exp.storeOnlyExpFile"),{
                                ids: [selectedItem[0].id],
                                is_dispo_final_conservation: 1,
                                approved_conserver_user_id: auth.user.id
                            })
                            toast.success(translations.auth.success)
                            getTableData()
                        }
                    }
                },
            ])
            return
        }
        if(selectedItem.some(i => i.is_dispo_final_conservation == 1)) {
            setOptionsTool([])
            return
        }

        let options = []

        if(selectedItem.every(i => i.subserie.items_dispo_final_e || i.subserie.items_dispo_final_s || i.subserie.items_dispo_final_md)) {
            options.push(
                {
                    label: translations.menu.options_speed_dial.delete_dispo,
                    icon: 'pi pi-trash',
                    command: () => {
                        let expFile = selectedItem.find(i => i.filing)
                        if(expFile) {
                            toast.error(expFile.number+': '+translations.archive_gestion.disposition_final.radicate_aviable+': '+expFile.filing.filing_number)
                            return
                        }

                        setDialogDelete(true)
                    }
                },
            )
        }
        if(selectedItem.every(i => i.subserie.items_dispo_final_s || i.subserie.items_dispo_final_ct || i.subserie.items_dispo_final_md)) {
            options.push(
                {
                    label: translations.archive_gestion.disposition_final.table.dials.total_con,
                    icon: 'pi pi-lock',
                    command: () => {
                        setCnTotal(true)
                    }
                },
            )
        }

        if(selectedItem.length == 1) {
            options.push(
                {
                    label: translations.archive_gestion.disposition_final.table.dials.select,
                    icon: 'pi pi-check',
                    command: async () => {
                        const res = await axios.get(route('files-exp.Detail', selectedItem[0].id), {
                            headers: {
                                'Accept': 'application/json', // Para asegurar respuesta en JSON
                                'Content-Type': 'application/json'
                            }
                        });
                        setExpFiles(res.data.expFiles)

                        setSelectShow(true)
                    }
                },
            )
        }
        setOptionsTool(options)
    },[selectedItem])

    async function getData(page = 1,rows = 10,filters = {}) {
        let res = await axios.get(route("files-exp.list"),{
            params: {
                page: page,
                perPage: rows,
                onlyExp: true,
                ...filters
            }
        })
        return {
            data: res.data.data,
            per_page: res.data.per_page,
            currentPage: res.data.current_page,
            lastPage: res.data.total
        }
    }

    const getTableData = async (page = null, rows = null, type = null) => {
        // Definir el estado de carga de todos los datos
        setLoading(prev => ({
            ...prev,
            ADataE: !type || type === 'items_dispo_final_e',
            ADataS: !type || type === 'items_dispo_final_s',
            ADataCT: !type || type === 'items_dispo_final_ct',
            ADataMD: !type || type === 'items_dispo_final_md',
        }));

        // Mapeo de los tipos de datos disponibles
        const dataTypes = {
            items_dispo_final_e: setADataE,
            items_dispo_final_s: setADataS,
            items_dispo_final_ct: setADataCt,
            items_dispo_final_md: setADataMd,
        };

        // Verifica si se debe obtener un solo tipo o todos
        if (type && dataTypes[type]) {
            let data = await getData(page, rows, { [type]: true, only_dispo_final: true });
            dataTypes[type](data);
        } else {
            // Si no se especifica un tipo, se obtienen todos los datos
            await Promise.all(
                Object.entries(dataTypes).map(async ([key, setter]) => {
                    let data = await getData(page, rows, { [key]: true, only_dispo_final: true });
                    setter(data);
                })
            );
        }
        setSelectedItem([])
        // Finaliza la carga del estado correspondiente
        setLoading(prev => ({
            ...prev,
            ADataE: false,
            ADataS: false,
            ADataCT: false,
            ADataMD: false,
        }));
        setSelectShow(false)
    };


    useEffect(() => {
        getTableData()
    },[])

    async function updateExpFileCon(observation_con) {
        try {
            let data = {
                ids: selectedItem.map(i => i.id),
                conserver_user_id: auth.user.id,
                is_dispo_final_conservation: 0,
                observation_con: observation_con.observation_con,
            }

            const res = await axios.post(route("files-exp.storeOnlyExpFile"),data)
            toast.success(translations.auth.success)
        } catch (error) {
            console.error(error);
            toast.error(translations.auth.error)
        }finally{
            setCnTotal(false)
            getTableData()
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <Table selectedItem={selectedItem} setSelectedItem={setSelectedItem} data={ADataE} onPage={(e) => getTableData(e.page + 1,e.rows, 'items_dispo_final_e')}
            loading={loading.ADataE} title={translations.archive_gestion.disposition_final.items_dispo_final_e} />
            <Table selectedItem={selectedItem} setSelectedItem={setSelectedItem} data={ADataS} onPage={(e) => getTableData(e.page + 1,e.rows, 'items_dispo_final_s')}
            loading={loading.ADataS} title={translations.archive_gestion.disposition_final.items_dispo_final_s} />
            <Table selectedItem={selectedItem} setSelectedItem={setSelectedItem} data={ADataCT} onPage={(e) => getTableData(e.page + 1,e.rows, 'items_dispo_final_ct')}
            loading={loading.ADataCT} title={translations.archive_gestion.disposition_final.items_dispo_final_ct} />
            <Table selectedItem={selectedItem} setSelectedItem={setSelectedItem} data={ADataMD} onPage={(e) => getTableData(e.page + 1,e.rows, 'items_dispo_final_md')}
            loading={loading.ADataMD} title={translations.archive_gestion.disposition_final.items_dispo_final_md} />
            <Tooltip key={optionsTool.length} target=".speeddial-bottom-right .p-speeddial-action" position="left" />
            <SpeedDial model={optionsTool} direction="up" className="speeddial-bottom-right right-4 bottom-4" buttonClassName='btn-open'  />
            <Dialog visible={dialogDelete} style={{ width: '50vw' }} onHide={() => {if (!dialogDelete) return; setDialogDelete(false); }}>
                <EliminateForm ids={selectedItem.map(i => i.id)} emitFinish={() => {
                    getTableData(); setDialogDelete(false); setSelectedItem([]);
                    }} />
            </Dialog>
            <Dialog visible={cnTotal} style={{ width: '50vw' }} onHide={() => {if (!cnTotal) return; setCnTotal(false); }}>
                <h2 className='md:col-span-3 font-bold'>{translations.archive_gestion.disposition_final.modal_con}</h2>
                <ArchiveDialog  exp_files_ids={selectedItem} onSearch={updateExpFileCon} withObservation />
            </Dialog>
            <Dialog visible={selectShow} style={{ width: '100%' }} onHide={() => {if (!selectShow) return; setSelectShow(false); }} maximizable>
                <h2 className='md:col-span-3 font-bold'>{translations.menu.options_speed_dial.select}</h2>
                {
                    epxFile &&
                    <Detail data={selectedItem} expFiles={epxFile} withouthBack />
                }
                <div className="flex justify-center mt-4 gap-2">
                    {
                        (epxFile.subserie?.items_dispo_final_e || epxFile.subserie?.items_dispo_final_s || epxFile.subserie?.items_dispo_final_md)
                        && <Button label={translations.menu.options_speed_dial.delete_dispo} onClick={() => setDialogDelete(true)}/>
                    }
                    {
                        (epxFile.subserie?.items_dispo_final_s || epxFile.subserie?.items_dispo_final_ct || epxFile.subserie?.items_dispo_final_md)
                        && <Button label={translations.archive_gestion.disposition_final.table.dials.total_con} onClick={() => setCnTotal(true)}/>
                    }
                </div>
            </Dialog>
        </div>
    )
}
