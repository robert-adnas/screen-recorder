const convertBlobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
  });
};

const fetchBlobAsBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await convertBlobToBase64(blob);
  } catch (error) {
    console.error('Error fetching blob:', error);
    throw error;
  }
};

const handleMediaRecording = async (streamId, currentTabId) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: streamId,
        },
      },
    });

    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    mediaRecorder.onstop = async () => {
      const blobFile = new Blob(chunks, { type: "video/webm" });
      const base64 = await fetchBlobAsBase64(URL.createObjectURL(blobFile));

      chrome.tabs.sendMessage(currentTabId, {
        name: 'endedRecording',
        body: { base64 }
      });

      stream.getTracks().forEach(track => track.stop());
      window.close();
    };

    mediaRecorder.start();
  } catch (error) {
    console.error('Error during media recording:', error);
  }
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.name === 'startRecordingOnBackground') {
    chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], async (streamId) => {
      if (!streamId) return;

      const currentTabId = message.body.currentTab.id;
      await handleMediaRecording(streamId, currentTabId);

      chrome.tabs.update(currentTabId, { active: true, selected: true });
    });
  }
});
