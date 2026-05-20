import { useState } from "react";
import DetailCard from "./Detail/Archive";
import IndexElec from "./Detail/IndexElec";
import { Button } from "primereact/button";
import { Link, usePage } from "@inertiajs/react";

export default function Detail({ expFiles }) {
    const [view,setView] = useState('detail')
    const { translations } = usePage().props;

    const handleViewChange = (view) => {
        setView(view)
    }
    return (
        <>
            <Button text icon="pi pi-angle-left" onClick={() => window.history.back()}>{ translations.auth.back }</Button>
            <DetailCard expFiles={expFiles} handleViewChange={handleViewChange} />
        </>
    );
}
