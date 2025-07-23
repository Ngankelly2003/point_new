import {createContext} from "react";

export const AppContext =
    createContext<AppContextProps>(
        {
            isLoading: false,
            setLoading: () => {},
            title: undefined,
            setTitle: () => {},
            // openSidebar: false,
            // setOpenSidebar: () => {},
        });

export interface AppContextProps {
    isLoading: boolean,
    setLoading: (value: boolean) => void
    title?: string,
    setTitle?: (params?: any) => void
    // openSidebar: boolean,
    // setOpenSidebar: (value: boolean) => void
}
