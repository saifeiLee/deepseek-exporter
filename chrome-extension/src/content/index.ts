import "webextension-polyfill";
import html2canvas from "html2canvas";
import i18n from "@extension/i18n";

const conversationSelector = ".dad65929";

function initializeExtension() {
  addExportButton();
}

function addExportButton() {
  // Wait for the chat interface to load
  const checkInterval = setInterval(() => {
    // Look for the main chat container
    const chatContainer = document.querySelector(conversationSelector);

    if (chatContainer) {
      clearInterval(checkInterval);

      // Create the export button
      const exportButton = document.createElement("button");
      exportButton.className = "deepseek-export-btn";
      exportButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          ${i18n.t("content.exportButton")}
        `;

      // Add click event listener
      exportButton.addEventListener("click", () => {
        exportConversation();
      });

      // Find a suitable place to add the button
      const headerElement = document.querySelector(".be88ba8a");
      if (headerElement) {
        headerElement.appendChild(exportButton);
      } else {
        // Fallback: add to the top of the chat container
        const firstChild = chatContainer.firstChild;
        chatContainer.insertBefore(exportButton, firstChild);
      }
    }
  }, 1000);
}

// Function to export the conversation as an image
async function exportConversation() {
  try {
    // Find the conversation container
    // Try different selectors that might match the conversation container
    const selectors = [conversationSelector];

    let conversationContainer = null;
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        conversationContainer = element;
        console.log(`Found conversation container with selector: ${selector}`);
        break;
      }
    }

    if (!conversationContainer) {
      // If we still can't find it, try to find the main content area
      conversationContainer = document.querySelector("main") || document.body;
      console.log("Using fallback container:", conversationContainer);
    }

    // Show loading indicator
    const loadingIndicator = createLoadingIndicator();
    document.body.appendChild(loadingIndicator);

    try {
      // Capture the conversation
      const canvas = await html2canvas(conversationContainer, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality
        useCORS: true,
        logging: true, // Enable logging for debugging
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: conversationContainer.offsetWidth,
        x: -20,
        windowWidth: conversationContainer.offsetWidth + 40,
      });

      // Remove loading indicator
      document.body.removeChild(loadingIndicator);

      // Show preview with download option
      showImagePreview(canvas);

      return { success: true };
    } catch (captureError) {
      // Remove loading indicator if there was an error
      document.body.removeChild(loadingIndicator);
      throw captureError;
    }
  } catch (error) {
    console.error("Error exporting conversation:", error);
    alert(`Error exporting conversation: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Function to create a loading indicator
function createLoadingIndicator() {
  const loadingContainer = document.createElement("div");
  loadingContainer.className = "deepseek-export-loading";
  loadingContainer.innerHTML = `
      <div class="deepseek-export-loading-spinner"></div>
      <div class="deepseek-export-loading-text">${i18n.t(
        "content.loading"
      )}</div>
    `;
  return loadingContainer;
}

function getConversationName() {
  const conversationHeaderClass = ".d8ed659a";
  const conversationHeader = document.querySelector(conversationHeaderClass);
  if (conversationHeader) {
    const conversationName = conversationHeader.textContent.trim();
    return conversationName;
  }
  return null;
}

// Function to show the image preview
function showImagePreview(canvas) {
  // Create a container for the preview
  const previewContainer = document.createElement("div");
  previewContainer.className = "deepseek-export-preview";

  // Create the preview content
  previewContainer.innerHTML = `
      <div class="deepseek-export-preview-content">
        <div class="deepseek-export-preview-header">
          <h2>DeepSeek Exporter</h2>
          <button class="deepseek-export-preview-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="deepseek-export-preview-image-container"></div>
        <div class="deepseek-export-preview-actions">
          <button class="deepseek-export-preview-download">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            ${i18n.t("content.downloadButton")}
          </button>
        </div>
      </div>
    `;

  // Add event listener to close button
  const closeButton = previewContainer.querySelector(
    ".deepseek-export-preview-close"
  );
  closeButton?.addEventListener("click", () => {
    document.body.removeChild(previewContainer);
  });
  closeButton?.setAttribute("title", i18n.t("content.closeButton"));

  // Add the canvas as an image
  const img = document.createElement("img");
  img.src = canvas.toDataURL("image/png");
  img.className = "deepseek-export-preview-image";

  previewContainer
    ?.querySelector(".deepseek-export-preview-image-container")
    ?.appendChild(img);
  let fileName = getConversationName();
  console.log("fileName", fileName);
  if (!fileName) {
    fileName = "deepseek-conversation";
  }

  // Add event listener to download button
  const downloadBtn = previewContainer.querySelector(
    ".deepseek-export-preview-download"
  );
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.download = `${fileName}-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });

    document.body.appendChild(previewContainer);
  }
}

// Initialize the extension

initializeExtension();
