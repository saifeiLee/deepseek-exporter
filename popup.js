document.addEventListener('DOMContentLoaded', function() {
  const exportBtn = document.getElementById('exportBtn');
  const statusDiv = document.getElementById('status');

  exportBtn.addEventListener('click', async function() {
    try {
      statusDiv.textContent = 'Exporting conversation...';
      
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Execute the content script to export the conversation
      const result = await chrome.tabs.sendMessage(tab.id, { action: 'exportConversation' });
      
      if (result.success) {
        statusDiv.textContent = 'Conversation exported successfully!';
      } else {
        statusDiv.textContent = 'Error: ' + result.error;
      }
    } catch (error) {
      statusDiv.textContent = 'Error: ' + error.message;
      console.error('Export error:', error);
    }
  });
}); 