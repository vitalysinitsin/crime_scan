import { createContext, useContext, useMemo, useState } from "react";
import { TorontoMCIFeature } from "../models/feature";
import { buildCategoryColorMap } from "../utils/categoryColors";

interface CrimesContextType {
  crimes: TorontoMCIFeature[];
  setCrimes: React.Dispatch<React.SetStateAction<TorontoMCIFeature[]>>;
  categoryColorMap: Record<string, string>;
}

const CrimesContext = createContext<CrimesContextType | undefined>(undefined);

function CrimesProvider({ children }: { children: React.ReactNode }) {
  const [crimes, setCrimes] = useState<TorontoMCIFeature[]>([]);

  const categoryColorMap = useMemo(() => {
    const uniqueCategories = [
      ...new Set(crimes.map((c) => c.attributes.CSI_CATEGORY?.trim() || "Unknown")),
    ];
    return buildCategoryColorMap(uniqueCategories);
  }, [crimes]);

  return (
    <CrimesContext.Provider value={{ crimes, setCrimes, categoryColorMap }}>
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
