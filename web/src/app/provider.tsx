import {createContext, ReactNode} from 'react';
const AppContext = createContext({});

interface AppProviderProps {
    children: ReactNode;
}


export default function AppProvider({ children }: AppProviderProps) {
    return <AppContext.Provider value={{}}>
        {children}
    </AppContext.Provider>
}

