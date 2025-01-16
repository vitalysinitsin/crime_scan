import { IFeature } from "@esri/arcgis-rest-request";
import { createContext, useContext, useState } from "react";

interface CrimesContextType {
  crimes: IFeature[];
  setCrimes: React.Dispatch<React.SetStateAction<IFeature[]>>;
}

const CrimesContext = createContext<CrimesContextType | undefined>(undefined);

function CrimesProvider({ children }: { children: React.ReactNode }) {
  const [crimes, setCrimes] = useState<IFeature[]>([]);

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
