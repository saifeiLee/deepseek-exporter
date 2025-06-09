import React, { useState } from "react";

import i18n from "@extension/i18n";
import "./Popup.css";

export default function Popup() {
  const [statusText, setStatusText] = useState("");
  const handleExportBtnClick = async () => {
    setStatusText("正在导出...");
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab.id) {
      const result = await chrome.tabs.sendMessage(tab.id, {
        action: "exportConversation",
      });
      if (result.success) {
        setStatusText("导出成功");
      } else {
        setStatusText("导出失败");
      }
    }
  };
  return (
    <div className="container">
      <h1 id="title">{i18n.t("popup.title")}</h1>
      <p id="description">Export your DeepSeek conversations as images</p>
      <button id="exportBtn" onClick={handleExportBtnClick}>
        Export Current Conversation
      </button>
      <div id="status">{statusText}</div>
    </div>
  );
}
