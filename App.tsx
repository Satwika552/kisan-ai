import { useState, useRef, useCallback, useEffect } from "react";

// --- Translation Data ---
const translations: Record<string, Record<string, string>> = {
  en: {
    weather_advice: "Weather: {forecast}",
    crop_health: "Crop Health: {status} (NDVI: {ndvi})",
    irrigation_advice: "Irrigation: {advice}",
    risk_alert: "Risk Alert: {alert}",
    market_suggestion: "Market: {suggestion}",
    nutrient_deficiency:
      "Nutrient deficiency detected. Apply nitrogen and micronutrient fertilizer immediately.",
    pest_risk:
      "High humidity with rice crop increases pest risk. Monitor for brown plant hopper and apply neem-based pesticide.",
    irrigation_needed:
      "Soil moisture is low. Schedule irrigation within 2 days. Use drip irrigation for efficiency.",
    avoid_irrigation:
      "Rain is forecast in the next 3 days. Avoid irrigation to prevent waterlogging.",
    moderate_irrigation:
      "Soil moisture is moderate. Monitor and irrigate if no rain within 2 days.",
    no_risk: "No significant risk detected at this time.",
    heat_stress:
      "High temperature stress detected. Provide shade nets and increase watering frequency.",
    market_now:
      "Current market prices are favorable. Consider harvesting and selling within the week.",
    market_wait:
      "Market prices are expected to improve in 2-3 weeks. Consider holding your produce if storage allows.",
    market_stable:
      "Market prices are stable. Plan your sale based on your cash flow needs.",
    vegetation_healthy: "Vegetation is healthy with good density.",
    vegetation_stressed:
      "Vegetation shows stress signs. Increase monitoring frequency.",
    vegetation_moderate:
      "Vegetation condition is moderate. Regular monitoring recommended.",
  },
  ta: {
    weather_advice: "வானிலை: {forecast}",
    crop_health: "பயிர் ஆரோக்கியம்: {status} (NDVI: {ndvi})",
    irrigation_advice: "நீர்ப்பாசனம்: {advice}",
    risk_alert: "ஆபத்து எச்சரிக்கை: {alert}",
    market_suggestion: "சந்தை: {suggestion}",
    nutrient_deficiency:
      "ஊட்டச்சத்து குறைபாடு கண்டறியப்பட்டது. உடனடியாக நைட்ரஜன் மற்றும் நுண்ணூட்டச்சத்து உரம் பயன்படுத்தவும்.",
    pest_risk:
      "நெல் பயிரில் அதிக ஈரப்பதம் பூச்சி ஆபத்தை அதிகரிக்கிறது. பழுப்பு தத்துப்பூச்சியை கவனியுங்கள் மற்றும் வேப்ப அடிப்படையிலான பூச்சிக்கொல்லி பயன்படுத்தவும்.",
    irrigation_needed:
      "மண் ஈரப்பதம் குறைவாக உள்ளது. 2 நாட்களுக்குள் நீர்ப்பாசனம் செய்யவும். செயல்திறனுக்கு சொட்டு நீர்ப்பாசனம் பயன்படுத்தவும்.",
    avoid_irrigation:
      "அடுத்த 3 நாட்களில் மழை எதிர்பார்க்கப்படுகிறது. நீர்த்தேக்கத்தை தவிர்க்க நீர்ப்பாசனத்தை தவிர்க்கவும்.",
    moderate_irrigation:
      "மண் ஈரப்பதம் மிதமானது. 2 நாட்களுக்குள் மழை இல்லையெனில் நீர்ப்பாசனம் செய்யவும்.",
    no_risk: "தற்போது குறிப்பிடத்தக்க ஆபத்து எதுவும் கண்டறியப்படவில்லை.",
    heat_stress:
      "அதிக வெப்பநிலை அழுத்தம் கண்டறியப்பட்டது. நிழல் வலைகளை வழங்கி நீர்ப்பாசன அதிர்வெண்ணை அதிகரிக்கவும்.",
    market_now:
      "தற்போதைய சந்தை விலைகள் சாதகமாக உள்ளன. இந்த வாரத்திற்குள் அறுவடை செய்து விற்பனை செய்யலாம்.",
    market_wait:
      "சந்தை விலைகள் 2-3 வாரங்களில் மேம்படும் என எதிர்பார்க்கப்படுகிறது. சேமிப்பகம் இருந்தால் உற்பத்தியை வைத்திருக்கலாம்.",
    market_stable:
      "சந்தை விலைகள் நிலையாக உள்ளன. உங்கள் பணப்புழக்க தேவைகளின் அடிப்படையில் விற்பனை திட்டமிடவும்.",
    vegetation_healthy: "தாவரங்கள் ஆரோக்கியமாக உள்ளன.",
    vegetation_stressed:
      "தாவரங்களில் அழுத்த அறிகுறிகள் உள்ளன. கண்காணிப்பை அதிகரிக்கவும்.",
    vegetation_moderate:
      "தாவர நிலை மிதமானது. வழக்கமான கண்காணிப்பு பரிந்துரைக்கப்படுகிறது.",
  },
  te: {
    weather_advice: "వాతావరణం: {forecast}",
    crop_health: "పంట ఆరోగ్యం: {status} (NDVI: {ndvi})",
    irrigation_advice: "నీటిపారుదల: {advice}",
    risk_alert: "ప్రమాద హెచ్చరిక: {alert}",
    market_suggestion: "మార్కెట్: {suggestion}",
    nutrient_deficiency:
      "పోషకలోపం గుర్తించబడింది. వెంటనే నత్రజని మరియు సూక్ష్మపోషక ఎరువులు వాడండి.",
    pest_risk:
      "వరి పంటలో అధిక తేమ పురుగుల ప్రమాదాన్ని పెంచుతుంది. బ్రౌన్ ప్లాంట్ హాప్పర్ కోసం పర్యవేక్షించండి మరియు వేప ఆధారిత పురుగుమందు వాడండి.",
    irrigation_needed:
      "నేల తేమ తక్కువగా ఉంది. 2 రోజులలోపు నీటిపారుదల చేయండి. సమర్థత కోసం డ్రిప్ నీటిపారుదల వాడండి.",
    avoid_irrigation:
      "రాబున్న 3 రోజుల్లో వర్షం అంచనా. నీటి నిల్వను నివారించడానికి నీటిపారుదల ఆపండి.",
    moderate_irrigation:
      "నేల తేమ మితమైనది. 2 రోజులలో వర్షం లేకపోతే నీటిపారుదల చేయండి.",
    no_risk:
      "ప్రస్తుతం గణనీయమైన ప్రమాదం ఏదీ గుర్తించబడలేదు.",
    heat_stress:
      "అధిక ఉష్ణోగ్రత ఒత్తిడి గుర్తించబడింది. నీడ వలలను అందించి నీటిపారుదల ఫ్రీక్వెన్సీని పెంచండి.",
    market_now:
      "ప్రస్తుత మార్కెట్ ధరలు అనుకూలంగా ఉన్నాయి. ఈ వారంలో పంట కోసి అమ్మడాన్ని పరిగణించండి.",
    market_wait:
      "మార్కెట్ ధరలు 2-3 వారాల్లో మెరుగుపడతాయని అంచనా. నిల్వ వీలైతే ఉత్పత్తిని పట్టుకోండి.",
    market_stable:
      "మార్కెట్ ధరలు స్థిరంగా ఉన్నాయి. మీ నగదు ప్రవాహ అవసరాల ఆధారంగా అమ్మకం ప్రణాళిక చేయండి.",
    vegetation_healthy: "వృక్షసంపద ఆరోగ్యంగా ఉంది.",
    vegetation_stressed:
      "వృక్షసంపదలో ఒత్తిడి లక్షణాలు ఉన్నాయి. పర్యవేక్షణ పెంచండి.",
    vegetation_moderate:
      "వృక్షసంపద స్థితి మితమైనది. క్రమం తప్పకుండా పర్యవేక్షణ సిఫార్సు చేయబడుతుంది.",
  },
  hi: {
    weather_advice: "मौसम: {forecast}",
    crop_health: "फसल स्वास्थ्य: {status} (NDVI: {ndvi})",
    irrigation_advice: "सिंचाई: {advice}",
    risk_alert: "जोखिम अलर्ट: {alert}",
    market_suggestion: "बाजार: {suggestion}",
    nutrient_deficiency:
      "पोषक तत्व की कमी पाई गई। तुरंत नाइट्रोजन और सूक्ष्म पोषक उर्वरक लगाएं।",
    pest_risk:
      "धान की फसल में उच्च नमी कीट जोखिम बढ़ाती है। ब्राउन प्लांट हॉपर की निगरानी करें और नीम आधारित कीटनाशक का उपयोग करें।",
    irrigation_needed:
      "मिट्टी की नमी कम है। 2 दिनों के भीतर सिंचाई करें। दक्षता के लिए ड्रिप सिंचाई का उपयोग करें।",
    avoid_irrigation:
      "अगले 3 दिनों में बारिश की संभावना है। जलभराव से बचने के लिए सिंचाई न करें।",
    moderate_irrigation:
      "मिट्टी की नमी मध्यम है। 2 दिनों में बारिश न होने पर सिंचाई करें।",
    no_risk: "इस समय कोई महत्वपूर्ण जोखिम नहीं पाया गया।",
    heat_stress:
      "उच्च तापमान तनाव पाया गया। छाया जाल प्रदान करें और सिंचाई की आवृत्ति बढ़ाएं।",
    market_now:
      "वर्तमान बाजार भाव अनुकूल हैं। इस सप्ताह के भीतर कटाई और बिक्री पर विचार करें।",
    market_wait:
      "बाजार भाव 2-3 सप्ताह में सुधरने की उम्मीद है। भंडारण संभव हो तो उत्पाद रोकें।",
    market_stable:
      "बाजार भाव स्थिर हैं। अपनी नकदी प्रवाह आवश्यकताओं के आधार पर बिक्री की योजना बनाएं।",
    vegetation_healthy: "वनस्पति स्वस्थ है।",
    vegetation_stressed: "वनस्पति में तनाव के संकेत हैं। निगरानी बढ़ाएं।",
    vegetation_moderate:
      "वनस्पति की स्थिति मध्यम है। नियमित निगरानी अनुशंसित है।",
  },
};

const forecastTranslations: Record<string, Record<string, string>> = {
  en: { partly_cloudy: "Partly cloudy", rainy: "Rainy", sunny: "Sunny", cloudy: "Cloudy" },
  ta: { partly_cloudy: "பகுதி மேகமூட்டம்", rainy: "மழை", sunny: "வெயில்", cloudy: "மேகமூட்டம்" },
  te: { partly_cloudy: "పాక్షిక మేఘావృతం", rainy: "వర్షం", sunny: "ఎండ", cloudy: "మేఘావృతం" },
  hi: { partly_cloudy: "आंशिक बादल", rainy: "बारिश", sunny: "धूप", cloudy: "बादल" },
};

const healthTranslations: Record<string, Record<string, string>> = {
  en: { healthy: "Healthy", stressed: "Stressed", moderate: "Moderate" },
  ta: { healthy: "ஆரோக்கியமான", stressed: "மன அழுத்தம்", moderate: "மிதமான" },
  te: { healthy: "ఆరోగ్యంగా", stressed: "ఒత్తిడి", moderate: "మితమైన" },
  hi: { healthy: "स्वस्थ", stressed: "तनावग्रस्त", moderate: "मध्यम" },
};

// --- Simulated Data ---
const ndviData: Record<string, { ndvi_value: number; health_status: string }> = {
  default: { ndvi_value: 0.52, health_status: "moderate" },
  thanjavur: { ndvi_value: 0.68, health_status: "healthy" },
  guntur: { ndvi_value: 0.45, health_status: "stressed" },
  nashik: { ndvi_value: 0.58, health_status: "moderate" },
  karnal: { ndvi_value: 0.72, health_status: "healthy" },
};

const weatherData: Record<
  string,
  {
    temperature_c: number;
    humidity_pct: number;
    forecast: string;
    soil_moisture: string;
    rain_next_3_days: boolean;
  }
> = {
  default: { temperature_c: 32, humidity_pct: 65, forecast: "partly_cloudy", soil_moisture: "moderate", rain_next_3_days: false },
  thanjavur: { temperature_c: 35, humidity_pct: 82, forecast: "rainy", soil_moisture: "high", rain_next_3_days: true },
  guntur: { temperature_c: 38, humidity_pct: 40, forecast: "sunny", soil_moisture: "low", rain_next_3_days: false },
  nashik: { temperature_c: 30, humidity_pct: 55, forecast: "partly_cloudy", soil_moisture: "moderate", rain_next_3_days: false },
  karnal: { temperature_c: 28, humidity_pct: 70, forecast: "cloudy", soil_moisture: "high", rain_next_3_days: true },
};

// --- Helpers ---
function t(key: string, lang: string, args?: Record<string, string>): string {
  const text = (translations[lang] || translations.en)[key] || (translations.en as Record<string, string>)[key] || key;
  if (!args) return text;
  return Object.entries(args).reduce(
    (acc, [k, v]) => acc.replace(`{${k}}`, v),
    text
  );
}

function getVillageData<T>(data: Record<string, T>, village: string): T {
  const key = village.toLowerCase().trim().replace(/\s+/g, "_");
  return data[key] || data.default;
}

function analyzeFarming(village: string, crop: string, problem: string, lang: string) {
  const weather = getVillageData(weatherData, village);
  const ndvi = getVillageData(ndviData, village);

  const forecastLocal = (forecastTranslations[lang] || forecastTranslations.en)[weather.forecast] || weather.forecast;
  const weatherText = t("weather_advice", lang, { forecast: forecastLocal });

  const healthLocal = (healthTranslations[lang] || healthTranslations.en)[ndvi.health_status] || ndvi.health_status;
  const cropHealthText = t("crop_health", lang, { status: healthLocal, ndvi: String(ndvi.ndvi_value) });

  const vegKey = ndvi.health_status === "healthy" ? "vegetation_healthy" : ndvi.health_status === "stressed" ? "vegetation_stressed" : "vegetation_moderate";
  const vegText = t(vegKey, lang);

  let irrigationKey: string;
  if (weather.rain_next_3_days) irrigationKey = "avoid_irrigation";
  else if (weather.soil_moisture === "low") irrigationKey = "irrigation_needed";
  else irrigationKey = "moderate_irrigation";
  const irrigationFull = t("irrigation_advice", lang, { advice: t(irrigationKey, lang) });

  const problemLower = problem.toLowerCase();
  const risks: string[] = [];
  if (/yellow|pale|discolor/.test(problemLower)) risks.push(t("nutrient_deficiency", lang));
  if (weather.humidity_pct > 70 && /rice|paddy/.test(crop.toLowerCase())) risks.push(t("pest_risk", lang));
  if (weather.temperature_c > 37) risks.push(t("heat_stress", lang));
  if (!risks.length) risks.push(t("no_risk", lang));
  const riskFull = t("risk_alert", lang, { alert: risks.join(" ") });

  let marketKey: string;
  if (ndvi.ndvi_value > 0.6) marketKey = "market_now";
  else if (ndvi.ndvi_value < 0.5) marketKey = "market_wait";
  else marketKey = "market_stable";
  const marketFull = t("market_suggestion", lang, { suggestion: t(marketKey, lang) });

  const advice = {
    weather: weatherText,
    crop_health: cropHealthText + " " + vegText,
    irrigation: irrigationFull,
    risk_alert: riskFull,
    market: marketFull,
  };

  return { advice, text: Object.values(advice).join(". ") };
}

// --- Icons ---
function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C8.5 14.52 10 13 10 13" />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CropIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 2v10l6.5-6.5" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function TriangleAlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  );
}

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

// --- Language Config ---
const LANGUAGES = [
  { code: "ta", label: "Tamil", voice: "ta-IN" },
  { code: "te", label: "Telugu", voice: "te-IN" },
  { code: "hi", label: "Hindi", voice: "hi-IN" },
  { code: "en", label: "English", voice: "en-IN" },
];

// --- Advice Category Config ---
const ADVICE_CATEGORIES = [
  { key: "weather" as const, label: "Weather", icon: SunIcon, colorClass: "weather" },
  { key: "crop_health" as const, label: "Crop Health", icon: LeafIcon, colorClass: "crop-health" },
  { key: "irrigation" as const, label: "Irrigation", icon: DropletIcon, colorClass: "irrigation" },
  { key: "risk_alert" as const, label: "Risk Alert", icon: TriangleAlertIcon, colorClass: "risk" },
  { key: "market" as const, label: "Market", icon: BarChartIcon, colorClass: "market" },
];

// --- Main App ---
function App() {
  const [selectedLang, setSelectedLang] = useState("en");
  const [voiceLang, setVoiceLang] = useState("en-IN");
  const [village, setVillage] = useState("");
  const [crop, setCrop] = useState("");
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [advice, setAdvice] = useState<Record<string, string> | null>(null);
  const [lastSpeechText, setLastSpeechText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [micStatus, setMicStatus] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);

  // Load voices
  useEffect(() => {
    const loadVoices = () => setVoices(speechSynthesis.getVoices());
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Speech recognition setup
  function createRecognition() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    return new SR();
  }

  const startRecording = useCallback(() => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const rec = createRecognition();
    if (!rec) {
      setMicStatus("Speech recognition not supported in this browser.");
      return;
    }

    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.lang = voiceLang;

    rec.onstart = () => {
      setIsRecording(true);
      setMicStatus("Listening...");
    };

    rec.onresult = (e: any) => {
      setProblem(e.results[0][0].transcript);
      setMicStatus("");
    };

    rec.onerror = (e: any) => {
      setMicStatus("Voice error: " + e.error);
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
      if (!micStatus.startsWith("Voice error")) setMicStatus("");
    };

    recognitionRef.current = rec;

    try {
      rec.start();
    } catch {
      setMicStatus("Could not start voice input.");
    }
  }, [isRecording, voiceLang, micStatus]);

  const speakText = useCallback(
    (text: string) => {
      if (!text || !speechSynthesis) return;
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langPrefix = voiceLang.split("-")[0];
      const matchedVoice =
        voices.find((v) => v.lang === voiceLang) ||
        voices.find((v) => v.lang.startsWith(langPrefix));
      if (matchedVoice) utterance.voice = matchedVoice;
      utterance.lang = voiceLang;
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    },
    [voiceLang, voices]
  );

  const handleGetAdvice = useCallback(() => {
    setError("");
    setAdvice(null);

    if (!village.trim() || !crop.trim() || !problem.trim()) {
      setError("Please fill in all fields before getting advice.");
      return;
    }

    setLoading(true);

    // Simulate network delay for realistic UX
    setTimeout(() => {
      try {
        const result = analyzeFarming(village.trim(), crop.trim(), problem.trim(), selectedLang);
        setAdvice(result.advice);
        setLastSpeechText(result.text);
        setLoading(false);
        setTimeout(() => speakText(result.text), 300);
      } catch {
        setError("An error occurred while analyzing your farm data.");
        setLoading(false);
      }
    }, 800);
  }, [village, crop, problem, selectedLang, speakText]);

  const handleLangChange = useCallback((code: string, voice: string) => {
    setSelectedLang(code);
    setVoiceLang(voice);
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-icon">
          <LeafIcon className="header-icon-svg" />
        </div>
        <div className="header-text">
          <h1>KISAN.AI</h1>
          <p className="header-subtitle">Smart Farming Advisor</p>
        </div>
      </header>

      {/* Language Selector */}
      <section className="language-section">
        <label className="section-label">Select Language</label>
        <div className="lang-buttons">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`lang-btn ${selectedLang === l.code ? "active" : ""}`}
              onClick={() => handleLangChange(l.code, l.voice)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      {/* Input Section */}
      <section className="input-section">
        <label className="section-label">Farm Details</label>

        <div className="input-group">
          <span className="input-icon"><MapPinIcon /></span>
          <input
            type="text"
            placeholder="Enter village name"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
          />
        </div>

        <div className="input-group">
          <span className="input-icon"><CropIcon /></span>
          <input
            type="text"
            placeholder="Enter crop name"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          />
        </div>

        <div className="input-group input-group-problem">
          <span className="input-icon"><AlertIcon /></span>
          <input
            type="text"
            placeholder="Describe your farming problem"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
          <button
            className={`mic-btn ${isRecording ? "recording" : ""}`}
            onClick={startRecording}
            title="Voice Input"
          >
            <MicIcon />
          </button>
        </div>

        {micStatus && <div className="mic-status">{micStatus}</div>}
      </section>

      {/* Action Button */}
      <button className="action-btn" onClick={handleGetAdvice} disabled={loading}>
        <LeafIcon className="action-btn-icon" />
        Get Farming Advice
      </button>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Analyzing your farm data...</p>
        </div>
      )}

      {/* Error */}
      {error && <div className="error-card">{error}</div>}

      {/* Output Section */}
      {advice && (
        <section className="output-section">
          <label className="section-label">Advisory Report</label>
          <div className="advice-card">
            {ADVICE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.key} className={`advice-item ${cat.colorClass}`}>
                  <div className="advice-icon">
                    <Icon />
                  </div>
                  <div className="advice-content">
                    <span className={`advice-label ${cat.colorClass}`}>{cat.label}</span>
                    <p className="advice-text">{advice[cat.key]}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="hear-btn" onClick={() => speakText(lastSpeechText)}>
            <VolumeIcon />
            Hear Again
          </button>
        </section>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>KISAN.AI &mdash; Empowering Farmers with AI</p>
      </footer>
    </div>
  );
}

export default App;
