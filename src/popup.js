import i18n from './i18n';

document.addEventListener('DOMContentLoaded', function() {
  // Update UI with translations
  document.getElementById('title').textContent = i18n.t('popup.title');
  document.getElementById('description').textContent = i18n.t('popup.description');
  document.getElementById('exportBtn').textContent = i18n.t('popup.exportButton');
  
  const exportBtn = document.getElementById('exportBtn');
  const statusDiv = document.getElementById('status');

  exportBtn.addEventListener('click', async function() {
    try {
      statusDiv.textContent = i18n.t('popup.exporting');
      
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Execute the content script to export the conversation
      const result = await chrome.tabs.sendMessage(tab.id, { action: 'exportConversation' });
      
      if (result.success) {
        statusDiv.textContent = i18n.t('popup.success');
      } else {
        statusDiv.textContent = i18n.t('popup.error', { message: result.error });
      }
    } catch (error) {
      statusDiv.textContent = i18n.t('popup.error', { message: error.message });
      console.error('Export error:', error);
    }
  });
}); 