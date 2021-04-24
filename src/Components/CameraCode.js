import React from 'react'


export default function CameraCode() {
    return (
    <div className="container">
        <canvas className="output_canvas" width="1280px" height="720px"></canvas>
        <video className="input_video" width="100%"></video>
    </div>
  
    )
}
