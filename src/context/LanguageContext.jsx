import React,{createContext,useState,useContext,useEffect} from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    appTitle: "Quran Reel Generator",
    myCreations: "My Creations",
    logout: "Logout",
    signInGoogle: "Sign in with Google",
    loading: "Loading data...",
    error: "Error: ",
    selectSurah: "Select a Surah to start",
    previewPlaceholder: "Preview will appear here",
    editorOptions: "Editor Options",
    versesPreview: "Verses Preview",
    saveProject: "💾 Save Project",
    saving: "Saving...",
    loginToSave: "Login to Save",
    upload: "Upload Image/Video",
    startCreating: "Start creating now →",
    noProjects: "You haven't created any projects yet.",
    newProject: "+ New Project",
    created: "Created: "
  },
  ar: {
    appTitle: "منشئ ريلز القرآن",
    myCreations: "إبداعاتي",
    logout: "تسجيل خروج",
    signInGoogle: "تسجيل الدخول بجوجل",
    loading: "جاري تحميل البيانات...",
    error: "خطأ: ",
    selectSurah: "اختر سورة للبدء",
    previewPlaceholder: "ستظهر المعاينة هنا",
    editorOptions: "خيارات المحرر",
    versesPreview: "معاينة الآيات",
    saveProject: "💾 حفظ المشروع",
    saving: "جاري الحفظ...",
    loginToSave: "سجل لحفظ المشروع",
    upload: "رفع صورة/فيديو",
    startCreating: "ابدأ الإنشاء الآن ←",
    noProjects: "لم تقم بإنشاء أي مشاريع بعد.",
    newProject: "+ مشروع جديد",
    created: "تم الإنشاء: "
  }
};

export const LanguageProvider = ({children}) => {
  const [language,setLanguage] = useState('ar'); // Default Arabic

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key) => translations[language][key] || key;

  // Update document direction
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  },[language]);

  return (
    <LanguageContext.Provider value={{language,toggleLanguage,t}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
