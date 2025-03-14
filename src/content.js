// Import html2canvas
import html2canvas from 'html2canvas';

// Main function to initialize the extension
function initDeepseekExporter() {
  console.log('Deepseek Exporter initialized');
  
  // Check if we're on the Deepseek chat page
  if (!window.location.href.includes('chat.deepseek.com')) {
    return;
  }
  
  // Add export button to the UI
  addExportButton();
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'exportConversation') {
      exportConversation()
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Indicates we'll respond asynchronously
    }
  });
}

// Function to add the export button to the Deepseek UI
function addExportButton() {
  // Wait for the chat interface to load
  const checkInterval = setInterval(() => {
    // Look for the main chat container
    const chatContainer = document.querySelector('.overflow-y-auto.flex-1');
    
    if (chatContainer) {
      clearInterval(checkInterval);
      
      // Create the export button
      const exportButton = document.createElement('button');
      exportButton.className = 'deepseek-export-btn';
      exportButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Export as Image
      `;
      
      // Add click event listener
      exportButton.addEventListener('click', () => {
        exportConversation();
      });
      
      // Find a suitable place to add the button
      const headerElement = document.querySelector('header');
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
    const selectors = [
      '.a5cd95be', // The selector from the original code
      '.overflow-y-auto.flex-1', // A more generic selector
      '[role="main"]', // Main content area
      '.chat-container', // Common class for chat containers
      '#chat-container', // Common ID for chat containers
      '.conversation-container', // Another common class
      'main', // Fallback to the main element
      'div[class*="conversation"]', // Any div with "conversation" in its class
      'div[class*="chat"]' // Any div with "chat" in its class
    ];
    
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
      conversationContainer = document.querySelector('main') || document.body;
      console.log('Using fallback container:', conversationContainer);
    }
    
    // Show loading indicator
    const loadingIndicator = createLoadingIndicator();
    document.body.appendChild(loadingIndicator);
    
    try {
      console.log('html2canvas:', html2canvas);
      // Capture the conversation
      const canvas = await html2canvas(conversationContainer, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        logging: true, // Enable logging for debugging
        allowTaint: true,
        scrollX: 0,
        scrollY: 0
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
    console.error('Error exporting conversation:', error);
    alert(`Error exporting conversation: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Function to create a loading indicator
function createLoadingIndicator() {
  const loadingDiv = document.createElement('div');
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '0';
  loadingDiv.style.left = '0';
  loadingDiv.style.width = '100%';
  loadingDiv.style.height = '100%';
  loadingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  loadingDiv.style.display = 'flex';
  loadingDiv.style.justifyContent = 'center';
  loadingDiv.style.alignItems = 'center';
  loadingDiv.style.zIndex = '10000';
  
  const spinner = document.createElement('div');
  spinner.style.border = '5px solid #f3f3f3';
  spinner.style.borderTop = '5px solid #3498db';
  spinner.style.borderRadius = '50%';
  spinner.style.width = '50px';
  spinner.style.height = '50px';
  spinner.style.animation = 'spin 2s linear infinite';
  
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
  
  document.head.appendChild(style);
  loadingDiv.appendChild(spinner);
  
  return loadingDiv;
}

// Function to show image preview with download option
function showImagePreview(canvas) {
  // Create container
  const container = document.createElement('div');
  container.className = 'deepseek-export-container';
  
  // Add the canvas as an image
  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');
  img.className = 'deepseek-export-preview';
  container.appendChild(img);
  
  // Add controls
  const controls = document.createElement('div');
  controls.className = 'deepseek-export-controls';
  
  // Download button
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Download';
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `deepseek-conversation-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
  controls.appendChild(downloadBtn);
  
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(container);
  });
  controls.appendChild(closeBtn);
  
  container.appendChild(controls);
  document.body.appendChild(container);
}

// Initialize the extension
initDeepseekExporter(); 