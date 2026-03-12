import React, { createContext, useContext, useState } from "react";

interface BranchFilterContextValue {
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
}

const BranchFilterContext = createContext<BranchFilterContextValue>({
  selectedBranch: "",
  setSelectedBranch: () => {},
});

export function BranchFilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  return (
    <BranchFilterContext.Provider value={{ selectedBranch, setSelectedBranch }}>
      {children}
    </BranchFilterContext.Provider>
  );
}

export function useBranchFilter() {
  return useContext(BranchFilterContext);
}
