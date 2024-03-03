import { WebcamStream } from "./webcam-stream.js";

const WEBCAM_WIDTH = 1280;
const WEBCAM_HEIGHT = 720;

export class Webcam {
  constructor() {
    this._socket = null;
    this._isConnected = false;
    this._endpointUrl = null;
    this._reconnectTimeout = null;
  }

  async getAvailableDevices() {
      await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            min: WEBCAM_WIDTH
          }
        },
        audio: false
      });
      const devices = await navigator.mediaDevices.enumerateDevices();

    return devices
      .filter(device => device.kind === "videoinput")
      .map(device => ({ id: device.deviceId, name: device.label }))
  }

  initialize(url, fps, quality) {
    this._endpointUrl = url;

    this._stream = new WebcamStream({
      width: WEBCAM_WIDTH,
      height: WEBCAM_HEIGHT,
      fps,
      quality
    });

    this._stream.onFrame = (frame) => {
      try {
        this._socket && this._socket.send(frame);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async enable(deviceId) {
    if (!this._isConnected) {
      await this._connect();
    }

    if (!this._stream._isStreaming) {
      await this._stream.start(deviceId);
    }
  }

  async disable() {
    this._stream && this._stream.stop();
    this._scoket && this._socket.close();
    this._socket = null;
  }

  resize(width, height) {
    if (this._isConnected && this._stream) {
      this._stream.resize(width, height);
    }
  }

  isStreaming() {
    return this._isConnected && !this._stream._isStreaming;
  }

  async setDevice(deviceId) {
    if (this._deviceId === deviceId) {
      return;
    }

    this._deviceId = deviceId;

    if (this._stream._isStreaming) {
      await this._stream.stop();
      await this._stream.start(deviceId);
    }
  }

  setQuality(quality) {
    if (this._stream) {
      this._stream.quality = quality;
    }
  }

  setFPS(fps) {
    if (this._stream) {
      this._stream.fps = fps;
    }
  }

  _connect() {
    return new Promise((resolve, reject) => {
      this._socket = new WebSocket(`${this._endpointUrl}/stream`);

      this._socket.addEventListener("open", () => {
        this._isConnected = true;
        resolve();
      });

      this._socket.addEventListener("error", () => {
        this._isConnected = false;
        reject();
      });

      this._socket.addEventListener("close", () => {
        this._isConnected = false;

        if (this._stream) {
          this._reconnect();
        }
      });
    });
  }

  _reconnect() {
    clearTimeout(this._reconnectTimeout);

    this._reconnectTimeout = setTimeout(async () => {
      if (this._isConnected || !this._stream) {
        return;
      }

      try {
        await this._connect();
      } catch (e) {
        this._reconnect();
      }
    }, 3000);
  }
}

const webcam = new Webcam();

window.KASM_WEBCAM = webcam;

export default webcam;
