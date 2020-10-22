import React, { Component } from "react";

import "./Loader.css";

export default class Loader extends Component {
  render() {
    return (
      <div className="bigDiv">
        <div className="rowLoader row1">
          <div className="circle circle1 row1"></div>
          <div className="arrowUp fade1 row2"></div>
          <div className="circle circleT1 row3"></div>
          <div className="empty row4"></div>
          <div className="arrowRight sFade4 row5"></div>
          <div className="circle circleL2 row6"></div>
          <div className="arrowUp fade4 row7"></div>
          <div className="circle circleR2 row8"></div>
        </div>
        <div className="rowLoader row2">
          <div className="arrowLeft fade2 row1"></div>
          <div className="shifter shifter1 row2"></div>
          <div className="arrowRight fade4 row3"></div>
          <div className="empty row4"></div>
          <div className="arrowRight sFade3 row5"></div>
          <div className="arrowLeft fade1 row6"></div>
          <div className="shifter shifter4 row7"></div>
          <div className="arrowRight fade3 row8"></div>
        </div>
        <div className="rowLoader row3">
          <div className="circle circleL1 row1"></div>
          <div className="arrowDown fade3 row2"></div>
          <div className="circle circleR1 row3"></div>
          <div className="empty row4"></div>
          <div className="arrowRight sFade2 row5"></div>
          <div className="circle circle2 row6"></div>
          <div className="arrowDown fade2 row7"></div>
          <div className="circle circleT2 row8"></div>
        </div>
        <div className="rowLoader row4">
          <div className="arrowUp sFade4 row1"></div>
          <div className="arrowUp sFade3 row2"></div>
          <div className="arrowUp sFade2 row3"></div>
          <div className="arrowUp middleTriUp row4"></div>
          <div className="arrowRight middleTriRight row5"></div>
          <div className="empty row6"></div>
          <div className="empty row7"></div>
          <div className="empty row8"></div>
        </div>
        <div className="rowLoader row5">
          <div className="empty row1"></div>
          <div className="empty row2"></div>
          <div className="empty row3"></div>
          <div className="arrowLeft middleTriLeft row4"></div>
          <div className="arrowDown middleTriDown row5"></div>
          <div className="arrowDown sFade2 row6"></div>
          <div className="arrowDown sFade3 row7"></div>
          <div className="arrowDown sFade4 row8"></div>
        </div>
        <div className="rowLoader row6">
          <div className="circle circle4 row1"></div>
          <div className="arrowUp fade3 row2"></div>
          <div className="circle circleT4 row3"></div>
          <div className="arrowLeft sFade2 row4"></div>
          <div className="empty row5"></div>
          <div className="circle circleL3 row6"></div>
          <div className="arrowUp fade2 row7"></div>
          <div className="circle circleR3 row8"></div>
        </div>
        <div className="rowLoader row7">
          <div className="arrowLeft fade4 row1"></div>
          <div className="shifter shifter3 row2"></div>
          <div className="arrowRight fade2 row3"></div>
          <div className="arrowLeft sFade3 row4"></div>
          <div className="empty row5"></div>
          <div className="arrowLeft fade3 row6"></div>
          <div className="shifter shifter2 row7"></div>
          <div className="arrowRight fade1 row8"></div>
        </div>
        <div className="rowLoader row8">
          <div className="circle circleL4 row1"></div>
          <div className="arrowDown fade1 row2"></div>
          <div className="circle circleR4 row3"></div>
          <div className="arrowLeft sFade4 row4"></div>
          <div className="empty row5"></div>
          <div className="circle circle3 row6"></div>
          <div className="arrowDown fade4 row7"></div>
          <div className="circle circleT3 row8"></div>
        </div>
      </div>
    );
  }
}
