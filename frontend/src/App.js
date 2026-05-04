import { useState, useEffect } from "react";
import UploadPage from "./pages/UploadPage";
import PortfolioPage from "./pages/PortfolioPage";
import ATSPage from "./pages/ATSPage";

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

  useEffect(() => {
    const shared = decodeShareParam();
    if (shared) {
      setTemplate(shared.template || "modern");
      setPortfolioData(shared.data);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  if (atsData) {
    return (
      <ATSPage
        data={atsData}
        jobRole={atsJobRole}
        onBack={() => setAtsData(null)}
      />
    );
  }

  if (portfolioData) {
    return (
      <PortfolioPage
        data={portfolioData}
        template={template}
        onBack={() => setPortfolioData(null)}
      />
    );
  }

  return (
    <UploadPage
      onGenerated={(data, tpl) => { setTemplate(tpl); setPortfolioData(data); }}
      onATS={(data, role) => { setAtsJobRole(role); setAtsData(data); }}
    />
  );
}
