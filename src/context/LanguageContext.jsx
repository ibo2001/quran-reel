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
    created: "Created: ",
    selectReciter: "Select Reciter",
    searchReciter: "Search Reciter...",
    selectRecitation: "Select Recitation Style",
    selectSurah: "Select Surah",
    searchSurah: "Search Surah...",
    selectVerseRange: "Select Verse Range",
    startVerse: "Start Verse",
    endVerse: "End Verse",
    verse: "Verse",
    totalVersesSelected: "Total verses selected",
    selectBackground: "Select Background",
    animation: "Entry Animation",
    textColor: "Text Color",
    surah: "Surah",
    verses: "Verses",
    end: "End"
  },
  ar: {
    appTitle: "منشئ ريلز القرآن",
    myCreations: "إبداعاتي",
    logout: "تسجيل خروج",
    signInGoogle: "تسجيل الدخول بجوجل",
    loading: "جاري تحميل البيانات...",
    error: "خطأ: ",
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
    created: "تم الإنشاء: ",
    selectReciter: "اختر القارئ",
    searchReciter: "ابحث عن قارئ...",
    selectRecitation: "اختر نوع التلاوة",
    selectSurah: "اختر السورة",
    searchSurah: "ابحث عن سورة...",
    selectVerseRange: "اختر نطاق الآيات",
    startVerse: "بداية الآيات",
    endVerse: "نهاية الآيات",
    verse: "آية",
    totalVersesSelected: "إجمالي الآيات",
    selectBackground: "اختر الخلفية",
    animation: "طريقة عرض النص",
    textColor: "لون النص",
    surah: "سورة",
    verses: "الآيات",
    end: "النهاية"
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
