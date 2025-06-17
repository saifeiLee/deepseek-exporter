import React, { useState } from "react";

import { t } from "@extension/i18n";
import "./Popup.css";

export default function Popup() {
  const [statusText, setStatusText] = useState("");
  const handleExportBtnClick = async () => {
    setStatusText(t("exporting"));
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab.id) {
      const result = await chrome.tabs.sendMessage(tab.id, {
        action: "exportConversation",
      });
      if (result.success) {
        setStatusText(t("success"));
      } else {
        setStatusText(t("error"));
      }
    }
  };
  return (
    <div className="container">
      <h1 id="title">{t("popupTitle")}</h1>
      <p id="description">{t("popupDescription")}</p>
      <button id="exportBtn" onClick={handleExportBtnClick}>
        {t("exportButton")}
      </button>
      <div id="status">{statusText}</div>
    </div>
  );
}
