export class WebcamStream {
  constructor(options) {
    this.width = options.width;
    this.height = options.height;
    this.quality = options.quality;
    this.fps = options.fps;
    this.quality = options.quality;
    
    this._videoEl = document.createElement("video");
    this._canvasEl = document.createElement("canvas");
    this._isStreaming = false;
    this._lastCaptureTime = 0;
  }

  async start(deviceId) {
    try {
      if (this._isStreaming) {
        return;
      }

      console.info(`Starting webcam "${deviceId}" stream ${this.width}x${this.height} at ${this.fps}fps`);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {
            exact: deviceId
          },
          width: {
            min: this.width,
          },
          height: {
            min: this.height,
          }
        },
        audio: false
      });

      this._videoEl.srcObject = stream;
      this._videoEl.width = this.width;
      this._videoEl.height = this.height;
      this._videoEl.play();

      this._canvasEl.width = this.width;
      this._canvasEl.height = this.height;

      this._isStreaming = true;
      this._lastCaptureTime = 0;
      this._captureNextFrame();
    } catch (e) {
      console.error(e);
    }
  }

  async stop() {
    console.info("Stopping webcam stream");

    this._videoEl.srcObject.getVideoTracks().forEach((track) => {
      if (track.readyState === "live") {
          track.stop();
      }
    });

    this._isStreaming = false;
  }

  async isStreaming() {
    return this._isStreaming;
  }

  async _captureNextFrame() {
    if (!this._isStreaming || !this.onFrame) {
      return;
    }

    const timeSinceLastFrame = performance.now() - this._lastCaptureTime;
    if (timeSinceLastFrame >= (1000 / this.fps)) {
      this._canvasEl.getContext("2d").drawImage(this._videoEl, 0, 0);
      this._canvasEl.toBlob((blob) => {
        this.onFrame && this.onFrame(blob);
        this._lastCaptureTime = performance.now();
        requestAnimationFrame(this._captureNextFrame.bind(this));
      }, "image/webp", this.quality / 10);
    } else {
      requestAnimationFrame(this._captureNextFrame.bind(this));
    }
  }
}