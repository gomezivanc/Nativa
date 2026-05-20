import { useState } from "react"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Editor } from "primereact/editor"
import { AutoComplete } from "primereact/autocomplete"
import { Chip } from "primereact/chip"
import { FileUpload } from "primereact/fileupload"
import { Divider } from "primereact/divider"
import { Toast } from "primereact/toast"
import { toast } from 'react-toastify'
import { useRef } from "react"
import Upload from "../../../components/Upload"
import axios from "axios"
import { usePage } from "@inertiajs/react"
import { useLoading } from "../../../Context/preloadContext"

export default function EmailComposer({ changeView }) {
    const { translations } = usePage()?.props

    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("")
    const toastRef = useRef(null)
    const fileUploadRef = useRef(null)
  
    const [value, setValue] = useState('');
    const [users, setUsers] = useState([]);
    const [files, setFiles] = useState([]);

    const search = async (event) => {
      const res = await axios.get(route('usuarios.list'),{ params: { typeData: 'todos', searchQuery: event.query} })
      setUsers(res.data)
    }
    const { setIsLoading } = useLoading();
    
    let is_confirm_subject = false
    const sendEmail = async () => {
      if (value.length === 0) {
        toast.error(translations.filing.email_filing.form.alert.to_error)
        return
      }
  
      if (!subject.trim() && !is_confirm_subject) {
        toastRef.current.show({
            severity: 'success',
            summary: null,
            sticky: true,
            content: (props) => (
                <div className="flex flex-col align-items-left" style={{ flex: '1' }}>
                    <label className="text-center">{translations.filing.email_filing.form.alert.cofirm_subject}</label>
                    <div className="mt-2 flex gap-2 justify-center">
                      <Button className="p-button-sm flex" label={translations.filing.email_filing.form.send}
                        severity="success" onClick={() => {
                        is_confirm_subject = true
                        sendEmail()
                      }}></Button>
                      <Button className="p-button-sm flex" 
                        label={translations.filing.email_filing.form.alert.demiss}
                        severity="danger" onClick={() => {
                        toast.current.clear()
                      }}></Button>
                    </div>
                </div>
            )
        });
        return
      }

      try {
        setIsLoading(true)
        let data = {
          subject: subject,
          body: content,
          users: value.map(i => i.id),
          filesA: files
        }

        const res = await axios.post(route('email.store'),data)
        toast.success(`${translations.filing.email_filing.form.alert.succes}  ${users.map((r) => r.email).join(", ")}`)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }

      // Reset form
      setSubject("")
      setContent("")
      setValue([])
      setFiles([])

      if (fileUploadRef.current) {
        fileUploadRef.current.clear()
      }
      toastRef.current.clear()
      is_confirm_subject = false
      changeView()
    }
  
    const handleKeyDown = (e, type) => {
      if (e.key === "Enter" && newRecipient) {
        e.preventDefault()
        addRecipient(type)
      }
    }
  
    return (
      <div className="card">
        <Toast ref={toastRef} position="bottom-center" />
        <div className="p-card p-4">
          <Divider />
  
          <div className="mb-3">
            <label htmlFor="to" className="block text-sm font-medium mb-1">
              { translations.filing.email_filing.form.to }:
            </label>
            <div className="flex flex-wrap align-items-center p-fluid">
              <AutoComplete multiple field="usuario" value={value} suggestions={users} completeMethod={search} 
              onChange={(e) => setValue(e.value)} dropdown className="w-full" />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              { translations.filing.email_filing.form.subject }:
            </label>
            <InputText
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full"
            />
          </div>
  
          <div className="mb-3">
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              { translations.filing.email_filing.form.message }:
            </label>
            <Editor
              id="content"
              value={content}
              onTextChange={(e) => setContent(e.htmlValue || "")}
              style={{ height: "320px" }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="attachments" className="block text-sm font-medium mb-1">
              { translations.filing.email_filing.form.attachments }:
            </label>
            <Upload onChangeDocs={e => setFiles(e)} allowedFiles='*' />
          </div>
          <Divider />
          <div className="flex justify-end">
            <Button icon="pi pi-send" label={translations.filing.email_filing.form.send} onClick={sendEmail} />
          </div>
        </div>
      </div>
    )
  }