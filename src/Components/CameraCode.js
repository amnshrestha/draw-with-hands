import React from 'react'

import MainScript from './MainScript'

export default function CameraCode() {
    return (
    <div className="container">
        <canvas className="output_canvas" width="1280px" height="720px"></canvas>
        <video className="input_video"></video>
    </div>
  
    )
}
