import { Link, router, usePage } from '@inertiajs/react'
import { formatDate } from '../../../hooks/useDate'
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import axios from "axios";
import React, { useState, useEffect , useRef } from "react";
import { SpeedDial } from "primereact/speeddial";
import { Dialog } from 'primereact/dialog'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tooltip } from 'primereact/tooltip';
import { toast } from "react-toastify";
import { SendMail } from './Dialogs/SendMail';
import { SendCertifiedMail } from './Dialogs/SendCertifiedMail';


export default function Showdistribution({ filing,third,query,typeDocs,template_url,state,created_at,id , servicesToAdd , answers}) {
    const { translations,current_language } = usePage()?.props    
    const [activeTab, setActiveTab] = useState("detalle");
    const [selectedItem, setSelectedItem] = useState([]);
    const [sendMail, setSendMail] = useState(false);

    const [sendCertifiedMail, setCertifiedMail] = useState({
      open: false,
      id: id
    });
    

    // Restaurar pestaña activa después del reload
    useEffect(() => {
        const savedTab = localStorage.getItem('activeTab_filing');
        if (savedTab) {
            setActiveTab(savedTab);
            localStorage.removeItem('activeTab_filing');
        }
    }, []);
    const [optionsTool, setOptionsTool] = useState([
        {
            label: 'Realizar envió físico',
            icon: 'pi pi-plus',
            command: () => {
                setSendMail(true)
            }  
        },
        {
            label: 'Realizar envió por correo electrónico',
            icon: 'pi pi-sort-alt',
            command: () => {
                setCertifiedMail({ open: true, id: id });
            }
        },
        
    ]);

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
        state: data.state
    });

    const chargeDocs = filing?.charge_doc_filings
      ?.filter(doc => doc.document_type !== 'Acuse')
      ?.map(doc => {
        const parsed = parseFileDetail(doc.file_detail);
        return buildRow({
            unique_id: `charge_${doc.id}`,
            type: "charge",
            clase_documento: doc.description || "Documento Principal",
            nombre_archivo: parsed.name || doc.file?.split('/').pop(),
            tipo_archivo: parsed.type,
            fecha: doc.created_at,
            tipoDocumental: doc.document_type || "Radicado",
            url: doc.file,
            state: 0,
            radicado: ''
        });
    }) || [];

    const responseDocs = template_url
      ? [
          buildRow({
            unique_id: `response_${id}`,
            type: "response",
            clase_documento: "Respuesta",
            nombre_archivo: template_url.split('/').pop(),
            tipo_archivo: template_url.split('.').pop(),
            fecha: created_at,
            tipoDocumental: "Respuesta",
            url: template_url,
            state: state,
            radicado: answers?.departure_filing
          })
        ]
      : [];

    const unifiedData = [
        ...chargeDocs,
        ...responseDocs
    ];

    return (
      <>
        <ConfirmDialog />
        <Card pt={{ content: { className: "p-0" } }}>

          <div className="flex justify-between items-end border-b border-gray-200 px-3 pt-1">
            
            <Link href={route("distributionshipping.index")}>
              <Button label={translations.auth.back} size="small" />
            </Link>

            <ul className="flex -mb-px text-sm font-medium">

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
                  
            </ul>                
          </div>         
          

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
                          <p>{ third?.type_person_id_sender  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.name_social_reason_sender }:</h3>
                          <p>{ third?.name_social_reason_sender  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.document_nit_sender }:</h3>
                          <p>{ third?.document_nit_sender  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.address_sender }:</h3>
                          <p>{ third?.address_sender  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.city_id }:</h3>
                          <p>{ third?.city.nombre  }</p>

                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.department_id }:</h3>
                          <p>{ third?.department.nombre  }</p>
                        
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.country_id }:</h3>
                          <p>{ third?.country.name  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.email_sender }:</h3>
                          <p>{ third?.email_sender  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.phone_sender }:</h3>
                          <p>{ third?.phone_sender  }</p>
                      </span>
                      <hr className='flex-col md:col-span-3 my-2'/>       

                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.table.documental_type }:</h3>
                          <p>{ filing?.documental_type?.['name_'+current_language] || 'N/A'  }</p>
                      </span>
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.table.types_filing }:</h3>
                          <p>{ filing?.types_filings?.description  }</p>
                      </span>    
                      <span >
                          <h3 className='font-bold'>{ translations.filing.standard_filing.form.reception_medium }:</h3>
                          <p>{ filing?.reception_media?.['name_'+current_language] || 'N/A'  }</p>
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


            {activeTab === "documentos" && (

              <div>
              <DataTable
                  value={unifiedData}
                  size="small"
                  emptyMessage="Sin datos"
                  responsiveLayout="scroll"
                  selection={selectedItem}
              >

                <Column
                  header="Consecutivo"
                  body={(row, { rowIndex }) => {
                    if (row.tipoDocumental === 'Radicado') {
                      return ''
                    }
                    
                    return `CRT-${rowIndex + 1}`
                  }}
                />

                <Column
                  header="Radicado"
                  body={(row, { rowIndex }) => {
                    
                    if (row.tipoDocumental === 'Radicado') {
                      return row.radicado
                    }

                    return row.radicadoS
                  }}
                />

                <Column header="Clase documento" field="clase_documento" />

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

                <Column  
                  header="Fecha" 
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
                            className="p-button-sm p-button-text"
                            tooltip="Ver documento"
                            onClick={() => window.open(downloadUrl + '&preview=1', '_blank')}
                          />
                        </div>
                      )
                    }}
                />

              </DataTable>
              </div>
            )}
          </div>

        </Card>
        <Dialog modal={true} position='center' visible={sendMail} header={translations.correspondence_management.distribution_shipping.options_speed_dial.send_filing } style={{ width: '70vw' }} onHide={() => {if (!sendMail) return; setSendMail(false); }}>
            <SendMail dataFiling={id} servicesToAdd={servicesToAdd} onFinish={() => {setSendMail(false);getData(1);setSelectedItem([]);}} />
        </Dialog>
        <Dialog modal={true} position="center" visible={sendCertifiedMail.open} header={translations.filing.standard_filing.options_speed_dial.mail_reply} style={{ width: '70vw' }} onHide={() => setCertifiedMail({ open: false, id: null })}>
          <SendCertifiedMail
            dataFiling={filing}
            tableDocument={filing.charge_doc_filings}
            responseDocument={[
                {
                  id: id,
                  template_url: template_url,
                  name: 'Respuesta',
                  created_at: created_at
                }
            ]}
            idResponse={id}
            onFinish={() => setCertifiedMail({ open: false, id: null })}
          />
          </Dialog>

          {activeTab === "documentos" && (
            <>
              <Tooltip target=".speeddial-bottom-right .p-speeddial-action" position="left" />
              
              <SpeedDial model={optionsTool} direction="up"
                className="speeddial-bottom-right right-4 bottom-4"
                buttonClassName="btn-open"
              />
            </>
          )}
      </>
    );
}