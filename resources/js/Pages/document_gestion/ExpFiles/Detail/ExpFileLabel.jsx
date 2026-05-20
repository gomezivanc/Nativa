import { usePage } from "@inertiajs/react";
import { formatDate } from "../../../../hooks/useDate";

export default function ExpFileLabel({ expFile }) {
    const { translations } = usePage().props;
    const expTranslate = translations.documental_gestion.exp_files;

    if (!expFile) return null;

    return (
        <div className="bg-white-100 border rounded-md px-4 py-3 mb-4 text-sm font-medium text-gray-600">
            {expFile?.name}

            {" - "}
            {expFile?.dependency?.name}

            {" - "}
            {expFile?.number}

            {" - "}
            {expFile?.serie?.name}

            {" - "}
            {formatDate(expFile?.created_at)}

            {" - "}
            {expFile?.deleted_at
                ? expTranslate.form.state.inactive
                : expTranslate.form.state.active}
        </div>
    );
}
