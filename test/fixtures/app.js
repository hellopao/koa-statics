"use strict";

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.fillStyle = "rgb(255,0,255)";
ctx.lineTo(0,0);
ctx.moveTo(100,100);
ctx.fill();
ctx.closePath();

document.body.appendChild(canvas);