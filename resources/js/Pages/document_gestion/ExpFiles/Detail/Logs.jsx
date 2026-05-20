import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Badge } from "primereact/badge";
import { Timeline } from "primereact/timeline";
import { usePage } from "@inertiajs/react";
import { Button } from "primereact/button";
import ExpFileLabel from "./ExpFileLabel";

export default function ActivityLog({ expfile, handleViewChange }) {
    const { translations } = usePage().props;

    if (!expfile.logs || expfile.logs.length === 0) {
        return (
            <div className="p-4">
                <Card className="text-center p-5">
                    <div className="text-gray-500">
                        {translations.auth.not_found}
                    </div>
                </Card>
            </div>
        );
    }

    const timelineEvents = expfile.logs.map((log) => ({
        log,
        date: new Date(log.created_at),
    }));

    const customizedMarker = (item) => {
        return (
            <span className="flex w-8 h-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <i className="pi pi-clock text-sm"></i>
            </span>
        );
    };

    const customizedContent = (item) => {
        const log = item.log;

        return (
            <Card className="mb-3 shadow-sm border-l-4 border-l-primary w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <Badge value="Actividad" severity="info" />
                        <span className="text-sm text-gray-500">
                            {item.date.toLocaleDateString()} -{" "}
                            {item.date.toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                <Divider className="my-2" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <i className="pi pi-user text-primary"></i>
                            <span className="font-semibold">Usuario:</span>
                            <span className="text-primary">
                                {log?.causer?.persona?.nombre}{" "}
                                {log?.causer?.persona?.apellido}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <i className="pi pi-building text-primary"></i>
                            <span className="font-semibold">Dependencia:</span>
                            <span>{expfile?.dependency?.name}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <i className="pi pi-file-edit text-primary mt-1"></i>
                            <div>
                                <span className="font-semibold">
                                    Observación:
                                </span>
                                <p className="text-gray-700 mt-1">
                                    {log.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="p-4">
            <Button
                onClick={() => handleViewChange("detail")}
                text
                icon="pi pi-angle-left"
            >
                {translations.auth.back}
            </Button>
            <ExpFileLabel expFile={expfile} />

            <h2 className="text-xl font-bold mb-4">Historial de Actividades</h2>
            <Timeline
                value={timelineEvents}
                align="alternate"
                marker={customizedMarker}
                content={customizedContent}
                className="w-full"
            />
        </div>
    );
}
