import React, { createContext, useContext, useState } from "react";

interface UserPreferences {
  allergens: string[];
  dietaryPreferences: string[];
  medicalConditions: string[];
  setContextAllergens: (a: string[]) => void;
  setContextDietaryPreferences: (d: string[]) => void;
  setContextMedicalConditions: (m: string[]) => void;
}

const PreferencesContext = createContext<UserPreferences | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allergens, setContextAllergens] = useState<string[]>([]);
  const [dietaryPreferences, setContextDietaryPreferences] = useState<string[]>([]);
  const [medicalConditions, setContextMedicalConditions] = useState<string[]>([]);

  return (
    <PreferencesContext.Provider
      value={{
        allergens,
        dietaryPreferences,
        medicalConditions,
        setContextAllergens,
        setContextDietaryPreferences,
        setContextMedicalConditions,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("useUserPreferences must be used within a PreferencesProvider");
  }
  return context;
};
