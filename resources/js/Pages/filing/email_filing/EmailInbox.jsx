import { useState, useEffect } from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Avatar } from "primereact/avatar"
import { Toolbar } from "primereact/toolbar"
import { TruncatedHTML } from "../../../hooks/useTruncateHtml"
import { formatDate } from "../../../hooks/useDate"
import { usePage } from "@inertiajs/react"
import { useLoading } from "../../../Context/preloadContext"
import { Dialog } from "primereact/dialog"
import EmailDetail from "./EmailDetail"
import Create from '../standard_filing/Create'
import axios from "axios"

export default function EmailInbox() {
    const { translations } = usePage().props
    const { setIsLoading } = useLoading()
    const [emails, setEmails] = useState([]);
    const [radicateModal, setRadicateModal] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState(null);

    useEffect(() => {
        getEmails();
    }, []);

    async function getEmails(page = 1,rows = 10,filters = {}) {
        setIsLoading(true)
        const res = await axios.get(route('email.list'),{
            params: {
                page: page,
                perPage: rows,
                ...filters
            }
        })
        setEmails({
            data: res.data.data,
            per_page: res.data.per_page,
            currentPage: res.data.current_page,
            lastPage: res.data.total
        })
        setIsLoading(false)
    }

    const markAsRead = (email) => {
        const updatedEmails = emails.map((e) => {
            if (e.id === email.id) {
                return { ...e, read: true };
            }
            return e;
        });
        setEmails(updatedEmails);
    };

    const senderTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Avatar
                    label={rowData.user.persona.nombre.charAt(0)}
                    shape="circle"
                    style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                />
                <div>
                    <div className="font-bold">{rowData.user.usuario}</div>
                    <div className="text-sm text-color-secondary">
                        {rowData.user.email}
                    </div>
                </div>
            </div>
        );
    };

    const setFilingId = async (id) => {
        
        let data = {
            id: selectedEmails.id,
            filing_id: id
        }
        setIsLoading(true)
        try {
            const res = await axios.post(route('email.store'),data)
        } catch (error) {
            
        } finally {
            setRadicateModal(false)
            getEmails()
            setIsLoading(false)
        }
    }

    const subjectTemplate = (rowData) => {
        return (
            <div className="flex flex-col">
                <div className={rowData.read ? "" : "font-bold"}>
                    {rowData.subject}
                </div>
                <div
                    className="text-sm text-color-secondary truncate"
                    style={{ maxWidth: "300px" }}
                >
                    {TruncatedHTML({ html: rowData.body ,maxLength: 50})}
                </div>
            </div>
        );
    };

    const dateTemplate = (rowData) => {
        return <span className="text-sm">{formatDate(rowData.created_at,true)}</span>;
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-envelope"
                    rounded
                    text
                    severity={rowData.is_read ? "secondary" : "info"}
                    onClick={() => markAsRead(rowData)}
                    tooltip={rowData.is_read ? translations.filing.email_filing.form.mark_as_un_read : translations.filing.email_filing.form.mark_as_read}
                />
            </div>
        );
    };

    const toolbarContent = (
        <div className="flex justify-content-between">
            <div>
                <Button icon="pi pi-refresh" rounded text label={translations.filing.email_filing.table.refresh} onClick={getEmails} />
            </div>
        </div>
    );

    function page(data) {
        getEmails(data.page + 1,data.rows)
    }

    return (
        <div className="card">
            <h1 className="text-3xl font-bold mb-4">Inbox</h1>
            <Toolbar className="mb-4" start={toolbarContent} />
            <DataTable
                value={emails.data}
                selection={selectedEmails}
                onSelectionChange={(e) => {
                    setSelectedEmails(e.value)
                    setEmailModal(true)
                }}
                dataKey="id"
                lazy onPage={page} paginator
                rows={emails.per_page} totalRecords={emails.lastPage}
                rowsPerPageOptions={[5, 10, 25]}
                emptyMessage="No emails found"
                selectionMode="single"
                stripedRows
                className="p-datatable-sm"
            >
                <Column
                    field="sender"
                    header={ translations.filing.email_filing.table.from }
                    body={senderTemplate}
                    style={{ minWidth: "14rem" }}
                />
                <Column
                    header={ translations.filing.email_filing.table.inbox }
                    field='entrance_exit'
                    style={{ minWidth: "14rem" }}
                />
                <Column
                    field="subject"
                    header={ translations.filing.email_filing.table.subject }
                    body={subjectTemplate}
                    style={{ minWidth: "20rem" }}
                />
                <Column
                    field="date"
                    header={ translations.filing.email_filing.table.created_at }
                    body={dateTemplate}
                    style={{ minWidth: "10rem" }}
                />
                <Column
                    field={ i => i.attachments_count > 1  ? translations.auth.yes_not.yes  : translations.auth.yes_not.no }
                    header={ translations.filing.email_filing.table.attachments }
                    style={{ minWidth: "10rem" }}
                />
                <Column
                    field={ i => i.filing_id  ? translations.auth.yes_not.yes  : translations.auth.yes_not.no }
                    header={ translations.filing.email_filing.table.email_radicate }
                    style={{ minWidth: "10rem" }}
                />
                <Column
                    header={ translations.filing.email_filing.table.actions }
                    style={{ minWidth: "10rem" }}
                    body={i =>  !i.filing_id ? <>
                        <Button icon="pi pi-file" onClick={() => {setRadicateModal(true); setSelectedEmails(i)}} text
                        tooltip={ translations.filing.email_filing.table.attach_radicate } />
                    </> : null}
                />
            </DataTable>

            <Dialog visible={emailModal} style={{ width: '50vw' }} 
                onHide={() => {if (!emailModal) return; setEmailModal(false); setSelectedEmails(null) }}>
                {
                    selectedEmails &&
                    <EmailDetail emailData={selectedEmails} />
                }
            </Dialog>
            <Dialog visible={radicateModal} style={{ width: '100%' }} 
                onHide={() => {if (!radicateModal) return; setRadicateModal(false); }}>
                <Create emitIdCreated={(id) => { setFilingId(id) }} noChangeView  />
            </Dialog>
        </div>
    );
}
