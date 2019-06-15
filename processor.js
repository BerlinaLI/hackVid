// sample code：
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas

let processor = {
    timerCallback: function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      let self = this;
      setTimeout(function () {
          self.timerCallback();
        }, 0);
    },

    timerCallbackDelayed: function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrameDelayed();

      let self = this;
      setTimeout(function () {
        self.timerCallbackDelayed();
      }, 1000);
    },

    doLoad: function() {
      this.video = document.getElementById("video");
      this.c1 = document.getElementById("c1");
      this.ctx1 = this.c1.getContext("2d");
      this.c2 = document.getElementById("c2");
      this.ctx2 = this.c2.getContext("2d");
      this.c3 = document.getElementById("c3");
      this.ctx3 = this.c3.getContext("2d");
      let self = this;

      navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(function(stream) {
        this.video.srcObject = stream;
        this.video.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });

      this.video.addEventListener("canplay", function() {
          self.width = self.video.videoWidth;
          self.height = self.video.videoHeight;
          self.timerCallback();
          setInterval(function(){
            self.timerCallbackDelayed();
          }, 1500);
        }, false);
    },

    computeFrame: function() {
      this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
      let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
      let l = frame.data.length / 4;

      for (let i = 0; i < l; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        // 89 87 89
        // if (g > 100 && r > 100 && b < 43)
        if (g < 100 && r < 100 && b < 100) {
          frame.data[i * 4 + 3] = 0;
        }
      }
      this.ctx2.putImageData(frame, 0, 0);
      return;
    },

    computeFrameDelayed: function() {
      this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
      let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
      let l = frame.data.length / 4;

      for (let i = 0; i < l; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        // 89 87 89
        // if (g > 100 && r > 100 && b < 43)
        if (g < 100 && r < 100 && b < 100) {
          frame.data[i * 4 + 3] = 0;
        }
      }
      // setTimeout(function () {
      //   this.ctx3.putImageData(frame, 0, 0);
      // }, 3000);
      this.ctx3.putImageData(frame, 0, 0);
      return;
    }
  };

document.addEventListener("DOMContentLoaded", () => {
  processor.doLoad();
});
