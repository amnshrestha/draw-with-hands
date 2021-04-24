$(document).ready(()=>{
    const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    var canvasCtx = canvasElement.getContext('2d');

    var radius = 15;
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
            var isDrawing = false;
            if(distance<acceptedDistance){
                startDrawing(indexFinger[0],indexFinger[1]);
                normalColor = drawingColor;
                isDrawing = true;
            }else{
              drawOn = false;
            }
            previousCanvas = canvasCtx.getImageData(0, 0, 1280, 720)
            canvasCtx.save();
            canvasCtx.fillStyle = normalColor;
            canvasCtx.beginPath();
            canvasCtx.arc(indexFinger[0],indexFinger[1],radius,0,Math.PI*2);
            if(!isDrawing)canvasCtx.stroke();
            else canvasCtx.fill();
            canvasCtx.beginPath();
            canvasCtx.arc(thumb[0],thumb[1],radius,0,Math.PI*2);
            if(!isDrawing)canvasCtx.stroke();
            else canvasCtx.fill();
            canvasCtx.restore();
        }
      }

    }

    function startDrawing(x, y){
      console.log("Drawing");
      canvasCtx.save();
      canvasCtx.beginPath();
      canvasCtx.arc(x,y,radius,0,Math.PI*2);
      canvasCtx.fill();
      canvasCtx.restore();
      if(!drawOn){
        drawOn = true;
      }else{
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
        canvasCtx.save();
        canvasCtx.beginPath();
        canvasCtx.arc(x,y,radius,0,Math.PI*2);
        canvasCtx.fill();
        canvasCtx.restore();
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

