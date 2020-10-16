import React, { Component } from "react";

import "./Loader.css";

export default class Loader extends Component {
  render() {
    return (
      <div class="bigDiv">
        <div class="row row1">
          <div class="circle circle1 1"></div>
          <div class="arrowUp fade1 2"></div>
          <div class="circle circleT1 3"></div>
          <div class="empty 4"></div>
          <div class="arrowRight sFade4 5"></div>
          <div class="circle circleL2 6"></div>
          <div class="arrowUp fade4 7"></div>
          <div class="circle circleR2 8"></div>
        </div>
        <div class="row row2">
          <div class="arrowLeft fade2 1"></div>
          <div class="shifter shifter1 2"></div>
          <div class="arrowRight fade4 3"></div>
          <div class="empty 4"></div>
          <div class="arrowRight sFade3 5"></div>
          <div class="arrowLeft fade1 6"></div>
          <div class="shifter shifter4 7"></div>
          <div class="arrowRight fade3 8"></div>
        </div>
        <div class="row row3">
          <div class="circle circleL1 1"></div>
          <div class="arrowDown fade3 2"></div>
          <div class="circle circleR1 3"></div>
          <div class="empty 4"></div>
          <div class="arrowRight sFade2 5"></div>
          <div class="circle circle2 6"></div>
          <div class="arrowDown fade2 7"></div>
          <div class="circle circleT2 8"></div>
        </div>
        <div class="row row4">
          <div class="arrowUp sFade4 1"></div>
          <div class="arrowUp sFade3 2"></div>
          <div class="arrowUp sFade2 3"></div>
          <div class="arrowUp middleTriUp 4"></div>
          <div class="arrowRight middleTriRight 5"></div>
          <div class="empty 6"></div>
          <div class="empty 7"></div>
          <div class="empty 8"></div>
        </div>
        <div class="row row5">
          <div class="empty 1"></div>
          <div class="empty 2"></div>
          <div class="empty 3"></div>
          <div class="arrowLeft middleTriLeft 4"></div>
          <div class="arrowDown middleTriDown 5"></div>
          <div class="arrowDown sFade2 6"></div>
          <div class="arrowDown sFade3 7"></div>
          <div class="arrowDown sFade4 8"></div>
        </div>
        <div class="row row6">
          <div class="circle circle4 1"></div>
          <div class="arrowUp fade3 2"></div>
          <div class="circle circleT4 3"></div>
          <div class="arrowLeft sFade2 4"></div>
          <div class="empty 5"></div>
          <div class="circle circleL3 6"></div>
          <div class="arrowUp fade2 7"></div>
          <div class="circle circleR3 8"></div>
        </div>
        <div class="row row7">
          <div class="arrowLeft fade4 1"></div>
          <div class="shifter shifter3 2"></div>
          <div class="arrowRight fade2 3"></div>
          <div class="arrowLeft sFade3 4"></div>
          <div class="empty 5"></div>
          <div class="arrowLeft fade3 6"></div>
          <div class="shifter shifter2 7"></div>
          <div class="arrowRight fade1 8"></div>
        </div>
        <div class="row row8">
          <div class="circle circleL4 1"></div>
          <div class="arrowDown fade1 2"></div>
          <div class="circle circleR4 3"></div>
          <div class="arrowLeft sFade4 4"></div>
          <div class="empty 5"></div>
          <div class="circle circle3 6"></div>
          <div class="arrowDown fade4 7"></div>
          <div class="circle circleT3 8"></div>
        </div>
      </div>
    );
  }
}
