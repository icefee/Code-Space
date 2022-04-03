import React, { createContext, useState, useEffect, useContext } from 'react';
import { Snackbar, SnackbarProps } from '@mui/material';

export type SnackbarOption = Exclude<SnackbarProps, 'open' | 'onClose'>

type SnackbarContextProps = {
    // option: any;
    // setOption: React.Dispatch<SnackbarOption>;
    showSnackbar: (option: SnackbarOption) => void;
}
const SnackbarContext = createContext<SnackbarContextProps>(null)

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
            />}
        </SnackbarContext.Provider>
    )
}

export function useSnackbar() {
    const { showSnackbar } = useContext(SnackbarContext)
    return showSnackbar
}
