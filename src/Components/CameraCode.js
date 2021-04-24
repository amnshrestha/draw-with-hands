import React from 'react'

import MainScript from './MainScript'
import blackDot from '../assets/images/blackDot.png'

export default function CameraCode() {
    return (
    <div className="videoPlaces">
        <canvas className="output_canvas" width="1280px" height="720px"></canvas>
        <div>
            <video className="input_video" width="100%"></video>

            <select aria-label="Utensil" id="utensilSelect">
                <option value="brush" selected >Brush</option>
                <option value="eraser" >Eraser</option>
                <option value="line">Line</option>
            </select>
            <select aria-label="Brush Size" id="brushSizeSelect">
                <option value="10">10</option>
                <option value="15" selected>15</option>
                <option value="20">20</option>
            </select>
            <select aria-label="Color" id="colorSelect">
                <option value="#C14D34">Red</option>
                <option value="#000000" selected>Black</option>
                <option value="#3867C5">Blue</option>
                <option value="#60AC49">Green</option>
            </select>
            <button type="button" className="btn btn-danger" id="clearScreen">Clear Screen</button>

            
        </div>
    </div> 
  
    )
}
