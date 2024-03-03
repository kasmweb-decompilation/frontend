import JSMpeg from "jsmpeg-player";

let player = null;
let streamUrl = null;
let canvasEl = null;
let isAllowed = false;
let isUnlocked = false;

//
window.addEventListener("message", (e) => {
  if (typeof e.data !== "object" || !e.data.action) {
    return;
  }

  if (e.data.action === "enable_audio" && isAllowed) {
    enable();
  }
});

const initialize = (options) => {
  streamUrl = options.url;
  canvasEl = options.canvasEl;
  isAllowed = options.isAllowed;
}

const enable = () => {
  try {
    console.log(`audio.enable() | allowed: ${isAllowed}, unlocked: ${isUnlocked}`);

    if (player) {
      return;
    }

    isAllowed = true;

    player = new JSMpeg.Player(streamUrl, {
      canvas: canvasEl,
    });

    player.audioOut.unlock(() => {
      console.log("audio.enable() -> unlocked");
      isUnlocked = true;
    });
  } catch (e) {
  }
}

const disable = () => {
  console.log("audio.disable()");

  if (player) {
    player.destroy();
    player = null;
  }

  isAllowed = false;
}

export default {
  initialize,
  enable,
  disable,
}