import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import PortfolioPage from "./pages/PortfolioPage";

export default function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [template, setTemplate] = useState("modern");

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
    />
  );
}
