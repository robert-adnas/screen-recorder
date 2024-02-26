chrome.runtime.onMessage.addListener((request) => {
  if (request.name !== 'endedRecording') {
    return;
  }

  const video = document.createElement('video');
  video.src = request.body.base64;
  video.controls = true;
  video.autoplay = true;
  video.style.maxWidth = '75vw';
  video.style.maxHeight = '75vh';

  const overlay = document.createElement('div');
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backdropFilter = 'blur(5px)';
  overlay.style.zIndex = 999999;

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '20px';
  closeButton.style.right = '20px';
  closeButton.style.zIndex = 1000000;
  closeButton.style.flex = '1';
  closeButton.style.backgroundColor = "#f44336";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.padding = "8px 12px";
  closeButton.style.borderRadius = "6px";
  closeButton.style.fontSize = "14px";
  closeButton.style.cursor = "pointer";
  closeButton.style.boxShadow = "2px 3px 5px rgba(0, 0, 0, 0.1)";

  const removeOverlay = () => {
    document.body.removeChild(overlay);
  };

  closeButton.onclick = removeOverlay;

  const keydownListener = (event) => {
    if (event.key === 'Escape') {
      removeOverlay();
      document.removeEventListener('keydown', keydownListener);
    }
  };
  document.addEventListener('keydown', keydownListener);

  overlay.appendChild(video);
  overlay.appendChild(closeButton);

  document.body.appendChild(overlay);
});
