const scanHitArea = document.getElementById('scanHitArea');
const overlay = document.getElementById('cameraOverlay');
const video = document.getElementById('cameraView');
const closeButton = document.getElementById('closeCamera');
const message = document.getElementById('cameraMessage');

let activeStream = null;

function lockViewport() {
  window.scrollTo(0, 0);
}

window.addEventListener('scroll', lockViewport, { passive: false });
window.addEventListener('resize', lockViewport);
document.addEventListener('touchmove', event => event.preventDefault(), { passive: false });

document.addEventListener('gesturestart', event => event.preventDefault());
document.addEventListener('gesturechange', event => event.preventDefault());
document.addEventListener('gestureend', event => event.preventDefault());

async function openCamera() {
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  message.textContent = 'Tap Allow to open camera';

  try {
    activeStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });

    video.srcObject = activeStream;
    await video.play();
    overlay.classList.add('live');
  } catch (error) {
    overlay.classList.remove('live');
    message.textContent = 'Camera permission is needed';
  }
}

function closeCamera() {
  if (activeStream) {
    activeStream.getTracks().forEach(track => track.stop());
    activeStream = null;
  }

  video.pause();
  video.srcObject = null;
  overlay.classList.remove('open', 'live');
  overlay.setAttribute('aria-hidden', 'true');
  lockViewport();
}

scanHitArea.addEventListener('click', openCamera);
scanHitArea.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') openCamera();
});
closeButton.addEventListener('click', event => {
  event.stopPropagation();
  closeCamera();
});
