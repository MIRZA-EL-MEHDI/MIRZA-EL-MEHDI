"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

interface Enterprise {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  role: string;
}

interface EnterpriseContextType {
  enterprises: Enterprise[];
  currentEnterprise: Enterprise | null;
  setCurrentEnterprise: (enterprise: Enterprise) => void;
  loading: boolean;
  refreshEnterprises: () => Promise<void>;
}

const EnterpriseContext = createContext<EnterpriseContextType>({
  enterprises: [],
  currentEnterprise: null,
  setCurrentEnterprise: () => {},
  loading: true,
  refreshEnterprises: async () => {},
});

export function useEnterprise() {
  return useContext(EnterpriseContext);
}

function EnterpriseProvider({ children }: { children: React.ReactNode }) {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [currentEnterprise, setCurrentEnterprise] = useState<Enterprise | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshEnterprises = async () => {
    try {
      const res = await fetch("/api/enterprises");
      if (res.ok) {
        const data = await res.json();
        setEnterprises(data);
        if (data.length > 0 && !currentEnterprise) {
          const saved = localStorage.getItem("currentEnterpriseId");
          const found = data.find((e: Enterprise) => e.id === saved);
          setCurrentEnterprise(found || data[0]);
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEnterprises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetEnterprise = (enterprise: Enterprise) => {
    setCurrentEnterprise(enterprise);
    localStorage.setItem("currentEnterpriseId", enterprise.id);
  };

  return (
    <EnterpriseContext.Provider
      value={{
        enterprises,
        currentEnterprise,
        setCurrentEnterprise: handleSetEnterprise,
        loading,
        refreshEnterprises,
      }}
    >
      {children}
    </EnterpriseContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <EnterpriseProvider>{children}</EnterpriseProvider>
    </SessionProvider>
  );
}
