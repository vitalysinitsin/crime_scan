import { createContext, useContext, useState } from "react";
import { TorontoMCIFeature } from "../models/feature";

interface CrimesContextType {
  crimes: TorontoMCIFeature[];
  setCrimes: React.Dispatch<React.SetStateAction<TorontoMCIFeature[]>>;
}

const CrimesContext = createContext<CrimesContextType | undefined>(undefined);

function CrimesProvider({ children }: { children: React.ReactNode }) {
  const [crimes, setCrimes] = useState<TorontoMCIFeature[]>([]);

  return (
    <CrimesContext.Provider value={{ crimes, setCrimes }}>
      {children}
    </CrimesContext.Provider>
  );
}

const useCrimesContext = (): CrimesContextType => {
  const context = useContext(CrimesContext);

  if (!context) {
    throw new Error("Crime context provider is missing.");
  }

  return context;
};

export { CrimesProvider };
export default useCrimesContext;
