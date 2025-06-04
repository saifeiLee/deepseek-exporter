import React from "react";
import i18n from "@extension/i18n";
import "./Popup.css";

export default function Popup() {
  return (
    <div className="container">
      <h1 id="title">{i18n.t("popup.title")}</h1>
      <p id="description">Export your DeepSeek conversations as images</p>
      <button id="exportBtn">Export Current Conversation</button>
      <div id="status"></div>
    </div>
  );
}
