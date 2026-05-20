import { usePage } from "@inertiajs/react";
import { Card } from "primereact/card";
import { formatDate } from "../../../../hooks/useDate";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Documents from "./Documents";
import ExpFileLabel from "./ExpFileLabel";

export default function DetailCard({ expFiles, handleViewChange,withouthBack }) {
    const { translations, current_language } = usePage().props;
    const detailTranslate = translations.documental_gestion.exp_files.detail;
    const expTranslate = translations.documental_gestion.exp_files;

    function getFileName(fileDetail) {
        try {
            const file = JSON.parse(fileDetail);
            const name = file?.name?.split(".")[0] ?? null;
            return name;
        } catch (error) {
            console.error("Error parsing file detail:", error);
            return null;
        }
    }
    function getFileExtencion(fileDetail) {
        try {
            const file = JSON.parse(fileDetail);
            const name = file?.name?.split(".")[1] ?? null;
            return name;
        } catch (error) {
            console.error("Error parsing file detail:", error);
            return null;
        }
    }
    return (
        <>
            <ExpFileLabel expFile={expFiles} />
            <Card
                header={
                    <div className="p-4 flex flex-col md:flex-row md:justify-between">
                        <h3 className="text-xl font-bold">
                            {detailTranslate.detail_exp}
                        </h3>

                        <span className="text-blue-600 cursor-pointer" onClick={() => handleViewChange('logs')}>{detailTranslate.logs}</span>
                        <span className="text-blue-600 cursor-pointer" onClick={() => handleViewChange('index_elec')}>{detailTranslate.index_elec}</span>
                    </div>
                }
            >

                <div className="grid lg:grid-cols-6 gap-0 border border-gray-300">
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.code}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {expFiles?.number}
                    </div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.support}
                    </div>
                    <div className="border border-gray-300 p-2"></div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.state}
                    </div>
                    {/* <div className="border border-gray-300 p-2">
                        {expFiles?.deleted_at
                            ? expTranslate.form.state.inactive
                            : expTranslate.form.state.active}
                    </div> */}
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.name}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {expFiles?.name}
                    </div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.final_disposition}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {expFiles?.name}
                    </div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.ubication}
                    </div>
                    <div className="border border-gray-300 p-2"></div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.subject_administrative_matter}
                    </div>
                    <div className="border border-gray-300 p-2"></div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.years_retention}
                    </div>
                    <div className="border border-gray-300 p-2"></div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.last_loan}
                    </div>
                    <div className="border border-gray-300 p-2">-- --</div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.administrative_unit_responsible}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {expFiles?.dependency?.name}
                    </div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.file_start_date}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {formatDate(expFiles?.date_init)}
                    </div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.physically_exist}
                    </div>
                    {/* <div className="border border-gray-300 p-2">
                        {expFiles?.exist_p
                            ? translations.auth.yes_not.yes
                            : translations.auth.yes_not.no}
                    </div> */}
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.serie}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {expFiles?.serie?.name}
                    </div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.created_at}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {formatDate(expFiles.created_at, true)}
                    </div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.units_involved_file_management}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {expFiles.dependency?.name}
                    </div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.Subserie}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {expFiles.subserie?.name}
                    </div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.responsible_issuer}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {expFiles?.responsible?.persona?.nombre}{" "}
                        {expFiles?.responsible?.persona?.apellido}
                    </div>
                    <div className="font-bold border border-gray-300 p-2">
                        {detailTranslate.ranking}
                    </div>
                    <div className="border border-gray-300 p-2">
                        {expFiles.clasification["name_" + current_language]}
                    </div>
                </div>
            </Card>

            <Documents expFiles={expFiles} />
        </>
    );
}
