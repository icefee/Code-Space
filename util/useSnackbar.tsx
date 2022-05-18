import React, { createContext, useState, useEffect, useContext } from 'react';
import { Snackbar, SnackbarProps } from '@mui/material';

export type SnackbarOption = Exclude<SnackbarProps, 'open' | 'onClose'>

export type SnackbarContextProps = {
    // option: any;
    // setOption: React.Dispatch<SnackbarOption>;
    showSnackbar: (option: SnackbarOption) => void;
}
export const SnackbarContext = createContext<SnackbarContextProps>(null)

export function SnackbarProvider({ children }) {
    const [snackbarOption, setSnackbarOption] = useState<SnackbarOption>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    return (
        <SnackbarContext.Provider value={{
            // setOption: setSnackbarOption,
            showSnackbar: (option: SnackbarOption) => {
                setSnackbarOption(option);
                setSnackbarOpen(true);
            }
        }}>
            {children}
            {snackbarOption && <Snackbar
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                {...snackbarOption}
            >{snackbarOption.children}</Snackbar>}
        </SnackbarContext.Provider>
    )
}

export function useSnackbar() {
    const { showSnackbar } = useContext(SnackbarContext)
    return showSnackbar
}
