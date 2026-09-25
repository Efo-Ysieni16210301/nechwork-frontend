/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Language = "en" | "am";

const translations = {
  en: {
    home: "Home", shop: "Shop", gallery: "Gallery", articles: "Articles", about: "About",
    admin: "Admin", products: "Products", orders: "Orders", customers: "Customers",
    myOrders: "My orders", bag: "Bag", login: "Log in", signup: "Sign up", logout: "Log out",
    theShop: "The shop", shopTitle: "Good things, thoughtfully sourced.",
    shopDescription: "Everyday essentials and small luxuries from producers we know and trust.",
    seeWorld: "See our world →", searchShop: "Search the shop", addToBag: "Add to bag",
    noProducts: "No products match that search.", yourAccount: "Your account",
    myOrdersTitle: "My orders", trackOrders: "Track payment review, preparation, shipping, and delivery updates for your purchases.",
    loading: "Loading...", loadingOrders: "Loading your orders...", noOrders: "You have no orders yet.",
    browseShop: "Browse the shop", signInOrders: "Sign in to view your orders", dateUnavailable: "Date unavailable",
    items: "Items", itemsUnavailable: "Items unavailable", payment: "Payment", notProvided: "Not provided",
    transaction: "Transaction", viewProof: "View submitted payment proof ↗", paymentPending: "Payment pending review",
    underReview: "Under review", paymentConfirmed: "Payment confirmed", beingPrepared: "Being prepared",
    shipped: "Shipped", delivered: "Delivered", rejected: "Rejected", cancelled: "Cancelled",
    couldNotLoadOrders: "Could not load your orders.",
    language: "አማ",
  },
  am: {
    home: "መነሻ", shop: "ሱቅ", gallery: "የምስል ማዕከል", articles: "ጽሑፎች", about: "ስለ እኛ",
    admin: "አስተዳደር", products: "ምርቶች", orders: "ትዕዛዞች", customers: "ደንበኞች",
    myOrders: "የእኔ ትዕዛዞች", bag: "የግዢ ቦርሳ", login: "ግባ", signup: "ተመዝገብ", logout: "ውጣ",
    theShop: "ሱቁ", shopTitle: "በጥንቃቄ የተመረጡ ጥሩ ነገሮች።",
    shopDescription: "ከምናምናቸው አምራቾች የተመረጡ የዕለት ተዕለት አስፈላጊ እቃዎች።",
    seeWorld: "ዓለማችንን ይመልከቱ →", searchShop: "በሱቁ ይፈልጉ", addToBag: "ወደ ቦርሳ ጨምር",
    noProducts: "ከፍለጋዎ ጋር የሚስማማ ምርት የለም።", yourAccount: "የእርስዎ መለያ",
    myOrdersTitle: "የእኔ ትዕዛዞች", trackOrders: "የክፍያ፣ የዝግጅት፣ የመላኪያ እና የደረሰኝ ሁኔታን ይከታተሉ።",
    loading: "በመጫን ላይ...", loadingOrders: "ትዕዛዞችዎን በመጫን ላይ...", noOrders: "እስካሁን ምንም ትዕዛዝ የለዎትም።",
    browseShop: "ሱቁን ይመልከቱ", signInOrders: "ትዕዛዞችዎን ለማየት ይግቡ", dateUnavailable: "ቀን አልተገኘም",
    items: "እቃዎች", itemsUnavailable: "እቃዎች አልተገኙም", payment: "ክፍያ", notProvided: "አልተሰጠም",
    transaction: "የግብይት ቁጥር", viewProof: "የተላከውን የክፍያ ማረጋገጫ ይመልከቱ ↗", paymentPending: "ክፍያ እየተገመገመ ነው",
    underReview: "በግምገማ ላይ", paymentConfirmed: "ክፍያ ተረጋግጧል", beingPrepared: "በመዘጋጀት ላይ",
    shipped: "ተልኳል", delivered: "ደርሷል", rejected: "ውድቅ ተደርጓል", cancelled: "ተሰርዟል",
    couldNotLoadOrders: "ትዕዛዞችዎን መጫን አልተቻለም።", language: "EN",
  },
} as const;

type TranslationKey = keyof typeof translations.en;
interface LanguageContextValue {
  language: Language;
  t: (key: TranslationKey) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return saved === "am" ? "am" : "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language === "am" ? "am" : "en";
  }, [language]);

  const value = useMemo(() => ({
    language,
    t: (key: TranslationKey) => translations[language][key],
    toggleLanguage: () => setLanguage((current) => current === "en" ? "am" : "en"),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
