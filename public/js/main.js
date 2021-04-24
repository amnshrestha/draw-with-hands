$(document).ready(()=>{
    const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    var canvasCtx = canvasElement.getContext('2d');
    console.log(canvasCtx);


    var previousCanvas = canvasCtx.getImageData(0, 0, 1280, 720);

    const acceptedDistance = 10;
    
    function onResults(results) {
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.putImageData(previousCanvas,0,0);
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            var indexFinger = findCoordinates(landmarks,4);
            var thumb = findCoordinates(landmarks,8);
            //distance Left Lip To Left Corner
            var distance = Math.sqrt( 
                Math.pow((indexFinger[0]-thumb[0]), 2) 
                + 
                Math.pow((indexFinger[1]-thumb[1]), 2) 
            );
            if(distance<acceptedDistance){
                startDrawing(indexFinger[0],indexFinger[1]);
            }
            previousCanvas = canvasCtx.getImageData(0, 0, 1280, 720)
            // previousCanvas = convertCanvasToImage(canvasElement);
            canvasCtx.fillRect(indexFinger[0],indexFinger[1],15,15);
            canvasCtx.fillRect(thumb[0],thumb[1],15,15);
        }
      }

    }

    function startDrawing(x, y){
      canvasCtx.fillRect(x,y,15,15);
      xPrev = x;
      yPrev = y;
      

    }
    
    const hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
      maxNumHands: 2,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8
    });
    hands.onResults(onResults);
    
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({image: videoElement});

      },
      width: 1280,
      height: 720
    });
    camera.start();


    // Written by Aman
    // Finds x,y coordinate of a landmark
    function findCoordinates(toEnumerate, idToFind){
        var width = canvasElement.width;
        var height = canvasElement.height;
        var cx = parseInt(toEnumerate[idToFind].x * width);
        var cy = parseInt(toEnumerate[idToFind].y * height);
        return [cx, cy];
    }

    
});
