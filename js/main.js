var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = window.innerWidth;
var height = window.innerHeight;

canvas.width = 0.97 * width ;
canvas.height = 0.97 * height;


// tf.js要用的
let m, b;

const learningRate = 0.2;
const optimizer = tf.train.sgd(learningRate);

//畫布背景(黑) 以及tf.js初始時需要的東西
function drawBackground() {
	ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect (0, 0, canvas.width, canvas.height);

	ctx.fill();
	ctx.closePath();

	// 為了要有 y = mx+ b
	m = tf.variable(tf.scalar(Math.random()));
	b = tf.variable(tf.scalar(Math.random()));
	// console.log(m);

}

function loss(pred, labels) {
	return pred.sub(labels).square().mean();
}

function predict(x) {
	const xs = tf.tensor1d(x);
	// y = mx+ b
	const ys = xs.mul(m).add(b);
	return ys;
}


drawBackground()

// canvas.addEventListener('click', function(e){console.log(e.offsetX,e.offsetY)},false)

// function map(n, start1, stop1, start2, stop2, withinBounds) {
function map(n, start1, stop1, start2, stop2) {
  // p5._validateParameters('map', arguments);
  // var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  // if (!withinBounds) {
  //   return newval;
  // }
  // if (start2 < stop2) {
  //   return this.constrain(newval, start2, stop2);
  // } else {
  //   return this.constrain(newval, stop2, start2);
  // }
  return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};

// 以下開始

let x_vals = [];
let y_vals = [];


let x_points = [];
let y_points = [];



var mouseX = -1;
var mouseY = -1;
canvas.addEventListener('click', function(e){
	mouseX = e.offsetX;
	mouseY = e.offsetY;

	let x = map(mouseX, 0, canvas.width, 0, 1);
	let y = map(mouseY, 0, canvas.height, 0, 1);
	// console.log(mouseX,mouseY,x,y);
	x_vals.push(x);
	y_vals.push(y);

	x_points.push(mouseX);
	y_points.push(mouseY);

	drawSomething()

},false)


function drawSomething() {
	ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect (mouseX, mouseY, 3, 3);
	ctx.fill();
	ctx.closePath();


}



function draw() {


	ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect (0, 0, canvas.width, canvas.height);

	ctx.fill();
	ctx.closePath();
	for (var i = x_points.length - 1; i >= 0; i--) {
		ctx.beginPath();
	    ctx.fillStyle = "rgba(255, 255, 255, 1)";
	    ctx.fillRect (x_points[i], y_points[i], 3, 3);
		ctx.fill();
		ctx.closePath();
	}




	if (x_vals.length>0) {
	const ys = tf.tensor1d(y_vals);
	optimizer.minimize(() => loss(predict(x_vals), ys));
	}



	const xs = [0, 1];
	const ys = predict(xs);
	// ys.print();

	let x1 = map(xs[0], 0, 1, 0, width);
	let x2 = map(xs[1], 0, 1, 0, width);

	let lineY = ys.dataSync();
	// console.log(lineY);
	let y1 = map(lineY[0], 0, 1, 0, height);
	let y2 = map(lineY[1], 0, 1, 0, height);

	ctx.beginPath();
    ctx.strokeStyle = "blue";
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();











}


setInterval(draw, 10)
