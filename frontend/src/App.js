import { useState, useEffect } from "react";
import UploadPage from "./pages/UploadPage";
import PortfolioPage from "./pages/PortfolioPage";
import ATSPage from "./pages/ATSPage";
import TailorPage from "./pages/TailorPage";
import JDAnalyzerPage from "./pages/JDAnalyzerPage";

function decodeShareParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const share = params.get("share");
    if (!share) return null;
    const { data, template } = JSON.parse(decodeURIComponent(atob(share)));
    return { data, template };
  } catch {
    return null;
  }
}

export default function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [template, setTemplate] = useState("modern");
  const [atsData, setAtsData] = useState(null);
  const [atsJobRole, setAtsJobRole] = useState("");
  const [tailorData, setTailorData] = useState(null);
  const [tailorJobRole, setTailorJobRole] = useState("");
  const [jdData, setJdData] = useState(null);
  const [jdJobRole, setJdJobRole] = useState("");

  useEffect(() => {
    const shared = decodeShareParam();
    if (shared) {
      setTemplate(shared.template || "modern");
      setPortfolioData(shared.data);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const reset = () => {
    setPortfolioData(null);
    setAtsData(null);
    setTailorData(null);
    setJdData(null);
  };

  if (tailorData) {
    return <TailorPage data={tailorData} jobRole={tailorJobRole} onBack={reset} />;
  }

  if (jdData) {
    return <JDAnalyzerPage data={jdData} jobRole={jdJobRole} onBack={reset} />;
  }

  if (atsData) {
    return <ATSPage data={atsData} jobRole={atsJobRole} onBack={reset} />;
  }

  if (portfolioData) {
    return (
      <PortfolioPage
        data={portfolioData}
        template={template}
        onBack={reset}
      />
    );
  }

  return (
    <UploadPage
      onGenerated={(data, tpl) => { setTemplate(tpl); setPortfolioData(data); }}
      onATS={(data, role) => { setAtsJobRole(role); setAtsData(data); }}
      onTailor={(data, role) => { setTailorJobRole(role); setTailorData(data); }}
      onJDAnalyze={(data, role) => { setJdJobRole(role); setJdData(data); }}
    />
  );
}
