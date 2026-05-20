import React from 'react';
import Modal from './Modal';
import Button from '../SmallButton';

export default function ModalWithButtons(props) {
    const { open, onClose, title, children, onConfirm, buttons,error } = props;
    if (!open) {
        return <></>;
    }

    return (
        <Modal open={open} onClose={onClose} >
            <h2 className="text-lg text-[#002F65] font-medium py-2 ">{title}</h2>
            <div className="bg-grey-50 shadow-md rounded border-t-2 px-8 pt-6 pb-8 flex flex-col">{children}</div>
            <div className="flex justify-end mt-2 ">
            {buttons}
                <div className="p-1">
                    <Button
                        onClick={() => onClose()}
                        className="px-3 py-2 rounded bg-[#667379] text-white text-sm font-bold whitespace-nowrap hover:bg-[#595D60] focus:bg-[#6F7477]/80">
                        Cancelar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
