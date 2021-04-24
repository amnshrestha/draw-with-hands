$(document).ready(()=>{
    const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    var canvasCtx = canvasElement.getContext('2d');
    console.log(canvasCtx);

    var xPrev = -1;
    var yPrev = -1;
    var drawOn = false;


    var previousCanvas = canvasCtx.getImageData(0, 0, 1280, 720);

    const acceptedDistance = 15;
    
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

            var normalColor = "#999999";
            var drawingColor = "#33cc99";
            if(distance<acceptedDistance){
                startDrawing(indexFinger[0],indexFinger[1]);
                normalColor = drawingColor;
            }else{
              drawOn = false;
            }
            previousCanvas = canvasCtx.getImageData(0, 0, 1280, 720)
            canvasCtx.save();
            canvasCtx.fillStyle = normalColor;
            canvasCtx.fillRect(indexFinger[0],indexFinger[1],15,15);
            canvasCtx.fillRect(thumb[0],thumb[1],15,15);
            canvasCtx.restore();
            // canvasCtx.putImageData(previousCanvas,0,0);
        }
      }

    }

    function startDrawing(x, y){
      console.log("Drawing");
      if(!drawOn){
        drawOn = true;
        canvasCtx.fillRect(x,y,15,15);
      }else{
        canvasCtx.fillRect(x,y,15,15);
        roundLine(x,y,xPrev,yPrev);
      }
      xPrev = x;
      yPrev = y;
      
    }

    function roundLine(startX, startY, endX, endY){
      var dx = endX - startX;
      var dy = endY - startY;
      var distance = Math.max(Math.abs(dx), Math.abs(dy));
      for(var i =0;i<distance;i++){
        var x = startX + (i+0.0)/distance * dx;
        var y = startY + (i+0.0)/distance * dy;
        canvasCtx.fillRect(x,y,15,15);
      }
    }
    
    const hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
      maxNumHands: 2,
      minDetectionConfidence: 0.9,
      minTrackingConfidence: 0.9
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

