import { toast, ToastPosition } from "react-toastify";

export const successToast = (message: any, options?: any) => {
    toast.success(message, {
        position: "top-right",
        autoClose: options?.autoClose ? options?.autoClose : 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

export const errorToast = (message: any, option?: any) => {
    toast.error(message, {
        position: "top-right",
        autoClose: option?.keep ? false : option?.time !== undefined ? option.time : 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: { backgroundColor: '#ba1e24' }
    });
}

export const warningToast = (message: any, time?: number | false | undefined, position?: ToastPosition | undefined) => {
    toast.warning(message, {
        position: position ? position : "top-right",
        autoClose: time !== undefined ? time : 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}


export const infoToast = (message: any) => {
    toast.info(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {},
        toastId: 'unit-info'
    });
}

export const destroyToast = (id: number | string) => {
    toast.dismiss(id)
}