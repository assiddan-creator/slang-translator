import { useState, useRef, useEffect, useCallback } from "react";
import israelDesktop from "./assets/israel-desktop.jpeg";
import israelMobile from "./assets/israel-mobile.jpeg";
import ukDesktop from "./assets/uk-desktop.jpeg";
import ukMobile from "./assets/uk-mobile.jpeg";
import brazilDesktop from "./assets/brazil-desktop.jpeg";
import brazilMobile from "./assets/brazil-mobile.jpeg";
import franceDesktop from "./assets/france-desktop.jpeg";
import franceMobile from "./assets/france-mobile.jpeg";
import germanyDesktop from "./assets/germany-desktop.jpeg";
import germanyMobile from "./assets/germany-mobile.jpeg";
import japanDesktop from "./assets/japan-desktop.jpeg";
import japanMobile from "./assets/japan-mobile.jpeg";
import mexicoDesktop from "./assets/mexico-desktop.jpeg";
import mexicoMobile from "./assets/mexico-mobile.jpeg";
import russiaDesktop from "./assets/russia-desktop.png";
import russiaMobile from "./assets/russia-mobile.jpeg";
import spainDesktop from "./assets/spain-desktop.jpeg";
import spainMobile from "./assets/spain-mobile.jpeg";

const GEMINI_API_KEY = "AIzaSyCHmmmwldZRFwGzEW35er7UgOeWRW1sDkc";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const SLIDER_LABELS = { 1: "Light", 2: "Medium", 3: "Hardcore" };

const THEMES = {
  "English (Standard)": { name:"New York", flag:"🇺🇸", image:"https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80", primary:"#E8283A", secondary:"#002868", tag:"#ff6b78", card:"rgba(0,28,80,0.84)", border:"rgba(232,40,58,0.45)", btn:"linear-gradient(135deg,#E8283A,#b81e2b)", slider:"#E8283A" },
  "Hebrew (Standard)": { name:"Tel Aviv", flag:"🇮🇱", image:"https://images.unsplash.com/photo-1549996409-cee5d193da5a?w=1200&q=80", primary:"#0038b8", secondary:"#dce8ff", tag:"#5b95ff", card:"rgba(0,20,70,0.86)", border:"rgba(0,56,184,0.5)", btn:"linear-gradient(135deg,#0038b8,#002a8c)", slider:"#0038b8" },
  "Spanish": { name:"Madrid", flag:"🇪🇸", image:"https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&q=80", primary:"#AA151B", secondary:"#F1BF00", tag:"#F1BF00", card:"rgba(60,5,8,0.87)", border:"rgba(241,191,0,0.4)", btn:"linear-gradient(135deg,#AA151B,#7a0f14)", slider:"#F1BF00" },
  "French": { name:"Paris", flag:"🇫🇷", image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80", primary:"#002395", secondary:"#ED2939", tag:"#6688ff", card:"rgba(0,15,60,0.87)", border:"rgba(237,41,57,0.4)", btn:"linear-gradient(135deg,#002395,#001566)", slider:"#ED2939" },
  "German": { name:"Berlin", flag:"🇩🇪", image:"https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&q=80", primary:"#ffce00", secondary:"#cc0000", tag:"#ffce00", card:"rgba(8,8,8,0.9)", border:"rgba(255,206,0,0.38)", btn:"linear-gradient(135deg,#cc0000,#990000)", slider:"#ffce00" },
  "Italian": { name:"Rome", flag:"🇮🇹", image:"https://images.unsplash.com/photo-1525874684015-58379d421a52?w=1200&q=80", primary:"#009246", secondary:"#CE2B37", tag:"#00cc66", card:"rgba(0,35,12,0.87)", border:"rgba(206,43,55,0.4)", btn:"linear-gradient(135deg,#009246,#006e35)", slider:"#009246" },
  "Russian": { name:"Moscow", flag:"🇷🇺", image:"https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=1200&q=80", primary:"#D52B1E", secondary:"#1C3578", tag:"#ff6b62", card:"rgba(12,5,5,0.9)", border:"rgba(213,43,30,0.48)", btn:"linear-gradient(135deg,#D52B1E,#a01e14)", slider:"#D52B1E" },
  "Portuguese": { name:"Lisbon", flag:"🇵🇹", image:"https://images.unsplash.com/photo-1513735492246-483525079686?w=1200&q=80", primary:"#006600", secondary:"#FF0000", tag:"#ffcc00", card:"rgba(0,28,0,0.88)", border:"rgba(255,204,0,0.38)", btn:"linear-gradient(135deg,#006600,#004400)", slider:"#ffcc00" },
  "Japanese": { name:"Tokyo", flag:"🇯🇵", image:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80", primary:"#BC002D", secondary:"#fff", tag:"#ff4d6e", card:"rgba(5,5,5,0.9)", border:"rgba(188,0,45,0.45)", btn:"linear-gradient(135deg,#BC002D,#8a0020)", slider:"#BC002D" },
  "Jamaican Patois": { name:"Kingston", flag:"🇯🇲", image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80", primary:"#009B77", secondary:"#FED100", tag:"#FED100", card:"rgba(0,30,15,0.87)", border:"rgba(254,209,0,0.4)", btn:"linear-gradient(135deg,#009B77,#007a5e)", slider:"#009B77" },
  "London Roadman": { name:"London", flag:"🇬🇧", image:"https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80", primary:"#CF142B", secondary:"#00247D", tag:"#ff6677", card:"rgba(0,15,50,0.87)", border:"rgba(207,20,43,0.48)", btn:"linear-gradient(135deg,#CF142B,#9e0e20)", slider:"#CF142B" },
  "New York Brooklyn": { name:"Brooklyn", flag:"🗽", image:"https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80", primary:"#E8283A", secondary:"#1a1a2e", tag:"#ff6b78", card:"rgba(8,8,18,0.9)", border:"rgba(232,40,58,0.45)", btn:"linear-gradient(135deg,#E8283A,#b01e2a)", slider:"#E8283A" },
  "Tokyo Gyaru": { name:"Shibuya", flag:"🌸", image:"https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80", primary:"#FF69B4", secondary:"#9B59B6", tag:"#FF69B4", card:"rgba(35,0,45,0.88)", border:"rgba(255,105,180,0.45)", btn:"linear-gradient(135deg,#FF69B4,#d44e95)", slider:"#FF69B4" },
  "Paris Banlieue": { name:"Banlieue", flag:"🇫🇷", image:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80", primary:"#002395", secondary:"#ED2939", tag:"#6688ff", card:"rgba(3,3,20,0.91)", border:"rgba(237,41,57,0.38)", btn:"linear-gradient(135deg,#002395,#001566)", slider:"#ED2939" },
  "Russian Street": { name:"St. Petersburg", flag:"🇷🇺", image:"https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=1200&q=80", primary:"#D52B1E", secondary:"#aaa", tag:"#ff6b62", card:"rgba(3,3,12,0.92)", border:"rgba(213,43,30,0.45)", btn:"linear-gradient(135deg,#D52B1E,#9a1e14)", slider:"#D52B1E" },
  "Mumbai Hinglish": { name:"Mumbai", flag:"🇮🇳", image:"https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1200&q=80", primary:"#FF9933", secondary:"#138808", tag:"#FF9933", card:"rgba(35,12,0,0.88)", border:"rgba(255,153,51,0.45)", btn:"linear-gradient(135deg,#FF9933,#cc7722)", slider:"#FF9933" },
  "Mexico City Barrio": { name:"Mexico City", flag:"🇲🇽", image:"https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200&q=80", primary:"#006847", secondary:"#CE1126", tag:"#00cc88", card:"rgba(0,25,12,0.88)", border:"rgba(206,17,38,0.4)", btn:"linear-gradient(135deg,#006847,#004430)", slider:"#006847" },
  "Rio Favela": { name:"Rio de Janeiro", flag:"🇧🇷", image:"https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80", primary:"#009C3B", secondary:"#FEDD00", tag:"#FEDD00", card:"rgba(0,22,8,0.88)", border:"rgba(254,221,0,0.38)", btn:"linear-gradient(135deg,#009C3B,#007430)", slider:"#009C3B" },
};

const FALLBACK_THEME = { name:"Global", flag:"🌍", image:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80", primary:"#7c6af7", secondary:"#f7c06a", tag:"#a998ff", card:"rgba(12,8,35,0.85)", border:"rgba(124,106,247,0.4)", btn:"linear-gradient(135deg,#7c6af7,#5a4fd4)", slider:"#7c6af7" };

const PREMIUM = ["Jamaican Patois","London Roadman","New York Brooklyn","Tokyo Gyaru","Paris Banlieue","Russian Street","Mumbai Hinglish","Mexico City Barrio","Rio Favela"];
const LOADING_MSGS = { "Jamaican Patois":"Hold a vibes, mi a cook di patwa... 🇯🇲","London Roadman":"Hold tight bruv, mandem is translating... 🇬🇧","New York Brooklyn":"Hold up my guy, cooking up the heat... 🗽","Tokyo Gyaru":"Chotto matte! Cooking something yabai... ✨","Paris Banlieue":"Attends 2s gros, je prépare une dinguerie... 🇫🇷","Russian Street":"Sekundu bratan, shcha vsyo budet... 🇷🇺","Mumbai Hinglish":"Arey bhai, full jhakaas translation aa raha hai... 🇮🇳","Mexico City Barrio":"Aguanta tantito, wey, ya te lo pongo bien chilango... 🇲🇽","Rio Favela":"Segura aí, mano, já vou deixar teu texto no papo reto... 🇧🇷" };
const INPUT_LANGS = [["he-IL","🇮🇱 Hebrew"],["en-US","🇺🇸 English"],["es-ES","🇪🇸 Spanish"],["fr-FR","🇫🇷 French"],["ru-RU","🇷🇺 Russian"],["ar-SA","🇸🇦 Arabic"],["ja-JP","🇯🇵 Japanese"],["zh-CN","🇨🇳 Chinese"],["it-IT","🇮🇹 Italian"],["de-DE","🇩🇪 German"],["pt-BR","🇧🇷 Portuguese"],["hi-IN","🇮🇳 Hindi"]];

function getTheme(lang) { return THEMES[lang] || FALLBACK_THEME; }

function useIsMobile() {
  const getCurrent = () => (typeof window !== "undefined" ? window.innerWidth < 768 : false);
  const [isMobile, setIsMobile] = useState(getCurrent);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile;
}

function getResponsiveBackground(lang, isMobile, fallbackImage) {
  const localeBackgrounds = {
    israel: { desktop: israelDesktop, mobile: israelMobile },
    uk: { desktop: ukDesktop, mobile: ukMobile },
    brazil: { desktop: brazilDesktop, mobile: brazilMobile },
    france: { desktop: franceDesktop, mobile: franceMobile },
    germany: { desktop: germanyDesktop, mobile: germanyMobile },
    japan: { desktop: japanDesktop, mobile: japanMobile },
    mexico: { desktop: mexicoDesktop, mobile: mexicoMobile },
    russia: { desktop: russiaDesktop, mobile: russiaMobile },
    spain: { desktop: spainDesktop, mobile: spainMobile },
  };

  const langToRegion = {
    "Hebrew (Standard)": "israel",
    "English (Standard)": "uk",
    English: "uk",
    Portuguese: "brazil",
    "Rio Favela": "brazil",
    French: "france",
    "Paris Banlieue": "france",
    German: "germany",
    Japanese: "japan",
    "Tokyo Gyaru": "japan",
    Spanish: "spain",
    "Mexico City Barrio": "mexico",
    Russian: "russia",
    "Russian Street": "russia",
  };

  const region = langToRegion[lang];
  if (region && localeBackgrounds[region]) {
    return isMobile ? localeBackgrounds[region].mobile : localeBackgrounds[region].desktop;
  }
  return fallbackImage;
}

function useSpeechRecognition({ inputLang, onFinalTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [statusText, setStatusText] = useState("Ready — tap the mic to speak");

  const recognitionRef = useRef(null);
  const sessionIdRef = useRef(0);
  const mountedRef = useRef(true);
  const inputLangRef = useRef(inputLang);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  const interimRef = useRef("");

  useEffect(() => {
    inputLangRef.current = inputLang;
  }, [inputLang]);

  useEffect(() => {
    onFinalTranscriptRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  const teardownRecognition = useCallback((withAbort = true) => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.onstart = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    try {
      recognition.stop();
    } catch {
      // Ignore invalid state when already stopped.
    }
    if (withAbort) {
      try {
        if (typeof recognition.abort === "function") recognition.abort();
      } catch {
        // Ignore invalid state when already aborted.
      }
    }
    recognitionRef.current = null;
  }, []);

  const stop = useCallback(async (forceProcess = false) => {
    sessionIdRef.current += 1;
    if (mountedRef.current) {
      setIsRecording(false);
      setIsListening(false);
    }
    teardownRecognition(true);

    const pendingInterim = interimRef.current.trim();
    interimRef.current = "";
    if (mountedRef.current) {
      setInterim("");
      setStatusText("Ready — tap the mic to speak");
    }

    if (forceProcess && pendingInterim) {
      await onFinalTranscriptRef.current(pendingInterim);
    }
  }, [teardownRecognition]);

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatusText("Voice requires Chrome browser");
      return;
    }

    sessionIdRef.current += 1;
    const thisSession = sessionIdRef.current;
    teardownRecognition(true);
    interimRef.current = "";
    setInterim("");

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = inputLangRef.current;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      if (!mountedRef.current || sessionIdRef.current !== thisSession || recognitionRef.current !== recognition) return;
      setIsRecording(true);
      setIsListening(true);
      setStatusText("Listening...");
    };

    recognition.onresult = async (e) => {
      if (!mountedRef.current || sessionIdRef.current !== thisSession || recognitionRef.current !== recognition) return;
      let nextInterim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (!res || !res[0]) continue;
        const transcript = (res[0].transcript || "").trim();
        if (!transcript) continue;
        if (res.isFinal) {
          await onFinalTranscriptRef.current(transcript);
        } else {
          nextInterim = transcript;
        }
      }
      interimRef.current = nextInterim;
      if (mountedRef.current) setInterim(nextInterim);
    };

    recognition.onerror = (e) => {
      if (!mountedRef.current || sessionIdRef.current !== thisSession || recognitionRef.current !== recognition) return;
      const msgs = { "not-allowed": "Allow microphone access", "no-speech": "No speech detected", network: "Network error" };
      setStatusText(msgs[e.error] || `Error: ${e.error}`);
      void stop(false);
    };

    recognition.onend = () => {
      if (!mountedRef.current || sessionIdRef.current !== thisSession) return;
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
      setIsRecording(false);
      setIsListening(false);
      interimRef.current = "";
      setInterim("");
      setStatusText("Ready — tap the mic to speak");
    };

    try {
      recognition.start();
    } catch (e) {
      setStatusText(`Error: ${e.message}`);
      void stop(false);
    }
  }, [stop, teardownRecognition]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      sessionIdRef.current += 1;
      teardownRecognition(true);
    };
  }, [teardownRecognition]);

  return { isRecording, isListening, interim, statusText, start, stop };
}

export default function App() {
  const [inputLang, setInputLang] = useState("he-IL");
  const [outputLang, setOutputLang] = useState("English (Standard)");
  const [mode, setMode] = useState("standard");
  const [slangLevel, setSlangLevel] = useState(2);
  const [location, setLocation] = useState("");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [dictHTML, setDictHTML] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [toast, setToast] = useState({ msg:"", show:false });
  const [imgReady, setImgReady] = useState(true);
  const isMobile = useIsMobile();

  const hebrewRef = useRef("");
  const displayRef = useRef("");
  const toastTimer = useRef(null);
  const prevImg = useRef("");

  const theme = getTheme(outputLang);
  const isPremium = PREMIUM.includes(outputLang);
  const showToggle = !isPremium;
  const showLocation = !isPremium && mode === "slang";
  const showSlider = isPremium || mode === "slang";
  const sliderPct = ((slangLevel - 1) / 2) * 100;
  const isHebrewTheme = outputLang === "Hebrew (Standard)";
  const backgroundImage = getResponsiveBackground(outputLang, isMobile, theme.image);

  useEffect(() => {
    if (prevImg.current === backgroundImage) return;
    setImgReady(false);
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => { setImgReady(true); prevImg.current = backgroundImage; };
  }, [backgroundImage]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg) => {
    setToast({ msg, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ msg: "", show: false }), 2800);
  };

  const doTranslate = useCallback(async (text, lang, m, loc, level) => {
    if (!text.trim()) return "";
    if (!GEMINI_API_KEY) {
      showToast("Missing API key: set VITE_GEMINI_API_KEY");
      return text;
    }
    const isPrem = PREMIUM.includes(lang);
    const slangOn = m === "slang" || isPrem || loc.trim() !== "";
    const intensity = SLIDER_LABELS[level] || "Medium";
    const fmt = "\n\nCRITICAL FORMAT — return ONLY:\n<Translation>\n|||\n<Dictionary: Word - Meaning (1-3 entries)>\nNo other text.";
    setIsTranslating(true);
    setOutputText(LOADING_MSGS[lang] || "Translating... ⏳");
    setDictHTML("");
    let prompt;
    if (!slangOn) {
      prompt = `You are a professional translator. Translate into standard formal ${lang}. Return ONLY the translation. Text: '''${text}'''`;
    } else {
      const base = loc.trim()
        ? `You are an expert in local street culture. Translate into ${lang}, using authentic street slang of ${loc}. Intensity: ${intensity}.`
        : `You are an expert in local street culture. Translate into authentic ${lang} street slang. Intensity: ${intensity}.`;
      prompt = `${base}\nText: '''${text}'''${fmt}`;
    }
    try {
      const res = await fetch(GEMINI_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: slangOn ? 1.0 : 0.2, maxOutputTokens: 2048 } }) });
      const data = await res.json();
      const full = (data?.candidates?.[0]?.content?.parts?.[0]?.text || text).trim();
      const parts = full.split("|||");
      const translated = parts[0].trim();
      if (parts.length > 1 && parts[1].trim()) {
        const t = getTheme(lang);
        let h = parts[1].trim().replace(/\*\*(.*?)\*\*/g, "$1");
        h = h.replace(/^(.*?)\s*-/gm, `<b style="color:${t.tag};font-weight:700">$1</b> -`);
        h = h.replace(/\n/g, "<br>");
        setDictHTML(h);
      }
      setIsTranslating(false);
      return translated || text;
    } catch {
      setIsTranslating(false);
      return text;
    }
  }, []);

  const processFinalChunk = useCallback(async (chunk) => {
    const text = chunk.trim();
    if (!text) return;
    hebrewRef.current += text + " ";
    setInputText(hebrewRef.current);
    const tr = await doTranslate(text, outputLang, mode, location, slangLevel);
    displayRef.current += (displayRef.current ? " " : "") + tr;
    setOutputText(displayRef.current);
  }, [doTranslate, outputLang, mode, location, slangLevel]);

  const handleOutput = async (val) => {
    setOutputLang(val);
    if (hebrewRef.current.trim()) {
      const tr = await doTranslate(hebrewRef.current, val, mode, location, slangLevel);
      displayRef.current = tr;
      setOutputText(tr);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      showToast("No text to translate");
      return;
    }
    hebrewRef.current = inputText;
    const tr = await doTranslate(inputText, outputLang, mode, location, slangLevel);
    displayRef.current = tr;
    setOutputText(tr);
  };

  const { isRecording, isListening, interim, statusText, start: startRec, stop: stopRec } = useSpeechRecognition({
    inputLang,
    onFinalTranscript: processFinalChunk,
  });

  const copy = () => {
    const t = (displayRef.current || hebrewRef.current).trim();
    if (!t) { showToast("Nothing to copy"); return; }
    navigator.clipboard.writeText(t).then(() => showToast("Copied ✓"));
  };

  const clear = () => {
    hebrewRef.current = ""; displayRef.current = "";
    setInputText(""); setOutputText(""); setDictHTML("");
  };

  const T = theme;

  return (
    <div dir={isHebrewTheme ? "rtl" : "ltr"} style={{ minHeight:"100vh", position:"relative", fontFamily:"'Syne','Segoe UI',system-ui,sans-serif" }}>
      <div style={{ position:"fixed", inset:0, zIndex:0, backgroundImage:`url(${backgroundImage})`, backgroundPosition:"center", backgroundSize:"cover", opacity: imgReady ? 1 : 0, transition:"opacity 0.8s ease", filter:"brightness(0.22) saturate(1.15)" }} />
      <div style={{ position:"fixed", inset:0, zIndex:1, background:`radial-gradient(ellipse 120% 55% at 50% -10%, ${T.primary}28 0%, transparent 65%), linear-gradient(180deg, ${T.primary}14 0%, rgba(0,0,0,0.6) 100%)`, transition:"background 0.7s ease" }} />
      <div style={{ position:"relative", zIndex:2, padding:"20px 16px 52px", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:"100%", maxWidth:620, display:"flex", flexDirection:"column", gap:11 }}>
          <div style={{ textAlign:"center", padding:"10px 0 4px" }}>
            <div style={{ fontFamily:"monospace", fontSize:11, letterSpacing:"0.22em", color:T.primary, textTransform:"uppercase", opacity:0.95, transition:"color 0.6s", marginBottom:5 }}>
              {T.flag} {T.name}
            </div>
            <h1 style={{ fontSize:"clamp(1.5rem, 4vw, 2rem)", fontWeight:800, color:"#fff", margin:0, letterSpacing:"-0.02em", lineHeight:1.2 }}>
              Global Slang Translator
            </h1>
            <div style={{ fontFamily:"monospace", fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:4, letterSpacing:"0.12em" }}>POWERED BY GEMINI AI</div>
          </div>

          <GlassCard T={T}>
            <Label>Language</Label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:10 }}>
              {[["Input", inputLang, setInputLang, INPUT_LANGS.map(([v,l]) => <option key={v} value={v}>{l}</option>)],
                ["Output", outputLang, handleOutput,
                  [<optgroup key="p" label="💎 Premium Slangs">{PREMIUM.map(s => <option key={s} value={s}>{s}</option>)}</optgroup>,
                   <optgroup key="s" label="🌍 Standard Languages">{["English (Standard)","Hebrew (Standard)","Spanish","French","German","Italian","Russian","Portuguese","Japanese"].map(s => <option key={s} value={s}>{s.replace(" (Standard)","")}</option>)}</optgroup>]
                ]].map(([lbl, val, onChange, opts]) => (
                <div key={lbl}>
                  <div style={{ fontFamily:"monospace", fontSize:10, color:"rgba(255,255,255,0.38)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:5 }}>{lbl}</div>
                  <select value={val} onChange={e => onChange(e.target.value)} style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:`1px solid ${T.border}`, borderRadius:10, color:"#fff", padding:"9px 32px 9px 11px", fontFamily:"inherit", fontSize:"0.82rem", fontWeight:600, outline:"none", cursor:"pointer", appearance:"none", WebkitAppearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 5 5-5' stroke='rgba(255,255,255,0.38)' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", transition:"border-color 0.4s" }}>
                    {opts}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ height:2, flex:1, background:`linear-gradient(90deg, ${T.primary}, ${T.secondary||T.primary}55, transparent)`, borderRadius:2, transition:"background 0.6s" }} />
              <span style={{ fontFamily:"monospace", fontSize:10, color:T.tag, letterSpacing:"0.12em", transition:"color 0.6s" }}>{T.flag} {T.name.toUpperCase()}</span>
            </div>
          </GlassCard>

          {showToggle && (
            <GlassCard T={T}>
              <Label>Style</Label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[["standard","📖 Formal"],["slang","🛣️ Street Slang"]].map(([m,lbl]) => (
                  <button key={m} onClick={() => setMode(m)} style={{ padding:"9px 12px", borderRadius:10, border:`1.5px solid ${mode===m ? T.primary : "rgba(255,255,255,0.1)"}`, background: mode===m ? `${T.primary}20` : "rgba(255,255,255,0.04)", color: mode===m ? "#fff" : "rgba(255,255,255,0.42)", fontFamily:"inherit", fontSize:"0.8rem", fontWeight:700, cursor:"pointer", transition:"all 0.25s" }}>
                    {lbl}
                  </button>
                ))}
              </div>
              {showLocation && (
                <input placeholder="📍 Location / dialect (e.g. Tel Aviv, Cairo, Brooklyn)" value={location} onChange={e => setLocation(e.target.value)} style={{ marginTop:10, width:"100%", background:"rgba(255,255,255,0.06)", border:`1px solid ${T.border}`, borderRadius:10, color:"#fff", padding:"9px 12px", fontFamily:"inherit", fontSize:"0.82rem", outline:"none" }} />
              )}
            </GlassCard>
          )}

          {showSlider && (
            <GlassCard T={T}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ fontFamily:"monospace", fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:"0.18em", textTransform:"uppercase" }}>Slang Intensity</span>
                <span style={{ fontFamily:"monospace", fontSize:12, color:T.tag, fontWeight:700, transition:"color 0.5s" }}>{SLIDER_LABELS[slangLevel]}</span>
              </div>
              <input type="range" min="1" max="3" step="1" value={slangLevel} onChange={e => setSlangLevel(Number(e.target.value))} style={{ width:"100%", height:4, borderRadius:999, appearance:"none", WebkitAppearance:"none", outline:"none", cursor:"pointer", background:`linear-gradient(to right, ${T.slider} 0%, ${T.slider} ${sliderPct}%, rgba(255,255,255,0.1) ${sliderPct}%)`, transition:"background 0.4s" }} />
              <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${T.slider};cursor:pointer;box-shadow:0 0 8px ${T.slider}77;transition:background 0.4s} input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:${T.slider};cursor:pointer;border:none}`}</style>
            </GlassCard>
          )}

          <GlassCard T={T}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, paddingBottom:14 }}>
              <div style={{ position:"relative" }}>
                {isRecording && <div style={{ position:"absolute", inset:-10, borderRadius:"50%", border:`2px solid ${T.primary}`, animation:"pulseRing 1.3s ease-out infinite", opacity:0.8 }} />}
                <button onClick={isRecording ? () => stopRec(true) : startRec} style={{ width:84, height:84, borderRadius:"50%", border:`2px solid ${isRecording ? T.primary : "rgba(255,255,255,0.14)"}`, background: isRecording ? `radial-gradient(circle, ${T.primary}30, ${T.primary}0c)` : "rgba(255,255,255,0.05)", fontSize:"2rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s ease", boxShadow: isRecording ? `0 0 28px ${T.primary}55` : "none" }}>
                  {isRecording ? "⏹️" : "🎤"}
                </button>
              </div>
              <span style={{ fontFamily:"monospace", fontSize:11, letterSpacing:"0.22em", color: isRecording ? T.tag : "rgba(255,255,255,0.38)", textTransform:"uppercase", transition:"color 0.3s" }}>{isRecording ? "TAP TO STOP" : "TAP TO SPEAK"}</span>
              {interim && <div style={{ fontSize:"0.77rem", color:"rgba(255,255,255,0.48)", fontStyle:"italic", textAlign:"center" }}>{interim}</div>}
            </div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:14 }}>
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Or paste / type text here..." rows={4} style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, color:"#fff", padding:"10px 12px", fontFamily:"inherit", fontSize:"0.85rem", resize:"vertical", outline:"none", lineHeight:1.55 }} />
              <button onClick={handleTranslate} style={{ width:"100%", marginTop:8, padding:"11px", borderRadius:10, border:"none", background:T.btn, color:"#fff", fontFamily:"inherit", fontSize:"0.85rem", fontWeight:700, cursor:"pointer", letterSpacing:"0.04em", transition:"opacity 0.2s, transform 0.15s", boxShadow:`0 4px 18px ${T.primary}44` }}>
                Translate →
              </button>
            </div>
          </GlassCard>

          <GlassCard T={T}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:T.primary, boxShadow:`0 0 6px ${T.primary}`, transition:"background 0.5s" }} />
                <span style={{ fontSize:"0.78rem", fontWeight:700, color:T.tag, letterSpacing:"0.05em", transition:"color 0.5s" }}>{outputLang.replace(" (Standard)","")}</span>
              </div>
              {isTranslating && (
                <div style={{ display:"flex", alignItems:"center", gap:6, fontFamily:"monospace", fontSize:10, color:T.tag, letterSpacing:"0.1em" }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", border:`2px solid ${T.primary}44`, borderTopColor:T.primary, animation:"spin 0.75s linear infinite" }} />
                  TRANSLATING
                </div>
              )}
            </div>
            <div style={{ fontSize:"0.92rem", lineHeight:1.68, color: outputText ? "#fff" : "rgba(255,255,255,0.28)", fontStyle: outputText ? "normal" : "italic", minHeight:58, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
              {outputText || "Your translation will appear here..."}
            </div>
          </GlassCard>

          {dictHTML && (
            <div style={{ background:`${T.primary}14`, border:`1px solid ${T.border}`, borderRadius:14, padding:14, transition:"all 0.5s" }}>
              <div style={{ fontFamily:"monospace", fontSize:10, fontWeight:700, color:T.tag, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:8, transition:"color 0.5s" }}>📚 Slang Dictionary</div>
              <div style={{ fontSize:"0.87rem", lineHeight:1.72, color:"rgba(255,255,255,0.85)" }} dangerouslySetInnerHTML={{ __html:dictHTML }} />
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <button onClick={copy} style={{ padding:"11px", borderRadius:10, border:"none", background:T.btn, color:"#fff", fontFamily:"inherit", fontSize:"0.82rem", fontWeight:700, cursor:"pointer", transition:"opacity 0.2s" }}>📋 Copy Result</button>
            <button onClick={clear} style={{ padding:"11px", borderRadius:10, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.55)", fontFamily:"inherit", fontSize:"0.82rem", fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>🗑️ Clear All</button>
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, paddingBottom:4 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background: isListening ? T.primary : "rgba(255,255,255,0.2)", boxShadow: isListening ? `0 0 8px ${T.primary}` : "none", animation: isListening ? "blink 1s ease-in-out infinite" : "none", transition:"background 0.3s" }} />
            <span style={{ fontFamily:"monospace", fontSize:10, color:"rgba(255,255,255,0.32)", letterSpacing:"0.1em" }}>{statusText}</span>
          </div>
        </div>
      </div>

      <div style={{ position:"fixed", bottom:18, left:"50%", transform:`translateX(-50%) translateY(${toast.show?0:8}px)`, background:"rgba(8,8,20,0.95)", border:`1px solid ${T.border}`, color:"#fff", padding:"8px 20px", borderRadius:20, fontFamily:"monospace", fontSize:12, opacity:toast.show?1:0, pointerEvents:"none", transition:"all 0.25s", zIndex:200, backdropFilter:"blur(12px)", letterSpacing:"0.05em" }}>{toast.msg}</div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        @keyframes pulseRing{0%{transform:scale(0.88);opacity:0.9}100%{transform:scale(1.45);opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.12}}
        select option,optgroup{background:#10101e!important;color:#fff!important}
        textarea::placeholder,input::placeholder{color:rgba(255,255,255,0.24)!important}
        button:hover{opacity:0.88}
      `}</style>
    </div>
  );
}

function GlassCard({ children, T }) {
  return (
    <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:16, backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)", transition:"background 0.6s ease, border-color 0.6s ease", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, borderRadius:18, background:`linear-gradient(135deg, ${T.primary}07 0%, transparent 55%)`, pointerEvents:"none", transition:"background 0.6s" }} />
      <div style={{ position:"relative" }}>{children}</div>
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontFamily:"monospace", fontSize:10, letterSpacing:"0.2em", color:"rgba(255,255,255,0.32)", textTransform:"uppercase", marginBottom:10 }}>{children}</div>;
}
