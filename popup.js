const startRecording = () => {
  chrome.runtime.sendMessage({ name: 'startRecording' });
};

const takeScreenshot = () => {
  chrome.tabs.captureVisibleTab(null, {}, (image) => {
    chrome.tabs.create({ url: image });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startRecordingButton').addEventListener('click', startRecording);
  document.getElementById('takeScreenshotButton').addEventListener('click', takeScreenshot);
});
