import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';

export default function Upload({ onChangeDocs, limitDocs = 5, allowedFiles = '*', iconSelect = 'pi pi-fw pi-file' }) {
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const [files, setFiles] = useState([]);
    const fileUploadRef = useRef(null);

    useEffect(() => {
        sendUpdateFiles();
    }, [files]);

    const isValidExtension = (fileName) => {
        const fileExtension = fileName.split('.').pop().toLowerCase();
        if(allowedFiles == '*') {
            return true
        }
        return allowedFiles.includes(fileExtension);
    };

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let validFiles = [];
        let invalidFiles = [];

        e.files.forEach((file) => {
            if (isValidExtension(file.name)) {
                validFiles.push(file);
                _totalSize += file.size || 0;
            } else {
                invalidFiles.push(file.name);
            }
        });

        if (invalidFiles.length > 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Los siguientes archivos no tienen una extensión permitida: ${invalidFiles.join(', ')}`,
                life: 5000,
            });
        }

        if (fileUploadRef.current) {
            fileUploadRef.current.setFiles(validFiles);
        }

        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setFiles((prevFiles) => [...prevFiles, { name: file.name, data: reader.result }]);
            });
            reader.readAsDataURL(file);
        });

        setTotalSize(_totalSize);
    };

    const onTemplateRemove = (file, callback) => {
        setFiles((prevFiles) => prevFiles.filter((item) => item.name !== file.name));
        setTotalSize((prevSize) => prevSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setFiles([]);
        setTotalSize(0);
    };

    const sendUpdateFiles = () => {
        onChangeDocs(files);
    };

    const headerTemplate = ({ className, chooseButton, cancelButton }) => (
        <div className={`${className} flex items-center gap-3 bg-transparent p-2`}>
            {files.length < limitDocs && chooseButton}
            {cancelButton}
        </div>
    );

    const itemTemplate = (file, props) => {
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
    
        return (
            <Card className="p-4 m-2 w-full shadow-md rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-grow mx-4">
                        <div className="w-[60px] h-[60px] flex items-center justify-center bg-gray-100 rounded-md">
                            {file.objectURL ? (
                                <img 
                                    alt={file.name} 
                                    src={file.objectURL || "/placeholder.svg"} 
                                    className="rounded-md object-cover w-full h-full"
                                />
                            ) : (
                                <i className={`${getFileIcon(file.name)} text-4xl text-gray-600`}></i>
                            )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0 flex-grow h-[60px]">
                            <span className="font-semibold text-lg truncate">{file.name}</span>
                            <small className="text-gray-500">{new Date().toLocaleDateString()}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Tag value={props.formatSize} severity="info" className="px-3 py-1" />
                        <Button
                            type="button"
                            icon="pi pi-times"
                            className="p-button-rounded p-button-text p-button-danger"
                            onClick={() => onTemplateRemove(file, props.onRemove)}
                        />
                    </div>
                </div>
            </Card>
        );
    };

    const emptyTemplate = () => (
        <div className="flex flex-col items-center text-center p-5">
            <i className="pi pi-cloud-upload text-gray-400 text-6xl mb-3"></i>
            <span className="text-gray-500 text-lg">Arrastra y suelta los archivos aquí</span>
        </div>
    );

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <Toast ref={toast} />
            <Tooltip target=".custom-choose-btn" content="Seleccionar" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Borrar" position="bottom" />

            <FileUpload
                ref={fileUploadRef}
                name="demo[]"
                accept={allowedFiles}
                multiple
                maxFileSize={51200000}
                onSelect={onTemplateSelect}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={{ icon: iconSelect, iconOnly: false, className: 'p-button-outlined p-button-rounded p-button-info' }}
                cancelOptions={{ icon: 'pi pi-fw pi-times', iconOnly: false, className: 'p-button-outlined p-button-rounded p-button-danger' }}
            />
        </div>
    );
}
