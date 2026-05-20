import { toast } from 'react-toastify';
import { create } from 'zustand'

export const useToastStore = create((set) => ({
    showToast: (message) => {
        toast.info(message);
    },
}))