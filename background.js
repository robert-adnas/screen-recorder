const createRecordingScreenTab = async (currentTab) => {
  try {
    const tab = await chrome.tabs.create({
      url: chrome.runtime.getURL('recording_screen.html'),
      pinned: true,
      active: true,
    });

    return new Promise((resolve) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(tabId);
        }
      });
    });
  } catch (error) {
    console.error('Error creating recording screen tab:', error);
    throw error;
  }
};

const startRecording = async () => {
  try {
    const [currentTab] = await chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true, 'currentWindow': true });
    const recordingTabId = await createRecordingScreenTab(currentTab);

    await chrome.tabs.sendMessage(recordingTabId, {
      name: 'startRecordingOnBackground',
      body: { currentTab },
    });
  } catch (error) {
    console.error('Error during start recording:', error);
  }
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.name === 'startRecording') {
    startRecording();
  }
});