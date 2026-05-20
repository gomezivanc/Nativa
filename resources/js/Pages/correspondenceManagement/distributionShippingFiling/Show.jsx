import { Link, router, usePage } from '@inertiajs/react'
import { formatDate } from '../../../hooks/useDate'
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';

export default function Show({ filing }) {
    const { translations,current_language } = usePage()?.props    
    const header = (
        <div className="mt-4 flex justify-center items-center">
          <i className="pi pi-file-export" style={{ fontSize: '4rem', color: 'var(--primary-color)' }} />
        </div>
      );
      const FileCard = ({ file, translations }) => {
        const fileDetail = JSON.parse(file.file_detail);
        const downloadUrl = route('file') + '?path=' + encodeURIComponent(file.file);
      
        const getFileIcon = (fileName) => {
          const extension = fileName.split('.').pop().toLowerCase();
          switch (extension) {
            case 'pdf':
              return 'pi pi-file-pdf';
            case 'doc':
            case 'docx':
              return 'pi pi-file-word';
            case 'xls':
            case 'xlsx':
              return 'pi pi-file-excel';
            case 'ppt':
            case 'pptx':
              return 'pi pi-file-powerpoint';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
              return 'pi pi-image';
            default:
              return 'pi pi-file';
          }
        };
      
        const headerFiles = (
          <div className="flex justify-center items-center p-4 bg-gray-100">
            <i className={`${getFileIcon(fileDetail.name)} text-4xl text-blue-500`}></i>
          </div>
        );
      
        return (
          <Card
            key={file.id}
            header={headerFiles}
            className="w-full sm:w-[calc(20%-1rem)] md:w-[calc(50%-1rem)] lg:w-[calc(50%-1rem)] xl:w-[calc(33.333%-1rem)] mx-2 mb-4"
          >
            <div className="p-card-content">
              <p className='font-bold truncate'>{fileDetail.name}</p>
              <p className='text-sm text-gray-600 mt-2'>
                <span className='font-semibold'>{translations.auth.description}:</span> {file.description}
              </p>
            </div>
            <div className="p-card-footer">
              <Button
                label={`${translations.auth.download} (${Math.round(fileDetail.size / 1024)} KB)`}
                icon="pi pi-download"
                className="p-button-text"
                onClick={() => window.open(downloadUrl, '_blank')}
              />
            </div>
          </Card>
        );
      };
      const MainDocumentCard = ({ filing, translations }) => {
        
        const downloadUrl = route('file') + '?path=' + filing.template_url;
        // console.log(downloadUrlMain);
        const getFileIcon = (fileName) => {
          const extension = fileName.split('.').pop().toLowerCase();
          switch (extension) {
            case 'pdf':
              return 'pi pi-file-pdf';
            case 'doc':
            case 'docx':
              return 'pi pi-file-word';
            case 'xls':
            case 'xlsx':
              return 'pi pi-file-excel';
            case 'ppt':
            case 'pptx':
              return 'pi pi-file-powerpoint';
            default:
              return 'pi pi-file';
          }
        };
      
        const headerMainCard = (
          <div className="flex justify-center items-center p-4 bg-gray-100">
            <i className={`${getFileIcon(filing.template_name)} text-4xl text-blue-500`}></i>
          </div>
        );
      
        return (
          <Card
            header={headerMainCard}
            className="w-full max-w-md"
          >
            <div className="p-card-content">
              <p className='font-bold truncate'>{filing.template_name}</p>
            </div>
            <div className="p-card-footer">
            <Button
                label={`${translations.auth.download} ${filing.template_name}`}
                icon="pi pi-download"
                className="p-button-text"
                onClick={() => window.open(downloadUrl, '_blank')}
              />
            </div>
          </Card>
        );
      };
    const hasDocuments = filing.charge_doc_filings && filing.charge_doc_filings.length > 0;
    const hasMainDocument = filing.template_name && filing.template_url;
    return (
        <Card  header={
            <div className='p-5 flex gap-1 flex-col'>
                <div>
                    <Link href={route("filing.index")}>
                        <Button label={translations.auth.back} size='small'/>
                    </Link>
                </div>
            </div>
        } className='grid gap-2 grid-cols-1 items-end'>
            <div className="md:col-span-6 my-3">
                <Fieldset legend={translations.filing.standard_filing.table.number_filing } >
                    <h2 className="font-bold m-0">
                        {filing.filing_number }
                    </h2>
                    <div className="grid gap-2 md:grid-cols-3 items-start mt-4">
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.type_person }:</h3>
                            <p>{ filing?.people_type?.['name_'+current_language] || 'N/A'  }</p>
                        </span>
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.name_social_reason_sender }:</h3>
                            <p>{ filing.name_social_reason_sender +" "+filing.first_surname_legal_representative_sender }</p>
                        </span>
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.document_nit_sender }:</h3>
                            <p>{ filing.document_nit_sender  }</p>
                        </span>
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.address_sender }:</h3>
                            <p>{ filing.address_sender  }</p>
                        </span>
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.city_id }:</h3>
                            <p>{ filing.city.nombre  }</p>
                        </span>
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.department_id }:</h3>
                            <p>{ filing.department.nombre  }</p>
                        </span>
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.country_id }:</h3>
                            <p>{ filing.country.name  }</p>
                        </span>
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.email_sender }:</h3>
                            <p>{ filing.email_sender  }</p>
                        </span>
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.phone_sender }:</h3>
                            <p>{ filing.phone_sender  }</p>
                        </span>
                        <hr className='flex-col md:col-span-3 my-2'/>       

                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.table.documental_type }:</h3>
                            <p>{ filing?.documental_type?.['name_'+current_language] || 'N/A'  }</p>
                        </span>
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.table.types_filing }:</h3>
                            <p>{ filing.types_filings.name  }</p>
                        </span>  
                        <span >
                            <h3 className='font-bold'>{ translations.filing.standard_filing.table.priority }:</h3>
                            <p>{ filing?.priority?.['name_'+current_language] || 'N/A' }</p>
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
                            <p>{ filing.dependency.name }</p>
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
                <hr className='md:col-span-2 my-2'/>
                <Fieldset legend={translations.filing.standard_filing.main_documents}>
                    <div className="flex justify-center">
                        {hasMainDocument ? (
                        <MainDocumentCard filing={filing} translations={translations} />
                        ) : (
                        <p className='md:col-span-2 my-2'>{translations.filing.standard_filing.no_documents}</p>
                        )}
                    </div>
                </Fieldset>
                <Fieldset legend={translations.filing.standard_filing.filing_documents}>
                    <div className="flex flex-wrap justify-center">
                        {hasDocuments ? (
                        filing.charge_doc_filings.map((file) => (
                            file.file && <FileCard key={file.id} file={file} translations={translations} />
                        ))
                        ) : (
                        <p className='md:col-span-2 my-2'>{translations.filing.standard_filing.no_documents}</p>
                        )}
                    </div>
                </Fieldset>
                {
                  filing.finished == 1 && <>
                    <Fieldset legend={translations.filing.standard_filing.finish_detail}>
                      <div className=" w-100">
                          <span>
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.finish_observation }:</h3>
                            <p>{ filing.finish_observation }</p>
                          </span> 
                          <span>
                            <h3 className='font-bold'>{ translations.filing.standard_filing.form.finish_date }:</h3>
                            <p>{ formatDate(filing.finish_date,true) }</p>
                          </span> 
                      </div>
                    </Fieldset>
                  </>             

                }  
            </div>
                         
          
        </Card>        
    );
}