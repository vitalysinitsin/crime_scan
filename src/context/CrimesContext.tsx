import { createContext, useState } from "react";

const CrimesContext = createContext({});

function CrimesProvider({ children }: { children: React.ReactNode }) {
  const [crimes, setCrimes] = useState([]);

  const value = {
    crimes,
    setCrimes,
  };

  return (
    <CrimesContext.Provider value={value}>{children}</CrimesContext.Provider>
  );
}

export { CrimesProvider };
export default CrimesContext;
