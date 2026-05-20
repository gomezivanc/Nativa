
import { usePage } from "@inertiajs/react"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { useState, useRef,useEffect } from "react"
import { useForm } from "react-hook-form"
import { classNames } from "primereact/utils"
import { Steps } from "primereact/steps"
import { Card } from "primereact/card"
import { toast } from 'react-toastify';
import { QRCodeSVG } from "qrcode.react";
import { Fieldset } from "primereact/fieldset"


export function SingFiling({ items, onFinish }) {
  const { translations,auth,ziggy } = usePage().props
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm()
  const [qrDataList, setQrDataList] = useState([]);  
  const [activeIndex, setActiveIndex] = useState(0)
  const selectedFirma = watch("selectedFirma")
  const opcionesFirma = [
    { id: "qr", label: translations.filing.standard_filing.signature_types.qr_signature, icon: "pi pi-qrcode" },
    { id: "mecanica", label: translations.filing.standard_filing.signature_types.mechanical_signature, icon: "pi pi-image" },
    { id: "fisica", label: translations.filing.standard_filing.signature_types.physical_signature, icon: "pi pi-pencil" },
  ]
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const qrDataArray = items.map((item) => ({
      userId: auth.user.id,
      idRadicate: item.id,
      number_filing: item.filing_number,
      date: new Date().toISOString(),
    }));
  
    setQrDataList(qrDataArray); // Guardamos los datos generados    
  }, [items]); 

  async function submit(data) {
    data.signatures = qrDataList;    
    data.signaturePhysical = auth.signatures.physical_signature;    
    data.signatureMechanical = auth.signatures.signature;    

    setLoading(true)
    try {
      const res = await axios.post(route("filing.sing-filing"), data);
      
      if (res.data.success) {
        // Mostrar los documentos firmados con un toast de éxito
        if (res.data.signedDocuments.length > 0) {
          
          toast.success(
            <div>
              <p className="font-bold">
                {translations.filing.standard_filing.signed_documents}
              </p>
              <ul className="list-disc list-inside ">
                {res.data.signedDocuments.map((filing, index) => (
                  <li key={index}> {filing}</li>
                ))}
              </ul>
            </div>
          );
        }
    
        // Mostrar los documentos que ya estaban firmados con un toast de advertencia
        if (res.data.alreadySigned.length > 0) {
          toast.warning(
            <div>
              <p className="font-bold ">
                {translations.filing.standard_filing.already_signed_documents}
              </p>
              <ul className="list-disc list-inside ">
                {res.data.alreadySigned.map((filing, index) => (
                  <li key={index}>{filing}</li>
                ))}
              </ul>
            </div>
          );
        }
    
        onFinish();        
      } 
      if(res.data == "password") {   
        
        toast.error(translations.filing.standard_filing.incorrect_password || translations.auth.error);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(translations.auth.error);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  }   

  function generateQR(item) {    
      const qrData = JSON.stringify({
        userId: auth.user.id,
        idRadicate: item.id,
        number_filing: item.filing_number,
        date: new Date().toLocaleString()
      });  
      return <QRCodeSVG key={item.id} value={qrData} />;
    }  
  const steps = [{ label: translations.filing.standard_filing.signature_type }, { label: translations.filing.standard_filing.options_speed_dial.sign }, { label: translations.filing.standard_filing.confirm_signature }]

  const nextStep = () => setActiveIndex((prev) => prev + 1)
  const prevStep = () => setActiveIndex((prev) => prev - 1)

  const renderStepContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <div className="flex flex-column justify-center">
            <div className="flex justify-center my-4 gap-4">
              {opcionesFirma.map((firma) => (
                <div
                  key={firma.id}
                  className={classNames(
                    "flex flex-col align-center cursor-pointer justify-center text-nowrap mx-6 shadow-md rounded-md border",
                    "w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48",
                    {
                      "border-blue-800 bg-primary-100": selectedFirma === firma.id,
                      "border-gray-300 hover:border-primary": selectedFirma !== firma.id,
                    },
                  )}
                  onClick={() => setValue("selectedFirma", firma.id)}
                >
                  <i
                    className={`${firma.icon} text-center mb-2`}
                    style={{
                      color: selectedFirma === firma.id ? "var(--primary-color)" : "var(--text-color-secondary)",
                      fontSize: "3rem",
                    }}
                  ></i>
                  <span className="text-center whitespace-normal break-words">{firma.label}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 1:
        return (
          <div className="flex flex-col justify-center">
            <p className="text-center">{translations.filing.standard_filing.signature_types.preview_signature} </p>
            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-center align-items-center font-medium p-5" style={{ minHeight: "12rem" }}>
            {selectedFirma === "qr" && (
                <div className="text-center">
                  <i className="pi pi-qrcode text-6xl mb-3"></i>                  
                  <div className="grid grid-cols-3 gap-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex flex-col items-center">
                        <p>{translations.filing.standard_filing.table.number_filing} {item.filing_number}</p>
                        {generateQR(item)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedFirma === "mecanica" && (
                <div className="text-center">
                  <i className="pi pi-image text-6xl mb-3"></i>
                  <img
                        // src={`${ziggy.url}/getfile?path=${auth.signatures.signature}`}
                        src={ziggy?.url && auth?.signatures?.signature ? `${ziggy.url}/getfile?path=${auth.signatures.signature}` : ""}
                        alt="User Signature physical"
                        className="w-full h-auto max-w-md rounded-lg " // Ajusta las clases según el diseño
                    />
                    
                </div>
              )}
              {selectedFirma === "fisica" && (
                <div className="text-center">
                  <i className="pi pi-pencil text-6xl mb-3"></i>                 
                  <img
                        src={ziggy?.url && auth?.signatures?.physical_signature ? `${ziggy.url}/getfile?path=${auth.signatures.physical_signature}` : ""}
                        alt="User Signature physical"
                        className="w-full h-auto max-w-md rounded-lg " // Ajusta las clases según el diseño
                    />
                </div>
              )}
            </div>
          </div>
        )
      case 2:
        return (
          <form className="grid md:grid-cols-1 gap-4 p-5" onSubmit={handleSubmit(submit)}>
            <div className="p-field">
              <Fieldset legend={translations.filing.standard_filing.docs_sing }  className="my-3">
                <div className="text-center">              
                  <ul className="list-none p-0 m-0 grid grid-cols-3 gap-4">
                    {items.map((item, index) => (
                      <li key={index} className="flex flex-col items-center">
                        <i className="pi pi-file text-6xl mb-3"></i>
                        <p className="text-center text-sm">{item.filing_number || `Item ${index + 1}`}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Fieldset>
              <label htmlFor="password">{translations.auth.users.form.password} *</label>
              <InputText
                id="password"
                type="password"
                placeholder={translations.auth.users.form.password}
                className={classNames("p-inputtext p-component w-full mt-3", { "p-invalid": errors.password })}
                {...register("password", {
                  required: translations?.validation?.attributes?.field_required || "Este campo es requerido",
                })}
              />
              {errors.password && <small className="p-error">{errors.password.message}</small>}
            </div>
          </form>
        )
      default:
        return null
    }
  }

  const footer = (
    <div className="flex justify-between">
      {activeIndex > 0 && <Button label={translations.auth.back } severity="secondary" icon="pi pi-arrow-left" onClick={prevStep} />}
      {activeIndex < steps.length - 1 ? (
        <Button label={translations.auth.next } icon="pi pi-arrow-right" iconPos="right" onClick={nextStep} disabled={activeIndex === 0 && !selectedFirma} />
      ) : (
        <Button type="submit" loading={loading} label={translations.documental_gestion.exp_files.save } className="col-span-2" size="small" onClick={handleSubmit(submit)} />
      )}
    </div>
  )

  return (
    <div className="card">
      <Steps model={steps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={true} />
      <Card className="mt-4" footer={footer}>{renderStepContent()}</Card>
      
    </div>
  )
}
