import { Link, router, usePage } from '@inertiajs/react'
import { formatDate } from '../../../hooks/useDate'
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import Traza from './Traza';
import axios from "axios";
import React, { useState, useEffect , useRef } from "react";
import { SpeedDial } from "primereact/speeddial";
import { Dialog } from 'primereact/dialog'
import { SendMailOf } from './Dialogs/sendOfficial'
import { SendMail } from './Dialogs/SendMail'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ChargeDocuments } from './Dialogs/ChargeDocuments'
import PdfViewerDialog from './Dialogs/PdfViewerDialog';
import Onlyoffice from './Dialogs/Onlyoffice';
import { Tooltip } from 'primereact/tooltip';
import { AssociateTemplate } from './Dialogs/AssociateTemplate'
import { toast } from "react-toastify";
import { CancellationRequest } from './Dialogs/CancellationRequest'
import { ExtensionOfTime } from './Dialogs/ExtensionOfTime'
import { FinishFiling } from './Dialogs/FinishFiling'

export default function Show({ filing,query,typeDocs }) {
    const { translations,current_language } = usePage()?.props    
    const [activeTab, setActiveTab] = useState("detalle");
    const [sendMailOf, setSendMail] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const [associateTemplate, setAssociateTemplate] = useState(false);
    const [attachShow, setAttachShow] = useState(false)
    const [loading,setLoading] = useState(false)
    const editorRef = useRef(null)
    const [onlyOfficeShow, setOnlyOfficeShow] = useState(false);
    const [pdfShow, setpdfShow] = useState(false);
    const [visible, setVisible ] = useState(false);
    const [pdfViewer, setPdfViewer] = useState(null);
    const [config, setConfig] = useState(null);
    const editorInstance = useRef(null);
    const [cancellationRequest, setCancellationRequest] = useState(false);
    const [extensionOfTime, setExtensionOfTime] = useState(false);
    const [finishFiling, setFinishFiling] = useState(false);
    const [sendMail, setSendMailUser] = useState({
        open: false,
        id: null
      });

    function refreshDocuments() {
        setActiveTab("documentos");
        router.reload({ only: ['filing', 'query', 'typeDocs'] });
    }

    const [optionsTool, setOptionsTool] = useState([
        {
            label: translations.menu.options_speed_dial.add,
            icon: 'pi pi-plus',
            command: () => {
                setAttachShow(true)
            }  
        },
        {
            label: translations.filing.standard_filing.options_speed_dial.res_template,
            icon: 'pi pi-sort-alt',
            command: () => {
                setAssociateTemplate(true)
            }
        },
        {
            label: translations.filing.standard_filing.options_speed_dial.Cancel_filing,
            icon: 'pi pi-ban',
            command: () => {
                setCancellationRequest(true)
            }
        },
        {
            label: 'Solicitud Ampliacion de tiempo',
            icon: 'pi pi-calendar-plus',
            command: () => {
                setExtensionOfTime(true)
            }
        },
    ]);

  const firmarDocumento = async (responseId, filingId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        route('filing.sign_document', {response_id: responseId,filing_id: filingId})
      );

      toast.success(res.data.message || translations.auth.signed_document);

      refreshDocuments();

    } catch (error) {

      const mensaje =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        translations.auth.document_signing_error;

      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const verDocumentonline = async (id, filingId) => {
      try {
          setLoading(true);
          
          const res = await axios.get(route('verDocumentoLinea'), {
              params: {
                  response_id: `response_${id}`,
                  filing: filingId
              }
          });
          const { debug, ...configLimpia } = res.data;
          
          setConfig(configLimpia); 
          setVisible(true);
          
      } catch (error) {
          console.error("Error cargando OnlyOffice:", error);
          toast.error("No se pudo cargar la configuración del editor");
      } finally {
          setLoading(false);
      }
  };

  const SoloVisorDocumental = async (id, filingId) => {
      try {
          setLoading(true);
          
          const res = await axios.get(route('verDocumentoLineaSolo'), {
              params: {
                  response_id: `response_${id}`,
                  filing: filingId
              }
          });
          const { debug, ...configLimpia } = res.data;
          
          setConfig(configLimpia); 
          setVisible(true);
          
      } catch (error) {
          console.error("Error cargando OnlyOffice:", error);
          toast.error("No se pudo cargar la configuración del editor");
      } finally {
          setLoading(false);
      }
  };

  const convertiraPDF = async (id, filingId) => {
      try {
          setLoading(true);
          const res = await axios.get(route('convertirPdf'), {
              params: {
                  response_id: `response_${id}`,
                  filing: filingId
              }
          });

          if (res.data.success) {
              toast.success("Documento convertido a PDF");
              refreshDocuments();
          }
      } catch (error) {
          console.error("Error convirtiendo a PDF:", error);
          toast.error("Error al convertir el documento");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      if (visible && config && window.DocsAPI) {
          const timer = setTimeout(() => {
              // Limpiar instancia vieja si existe
              if (editorRef.current) {
                  editorRef.current.destroyEditor();
              }
              // Crear el editor en el div con id 'onlyoffice-editor'
              editorRef.current = new window.DocsAPI.DocEditor("onlyoffice-editor", config);
          }, 100);

          return () => clearTimeout(timer);
      }
  }, [visible, config]);


  const correspondence = async (responseId, filingId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        route('distributionshipping.new-state-correspondece', {response_id: responseId,filing_id: filingId})
      );

      toast.success(res.data.message || translations.auth.signed_document);

      refreshDocuments();

    } catch (error) {

      const mensaje =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        translations.auth.document_signing_error;

      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const parseFileDetail = (detail) => {
    try {
        return detail ? JSON.parse(detail) : {};
    } catch {
        return {};
    }
  };

  const buildRow = (data) => ({
      id: data.unique_id,
      type: data.type,
      consecutivo: filing.filing_number,
      radicado: filing.filing_number,
      radicadoS: data.radicado,
      asunto: filing.subject,
      clase_documento: data.clase_documento || "N/A",
      nombre_archivo: data.nombre_archivo || "N/A",
      tipo_archivo: data.tipo_archivo || "N/A",
      fecha: data.fecha,
      tipoDocumental: data.tipoDocumental || "N/A",
      funcionario: filing.official?.persona
          ? `${filing.official.persona.nombre} ${filing.official.persona.apellido}`
          : "N/A",
      estado: filing.priority?.['name_' + current_language] || "N/A",
      url: data.url,
      state: data.state,
      acuse_url: data.acuse_url || null,
      page_start: data.page_start || null,
      page_end: data.page_end || null,
      elabora: data.elabora || null,
      revisa : data.revisa || null,
      aprueba : data.aprueba || null,
      firmantes : data.firmantes || null, 
      estadoPlantilla : data.estadoPlantilla || null
  });

  const accusationIds = filing?.response_templates
    ?.map(r => r.id_charge_doc_accusation)
    ?.filter(id => id);

  const chargeDocs = filing?.charge_doc_filings
    ?.filter(doc => !accusationIds.includes(doc.id))
    ?.map(doc => {

      const parsed = parseFileDetail(doc.file_detail);

      return buildRow({
        unique_id: `charge_${doc.id}`,
        type: "charge",
        clase_documento: doc.description ? doc.description : 'Documento Principal',
        nombre_archivo: parsed.name || doc.file?.split('/').pop(),
        tipo_archivo: parsed.type,
        fecha: doc.created_at,
        tipoDocumental: doc.type_documental?.['name_'+current_language] ?? (doc.document_type ? doc.document_type : 'Radicado'),
        url: doc.file,
        state: 0,
        radicado: '',
      });
  }) || [];


  const responseDocs = filing?.response_templates
      ?.filter(t => t.template_url)
      ?.map(doc => {
          const radicadoSalida = filing?.filed_departure?.find(
            r => r.id_response_template === doc.id
          );
          const fileName = doc.template_url.split('/').pop();
          const acuseDoc = filing?.charge_doc_filings?.find(c => c.id === doc.id_charge_doc_accusation);

          return buildRow({
              unique_id: `response_${doc.id}`,
              type: "response",
              clase_documento: "Respuesta",
              nombre_archivo: fileName,
              tipo_archivo: fileName.split('.').pop(),
              fecha: doc.created_at,
              tipoDocumental: "Respuesta",
              url: doc.template_url,
              state: doc.state,
              radicado: radicadoSalida?.departure_filing || '',
              acuse_url: acuseDoc?.file || null,
              elabora : doc.elabora,
              revisa : doc.revisa,
              aprueba : doc.aprueba,
              firmantes : doc.signatories,
              estadoPlantilla : {
                'revisa' : doc.estado_revisa,
                'aprueba' : doc.estado_aprueba,
              } 
          });
      }) || [];

    const unifiedData = [
        ...chargeDocs,
        ...responseDocs
    ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    async function eliminarDocumento(id , filing) {  
      try {
          setLoading(true);
          const res = await axios.post(route('charge.destroydata'), {
              filing: filing.id,
              id_ducument: id
          });

            toast.success(translations.auth.success);
            refreshDocuments();
        } catch (error) {
            if(error.response.status == 422) {
                toast.error(translations.auth.error);
            } else {
                toast.error(translations.auth.error);
            }
        } finally {
            setLoading(false); 
        }
    }

    function resetValues() {
        setSelectedItem([]);
    }
    
    const getFilingStatus = (filing) => {
        const hoy = new Date();
        const fechaExpiracion = new Date(filing.expiration_date);

        const tiempoRestante = fechaExpiracion - hoy;
        const diasRestantes = Math.ceil(tiempoRestante / (1000 * 60 * 60 * 24));

        let prioridad = "";

        if (diasRestantes < 0) {
            prioridad = "Vencido";
        } else if (diasRestantes <= 2) {
            prioridad = "Crítica";
        } else if (diasRestantes <= 4) {
            prioridad = "Alta";
        } else if (diasRestantes <= 7) {
            prioridad = "Media";
        } else {
            prioridad = "Baja";
        }

        return { diasRestantes, prioridad };
    };
    const { diasRestantes, prioridad } = getFilingStatus(filing);

    return (
      <>
        <ConfirmDialog />
        <Card pt={{ content: { className: "p-0" } }}>

          <div className="flex justify-between items-end border-b border-gray-200 px-3 pt-1">
            
            <Link href={route("filingOfficial.index")}>
              <Button label={translations.auth.back} size="small" />
            </Link>

            <h3 className='font-bold'>{ translations.filing.standard_filing.form.filing_number }:
              <div className="flex items-center gap-2">
                <span>{filing.filing_number}</span>

                {query.copy == 1 && (
                  <span className="text-sm text-blue-500 font-semibold">
                    Copia
                  </span>
                )}
              </div>
            </h3>

            <ul className="flex -mb-px text-sm font-medium">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("datos")}
                  className={`inline-flex p-4 border-b-2 rounded-t-lg ${
                    activeTab === "datos"
                      ? "text-blue-600 border-blue-600"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {translations.filing.filing_official.menus.Details_the_procedure}
                </button>
              </li>

              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("detalle")}
                  className={`inline-flex p-4 border-b-2 rounded-t-lg ${
                    activeTab === "detalle"
                      ? "text-blue-600 border-blue-600"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300"
                  }`}
                > 
                  {translations.filing.filing_official.menus.Detail}
                </button>
              </li>

              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("seguimiento")}
                  className={`inline-flex p-4 border-b-2 rounded-t-lg ${
                    activeTab === "seguimiento"
                      ? "text-blue-600 border-blue-600"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {translations.filing.filing_official.menus.Follow_up}
                </button>
              </li>

              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("documentos")}
                  className={`inline-flex p-4 border-b-2 rounded-t-lg ${
                    activeTab === "documentos"
                      ? "text-blue-600 border-blue-600"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {translations.filing.filing_official.menus.Documents_response}
                </button>
              </li>

              <li className="mr-2 border-r border-gray-300 pr-2"></li>
              {query.copy == 0 && (
                <>
                  <li className="mr-2">
                    <button
                      onClick={() => {
                        setSendMail(true);
                      }}
                      className={`inline-flex p-4 border-b-2 rounded-t-lg ${
                        activeTab === "pasarA"
                          ? "text-blue-600 border-blue-600"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {translations.filing.filing_official.menus.Distribute}
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      onClick={() => {
                        setFinishFiling(true);
                      }}
                      className={`inline-flex p-4 border-b-2 rounded-t-lg ${
                        activeTab === "pasarA"
                          ? "text-blue-600 border-blue-600"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {translations.filing.filing_official.menus.Finish}
                    </button>
                  </li>
                </>
              )}

            </ul>            
          </div>         
          
          {activeTab === "datos" && (
              <div>
                <Fieldset legend={ 'Datos Del Tramite' } >

                  <div className="grid gap-2 md:grid-cols-3 items-start mt-4">
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.processing_data }:</h3>
                          <p>{ filing?.type_of_procedure?.name }</p>
                      </span>
                      <span>
                          <h3 className='font-bold'>{translations.filing.standard_filing.form.remaining_days}</h3>
                          <p>{diasRestantes}</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.expiration_date}:</h3>
                          <p>{ filing?.expiration_date  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{translations.filing.standard_filing.form.number_pages  }:</h3>
                          <p>{ filing?.number_pages  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{translations.filing.standard_filing.form.reception_medium }:</h3>
                          <p>{ filing?.reception_media['name_'+current_language]  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.priority }:</h3>
                          <p>{prioridad}</p> 
                      </span>
                  </div> 
                </Fieldset>
              </div>
          )}

          <div className="p-4">
            {activeTab === "detalle" && (
              <div>
                <Fieldset legend={translations.filing.standard_filing.table.number_filing } >
                  <h2 className="font-bold m-0">
                      {filing.filing_number }
                  </h2>
                  <div className="grid gap-2 md:grid-cols-3 items-start mt-4">
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.type_person }:</h3>
                          <p>{ filing.people_type['name_'+current_language] }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.name_social_reason_sender }:</h3>
                          <p>{ filing.name_social_reason_sender +" "+filing.first_surname_legal_representative_sender }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.document_nit_sender }:</h3>
                          <p>{ filing?.document_nit_sender  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.address_sender }:</h3>
                          <p>{ filing?.address_sender  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.city_id }:</h3>
                          <p>{ filing?.city.nombre  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.department_id }:</h3>
                          <p>{ filing?.department.nombre  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.country_id }:</h3>
                          <p>{ filing?.country?.name  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.email_sender }:</h3>
                          <p>{ filing?.email_sender  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.phone_sender }:</h3>
                          <p>{ filing?.phone_sender  }</p>
                      </span>
                      <hr className='flex-col md:col-span-3 my-2'/>       

                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.table.documental_type }:</h3>
                          <p>{ filing.documental_type?.['name_'+current_language] ?? '' }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.table.types_filing }:</h3>
                          <p>{ filing?.types_filings?.name  }</p>
                      </span>  
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.table.priority }:</h3>
                          <p>{ filing.priority?.['name_'+current_language] ?? ''  }</p>
                      </span>   
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.reception_medium }:</h3>
                          <p>{ filing.reception_media?.['name_'+current_language] ?? '' }</p>
                      </span>              
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.expiration_date }:</h3>
                          <p>{ formatDate(filing.expiration_date)  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.dependency }:</h3>
                          <p>{filing?.dependency?.name}</p>
                      </span>
                      <span >
                          <h3 className="font-bold">{translations.filing.standard_filing.form.serie}:</h3>
                          <p>{ (filing.serie?.code || "No ") + " " + (filing.serie?.name || "serie") }</p>
                      </span>
                      <span >
                          <h3 className="font-bold">{translations.filing.standard_filing.form.sub_serie}:</h3>
                          <p>{ (filing.sub_serie?.code || "No") + " " + (filing.sub_serie?.name || "sub serie") }</p>
                      </span> 
                      <span >
                          <h3 className="font-bold">{translations.filing.standard_filing.form.user}:</h3>
                          <p>{ filing.official?.persona.nombre || "N/A " + " "+filing.official?.persona.apellido || "N/A "}</p>
                      </span> 
                      <span >
                          <h3 className="font-bold">{translations.filing.standard_filing.form.filling_origin}:</h3>
                          <p>{ (filing?.filling_origin || "N/A ")}</p>
                      </span> 
                      <span >
                          <h3 className="font-bold">{translations.filing.standard_filing.form.annex_description}:</h3>
                          <p>{ filing?.annex_description }</p>
                      </span>  
                      <span >
                          <h3 className="font-bold">{translations.filing.standard_filing.form.observation}:</h3>
                          <p>{ filing.observation }</p>
                      </span> 
                      <span >
                          <h3 className="font-bold">{translations.filing.standard_filing.form.subject}:</h3>
                          <p>{ filing.subject }</p>
                      </span>
                  </div> 
                </Fieldset>
              </div>
            )}

            {activeTab === "seguimiento" && (
              <div>
                {/* Panel de trazabilidad a la derecha */}
                <div className="w-full md:row-span-2">
                  <Fieldset legend={translations.filing.standard_filing.traceability} className='h-full'>
                    <Traza
                      logs={filing.filing_logs}
                      dependency={filing.dependency}
                      official={filing.official}
                    />
                  </Fieldset>
                </div>
                
              </div>
            )}

            {activeTab === "documentos" && (

              <div>
              <DataTable value={unifiedData} size="small" emptyMessage="Sin datos" responsiveLayout="scroll" selection={selectedItem}>

                <Column
                  header="Consecutivo"
                  body={(row, { rowIndex }) => {
                    if (row.tipoDocumental === 'Radicado' || row.tipoDocumental === 'Documento Principal') {
                      return '---------'
                    }
                    
                    return `CRT-${rowIndex + 1}`
                  }}
                />

                <Column
                  header="Radicado"
                  body={(row, { rowIndex }) => {
                    
                    if (row.tipoDocumental === 'Radicado' || row.tipoDocumental === 'Documento Principal') {
                      return row.radicado
                    }

                    return row.radicadoS || '---------';
                  }}
                />

                <Column header="Asunto" field="clase_documento" />

                <Column header="Tipo documeto" field="tipoDocumental" />

                <Column
                  header="Tipo archivo"
                  body={(row) => {
                      const ext = row.tipo_archivo?.toLowerCase()

                      let icon = "pi pi-file"
                      let color = "#6b7280"

                      if (ext?.includes("pdf")) {
                          icon = "pi pi-file-pdf"
                          color = "#ef4444"
                      } 
                      else if (ext?.includes("word") || ext?.includes("doc")) {
                          icon = "pi pi-file-word"
                          color = "#2563eb"
                      } 
                      else if (ext?.includes("excel") || ext?.includes("xls")) {
                          icon = "pi pi-file-excel"
                          color = "#16a34a"
                      } 
                      else if (ext?.includes("image") || ext?.includes("jpg") || ext?.includes("png")) {
                          icon = "pi pi-image"
                          color = "#f59e0b"
                      }

                      return (
                          <div className="flex items-center gap-2">
                              <i className={icon} style={{ color, fontSize: "1.2rem" }} />
                              <span>{row.tipo_archivo}</span>
                          </div>
                      )
                  }}
                />
                <Column header="Fecha" 
                  body={(row) => 
                    new Date(row.fecha).toLocaleString('es-CO', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  } 
                />

                <Column header="Funcionario" field="funcionario" />

                <Column header="Estado" />
                <Column
                    header="Acciones"
                    body={(row) => {
                      const downloadUrl = route('file') + '?path=' + encodeURIComponent(row.url)

                      return (
                        <div className="flex gap-2">

                          <Button
                            icon="pi pi-download"
                            className="p-button-sm"
                            tooltip="Descargar"
                            onClick={() => window.open(downloadUrl, '_blank')}
                          />
                          <Button
                            icon="pi pi-eye"
                            size="small"
                            className="p-button-sm p-button-text"
                            onClick={() => {
                              setPdfViewer({
                                file: row.url,
                                segment: false,
                                title: row.nombre_archivo,
                                radicado: row.radicado,
                                asunto: row.asunto,
                                funcionario: row.funcionario,
                                estado: row.estado,
                                fecha: row.fecha,
                                clase_documento: row.clase_documento,
                                tipo_archivo: row.tipo_archivo
                              });

                              setpdfShow(true);
                            }}
                          />

                          {row.tipoDocumental !== 'Radicado' && row.state == 0 &&(
                            <Button
                              icon="pi pi-trash"
                              className="p-button-sm p-button-danger"
                              onClick={() =>
                                confirmDialog({
                                  message: '¿Está seguro de eliminar este documento?',
                                  header: 'Confirmación',
                                  icon: 'pi pi-exclamation-triangle',
                                  accept: () => eliminarDocumento(row.id ,filing)
                                })
                              }
                            />
                          )}

                        {/* //para onlyoffice */}

                        {row.state != 0 && (
                          <>
                            { (row.state == 1 || row.state == 3) && (
                              <>
                                <Button
                                  icon="pi pi-user-edit"
                                  className="p-button-sm p-button-help"
                                  tooltip="Firmar"
                                  onClick={() => firmarDocumento(row.id, filing.id)}
                                />

                                <Button
                                  icon="pi pi-arrow-circle-up"
                                  className="p-button-sm p-button-help"
                                  tooltip="Ver documento en Word"
                                  onClick={() => {
                                    setPdfViewer({
                                      file: row.url,
                                      segment: false,
                                      title: row.nombre_archivo,
                                      radicado: row.radicado,
                                      asunto: row.asunto,
                                      funcionario: row.funcionario,
                                      estado: row.estado,
                                      fecha: row.fecha,
                                      clase_documento: row.clase_documento,
                                      tipo_archivo: row.tipo_archivo,
                                      aprueba: row.aprueba,
                                      elabora: row.elabora,
                                      revisa: row.revisa,
                                      firmantes: row.firmantes,
                                      id: row.id,
                                      estadoPlantilla: row.estadoPlantilla
                                    });
                                      verDocumentonline(row.id, filing.id);
                                      setOnlyOfficeShow(true);
                                  }}
                                />

                                {/* <Button
                                  icon="pi pi-at"
                                  tooltip="Convertir a pdf"

                                  onClick={() => {
                                    convertiraPDF(row?.id, filing?.id);
                                  }}
                                />

                                <Button
                                  icon="pi pi-at"
                                  tooltip="Ver Documento"

                                  onClick={() => {
                                    SoloVisorDocumental(row?.id, filing?.id);
                                  }}
                                /> */}
                              </>
                            )}  
                            {row.state == 4 && ( <>
                              <Button
                                icon="pi pi-at"
                                className="p-button-sm p-button-secondary"
                                tooltip="Enviar Respuesta"
                                onClick={() => {
                                  setSendMailUser({ open: true, id: row.id });
                                }}
                              />

                              <Button
                                icon="pi pi-arrow-up-right"
                                className="p-button-sm p-button-danger"
                                tooltip="Correspondencia"
                                onClick={() => correspondence(row.id, filing.id)}
                              />
                              
                              </>
                            )} 
                            {row.state == 5 && (
                              <Button
                                icon="pi pi-folder-open"
                                tooltip="Acuse"
                                className="p-button-sm p-button-help"
                                // onClick={() => {
                                //   setSendMair({ open: true, id: row.id });
                                // }}
                              />
                            )} 
                            {row.state == 7 && (
                              <Button
                                icon="pi pi-check-circle"
                                className="p-button-sm p-button-success"
                                tooltip="Ver acuse recibido"
                                onClick={() => {
                                  // const acuseUrl = route('file') + '?path=' + encodeURIComponent(row.acuse_url);
                                    window.open(route('acuse.show', row.id), '_blank');
                                  // window.open(acuseUrl + '&preview=1', '_blank');
                                }}
                                
                              />
                            )}        
                          </>
                        )}
                        </div>
                      )
                    }}
                />
              </DataTable>
              </div>
            )}
          </div>
        </Card>
          
          {query.copy == 0 && (
            <>
              <Dialog modal={true} position='center' visible={sendMailOf} header={translations.filing.standard_filing.options_speed_dial.mail_reply } style={{ width: '70vw' }} onHide={() => {if (!sendMailOf) return; setSendMail(false); }}>
                    <SendMailOf dataFiling={filing} tableDocument={filing.charge_doc_filings} onFinish={() => setSendMail(false)}/>
              </Dialog>

              <Dialog modal={true} position='center' visible={cancellationRequest} header={translations.filing.standard_filing.options_speed_dial.cancellation_request } style={{ width: '70vw' }} onHide={() => {if (!cancellationRequest) return; setCancellationRequest(false); }}>
                    <CancellationRequest dataFiling={filing} onFinish={() => {setCancellationRequest(false);resetValues();}} />
              </Dialog>

              <Dialog modal={true} position='center' visible={extensionOfTime} header={'Solicitud Ampliacion de tiempo' } style={{ width: '70vw' }} onHide={() => setExtensionOfTime(false)}>
                    <ExtensionOfTime dataFiling={filing} onFinish={() => {setExtensionOfTime(false);resetValues();}} />
              </Dialog>

              <Dialog modal={true} position='center' visible={finishFiling} header={translations.filing.standard_filing.finish_filing} style={{ width: '70vw' }} onHide={() => {if (!finishFiling) return; setFinishFiling(false); }}>
                    <FinishFiling dataFiling={filing} onFinish={() => {setFinishFiling(false);resetValues();}} />
              </Dialog>

              <Dialog modal={true} position="center" visible={sendMail.open} header={translations.filing.standard_filing.options_speed_dial.mail_reply} style={{ width: '70vw' }} onHide={() => setSendMailUser({ open: false, id: null })}>
                <SendMail dataFiling={filing} tableDocument={filing.charge_doc_filings} responseDocument={filing.response_templates} idResponse={sendMail.id} onFinish={() => setSendMailUser({ open: false, id: null })}/>
              </Dialog>

              <Dialog modal={true} position='center' visible={associateTemplate} header={translations.filing.standard_filing.options_speed_dial.associate_template } style={{ width: '70vw' }} onHide={() => {if (!associateTemplate) return; setAssociateTemplate(false); }}>
                    <AssociateTemplate
                        defaultVals={{ filing_id: filing }}
                        onFinish={() => {
                            setAssociateTemplate(false);
                            resetValues();
                            refreshDocuments();
                        }}
                    />
              </Dialog>
              <Dialog modal position="center" visible={attachShow} header={translations.filing.standard_filing.options_speed_dial.charge_docs} style={{ width: '70vw' }} onHide={() => setAttachShow(false)}>
                  <ChargeDocuments items={[{ id: filing.id}]}
                      typeDocs={typeDocs}
                      onFinish={() => {
                          setAttachShow(false);
                          resetValues();
                          refreshDocuments();
                      }}
                  />
              </Dialog>

              {/* //para onlyoffice */}
              {/* <Dialog
                  header="Editor de Documento"
                  visible={visible}
                  style={{ width: "80vw", height: "80vh" }}
                  onHide={() => setVisible(false)}
              >
                  <div id="onlyoffice-editor" style={{ height: '600px', width: '100%' }}></div>
              </Dialog> */}

              <Onlyoffice visible={onlyOfficeShow} setVisible={setOnlyOfficeShow} pdfViewer={pdfViewer}  />
              
              <PdfViewerDialog visible={pdfShow} setVisible={setpdfShow} pdfViewer={pdfViewer} setPdfViewer={setPdfViewer}/>

              {activeTab === "documentos" && (
                <>
                  <Tooltip target=".speeddial-bottom-right .p-speeddial-action" position="left" />
          
                  <SpeedDial
                    model={optionsTool}
                    direction="up"
                    className="speeddial-bottom-right right-4 bottom-4"
                    buttonClassName="btn-open"
                  />
                </>
              )}
          </>
          )}
      </>
    );
}