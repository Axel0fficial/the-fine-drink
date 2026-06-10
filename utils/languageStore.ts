import { create } from "zustand";

type Language = "en" | "es";

type LanguageStore = {
  language: Language;
  toggleLanguage: () => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: "en",
  toggleLanguage: () =>
    set((state) => ({
      language: state.language === "en" ? "es" : "en",
    })),
}));
