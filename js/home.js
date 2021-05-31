// window.onload = function () {
const canvas = document.querySelector("#canvas1");
const c = canvas.getContext("2d");

// cursor
const mouse = {
	x: 0,
	y: 0,
	dx: 0,
	dy: 0,
	r: 40,
};

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("mousemove", (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;

	// let custom = document.getElementById("custom-cursor");
	// if (sizes.width > 800) {
	// 	gsap.to(custom, {
	// 		top: e.y - 40,
	// 		left: e.x - 40,
	// 	});
	// }
});

canvas.width = sizes.width;
canvas.height = sizes.height * 5;

// let W = canvas.width;
// let H = canvas.height;

// sizes
window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	canvas.width = sizes.width;
	canvas.height = sizes.height * 5;

	drawFixedBalls();
});

class FixedBalls {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.dx = 0;
		this.dy = 0;
	}

	angleFromCenter(cx, cy, mx, my) {
		const mAngle = Math.atan2(mx - cx, -my + cy);
		return mAngle > 0 ? mAngle : Math.PI * 2 + mAngle;
	}

	circlePath(mx, my) {
		let cx = this.x;
		let cy = this.y;
		let r = this.r;
		const dist = Math.hypot(mx - cx, my - cy);
		let path = "";
		if (dist > r && dist < 3 * r) {
			const angle = this.angleFromCenter(cx, cy, mx, my);
			const delta = Math.acos(r / dist);

			const p0x = cx + r * Math.sin(angle - delta);
			const p0y = cy - r * Math.cos(angle - delta);
			const p2x = cx + r * Math.sin(angle + delta);
			const p2y = cy - r * Math.cos(angle + delta);
			const anchorR = dist > r * 2 ? r * 4 - dist : dist;
			const p1x = cx + anchorR * Math.sin(angle);
			const p1y = cy - anchorR * Math.cos(angle);
			path = `M ${p0x},${p0y} Q ${p1x},${p1y} ${p2x},${p2y}`;
		}
		return (
			path +
			`M ${cx},${cy - r} A ${r},${r} 1 1 1 ${cx},${
				cy + r
			} A ${r},${r} 1 1 1 ${cx},${cy - r} Z`
		);
	}
}

let balls = [];
let fixedBalls = [];

let grav = [0, -0.1];
let gravity = 0.1;
let friction = 0.7;

class Ball {
	constructor(x, y, dx, dy, r) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.r = r;
		this.color = "white";
		this.id = Math.random();
		this.touched = 0;
	}

	draw() {
		c.fillStyle = this.color;
		c.beginPath();
		c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		c.fill();
	}

	kill() {
		balls = balls.filter((item) => item.id != this.id);
	}

	update() {
		let Yscroll =
			document.documentElement.scrollTop || document.body.scrollTop;
		let finalY = Math.min(Yscroll + sizes.height, canvas.height);
		if (this.y + this.r + this.dy >= finalY) {
			this.dy = -this.dy * friction;
			this.touched += 1;

			if (this.touched > 4) {
				gsap.to(this, { duration: 0.2, r: 0 });
				if (this.r <= 9) {
					this.kill();
				}
			}
		} else {
			this.dy += gravity;
		}

		if (
			this.x >= sizes.width * 0.75 &&
			this.y + this.r >= fixedBalls[4].y - fixedBalls[4].r &&
			this.y + this.r <= fixedBalls[4].y
		) {
			this.dy = -this.dy;
		}

		if (
			this.x <= sizes.width * 0.25 &&
			this.y + this.r >= fixedBalls[5].y - fixedBalls[5].r &&
			this.y + this.r <= fixedBalls[5].y
		) {
			this.dy = -this.dy;
		}

		if (
			this.x >= sizes.width * 0.75 &&
			this.y + this.r >= fixedBalls[6].y - fixedBalls[6].r &&
			this.y + this.r <= fixedBalls[6].y
		) {
			this.dy = -this.dy;
		}

		if (
			this.x <= sizes.width * 0.25 &&
			this.y + this.r >= fixedBalls[7].y - fixedBalls[7].r &&
			this.y + this.r <= fixedBalls[7].y
		) {
			this.dy = -this.dy;
		}

		if (this.x + this.r + this.dx >= canvas.width || this.x - this.r <= 0) {
			this.dx = -this.dx;
		}

		this.x += this.dx;
		this.y += this.dy;
		this.dx += grav[0];
		// this.dy -= grav[1];

		this.draw();
	}
}

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

function drawFixedBalls() {
	c.fillStyle = "fff";
	let circle1 = new FixedBalls(
		sizes.width * 0.78,
		sizes.height * 0.1,
		sizes.width * 0.09
	);
	if (sizes.width < 500) {
		circle1.x = sizes.width * 0.7;
		circle1.y = sizes.height * 0.75;
		circle1.r = sizes.width * 0.16;
	}
	const path1 = circle1.circlePath(mouse.x, mouse.y);

	let circle2 = new FixedBalls(
		sizes.width * 0.9,
		sizes.height * 0.45,
		sizes.width * 0.06
	);
	if (sizes.width < 900) {
		circle2.y = sizes.height * 0.35;
	}
	if (sizes.width < 500) {
		circle2.x = sizes.width * 1;
		circle2.y = sizes.height * 0.18;
		circle2.r = sizes.width * 0.2;
	}
	const path2 = circle2.circlePath(mouse.x, mouse.y);

	let circle3 = new FixedBalls(
		sizes.width * 0.2,
		sizes.height * 0.3,
		sizes.width * 0.09
	);
	if (sizes.width < 900) {
		circle3.y = sizes.height * 0.2;
	}
	const path3 = circle3.circlePath(mouse.x, mouse.y);
	let circle4 = new FixedBalls(
		sizes.width * 0.04,
		sizes.height * 0.8,
		sizes.width * 0.05
	);
	if (sizes.width < 500) {
		circle4.x = sizes.width * 0.04;
		circle4.y = sizes.height * 0.8;
		circle4.r = sizes.width * 0.12;
	}
	const path4 = circle4.circlePath(mouse.x, mouse.y);
	const p1 = new Path2D(path1);
	c.fill(p1);
	const p2 = new Path2D(path2);
	c.fill(p2);
	const p3 = new Path2D(path3);
	c.fill(p3);
	const p4 = new Path2D(path4);
	c.fill(p4);

	let radius = 0;
	if (sizes.height <= sizes.width) {
		radius = sizes.height * 0.5;
	} else {
		radius = sizes.width * 0.5;
	}
	let circle5 = new FixedBalls(
		sizes.width * 0.77,
		sizes.height * 1.51,
		radius
	);
	const path5 = circle5.circlePath(0, 0);
	const p5 = new Path2D(path5);
	c.fill(p5);

	let circle6 = new FixedBalls(
		sizes.width * 0.23,
		sizes.height * 2.5,
		radius
	);
	const path6 = circle6.circlePath(0, 0);
	const p6 = new Path2D(path6);
	c.fill(p6);

	let circle7 = new FixedBalls(
		sizes.width * 0.77,
		sizes.height * 3.51,
		radius
	);
	const path7 = circle7.circlePath(0, 0);
	const p7 = new Path2D(path7);
	c.fill(p7);

	let circle8 = new FixedBalls(
		sizes.width * 0.23,
		sizes.height * 4.5,
		radius
	);
	const path8 = circle8.circlePath(0, 0);
	const p8 = new Path2D(path8);
	c.fill(p8);

	if (fixedBalls.length == 0) {
		fixedBalls.push(circle1);
		fixedBalls.push(circle2);
		fixedBalls.push(circle3);
		fixedBalls.push(circle4);
		fixedBalls.push(circle5);
		fixedBalls.push(circle6);
		fixedBalls.push(circle7);
		fixedBalls.push(circle8);
	} else if (fixedBalls[0].x != circle1.x) {
		fixedBalls = [];
		fixedBalls.push(circle1);
		fixedBalls.push(circle2);
		fixedBalls.push(circle3);
		fixedBalls.push(circle4);
		fixedBalls.push(circle5);
		fixedBalls.push(circle6);
		fixedBalls.push(circle7);
		fixedBalls.push(circle8);
	}
}

function generateMore() {
	setInterval(() => {
		let Yscroll =
			document.documentElement.scrollTop || document.body.scrollTop;
		if (!document.hidden && balls.length < 10) {
			let numberOfBalls = randomIntFromRange(3, 5 - balls.length);
			for (let i = 0; i < numberOfBalls; i++) {
				let radius = randomIntFromRange(10, 30);
				let x = randomIntFromRange(radius, sizes.width);
				let y = Yscroll - radius;
				let dx = randomIntFromRange(-0.5, 0.5);
				let dy = randomIntFromRange(-0.5, 0.5);
				balls.push(new Ball(x, y, dx, dy, radius));
			}
		}
	}, 3000);
}

function init() {
	let numberOfBalls = randomIntFromRange(3, 6);
	for (let i = 0; i < numberOfBalls; i++) {
		let radius = randomIntFromRange(10, 30);
		let x = randomIntFromRange(radius, sizes.width);
		let y = -radius;
		let dx = randomIntFromRange(-0.5, 0.5);
		let dy = randomIntFromRange(-0.5, 0.5);
		balls.push(new Ball(x, y, dx, dy, radius));
	}
	generateMore();
}

function checkCollision(ballA, ballB) {
	let rSum = ballA.r + ballB.r;
	let dx = ballB.x - ballA.x;
	let dy = ballB.y - ballA.y;

	return [
		rSum * rSum > dx * dx + dy * dy,
		rSum - Math.sqrt(dx * dx + dy * dy),
	];
}

function resolveCollision(ballA, ballB) {
	let relVel = [ballB.dx - ballA.dx, ballB.dy - ballA.dy];
	let norm = [ballB.x - ballA.x, ballB.y - ballA.y];
	let mag = Math.sqrt(norm[0] * norm[0] + norm[1] * norm[1]);
	norm = [norm[0] / mag, norm[1] / mag];

	let velAlongNorm = relVel[0] * norm[0] + relVel[1] * norm[1];
	if (velAlongNorm > 0) return;

	let bounce = 0.7;
	let j = -(1 + bounce) * velAlongNorm;
	j /= 1 / ballA.r + 1 / ballB.r;

	let impulse = [j * norm[0], j * norm[1]];
	ballA.dx -= (1 / ballA.r) * impulse[0];
	ballA.dy -= (1 / ballA.r) * impulse[1];
}

function adjustPositions(ballA, ballB, depth) {
	//Inefficient implementation for now
	const percent = 0.2;
	const slop = 0.01;
	let correction =
		(Math.max(depth - slop, 0) / (1 / ballA.r + 1 / ballB.r)) * percent;

	let norm = [ballB.x - ballA.x, ballB.y - ballA.y];
	let mag = Math.sqrt(norm[0] * norm[0] + norm[1] * norm[1]);
	norm = [norm[0] / mag, norm[1] / mag];
	correction = [correction * norm[0], correction * norm[1]];
	ballA.x -= (1 / ballA.r) * correction[0];
	ballA.y -= (1 / ballA.r) * correction[1];
}

function animate() {
	c.fillStyle = "#23689b";
	c.fillRect(0, 0, sizes.width, sizes.height * 5);
	drawFixedBalls();
	for (let ball of balls) {
		ball.update();
		for (let ball2 of balls) {
			//Not the most efficient way to check every pair, but this is just a rough version
			if (ball !== ball2) {
				let collision = checkCollision(ball, ball2);
				if (collision[0]) {
					adjustPositions(ball, ball2, collision[1]);
					resolveCollision(ball, ball2);
				}
			}
		}
		fixedBalls.forEach((fixedball) => {
			let collision = checkCollision(ball, fixedball);
			if (collision[0]) {
				adjustPositions(ball, fixedball, collision[1]);
				resolveCollision(ball, fixedball);
			}
		});
	}
	requestAnimationFrame(animate);
}

drawFixedBalls();
init();
animate();

// page animation
let projects = document.getElementsByClassName("view-project");
let div = document.getElementById("div-animate");
let i = 0;

for (let i = 0; i < projects.length; i++) {
	projects[i].addEventListener("click", (e) => {
		console.log("yes");
		div.style.display = "flex";
		div.classList.add("anim");
	});
}

function similarity(s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (
		(longerLength - editDistance(longer, shorter)) /
		parseFloat(longerLength)
	);
}

function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0) costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
						newValue =
							Math.min(Math.min(newValue, lastValue), costs[j]) +
							1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0) costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}

// handling messages
let questions = [
	"hi",
	"hey",
	"hello",
	"how are you",
	"how are things",
	"what is going on",
	"what is up",
	"bye",
	"good bye",
	"goodbye",
	"what is your name",
	"your name",
	"tell me about yourself",
	"give me your description",
	"your description",
	"what are you made up of",
	"technologies",
	"your friends",
	"friends",
	"birthday",
	"date of birth",
	"how old are you",
	"your age",
	"where do you live",
	"address",
	"who is your author",
	"your creator",
	"your author",
];

let answeres = [
	"hello user",
	"hello user",
	"hello user",
	"i am great",
	"i am great",
	"nothing much, just trying to be alive",
	"nothing much, just trying to be alive",
	"bye bye",
	"bye bye",
	"bye bye",
	"Anton - The Dry Runner",
	"Anton - The Dry Runner",
	"I am anton - the dry runner. I live on github and i am fast and responsive",
	"I am anton - the dry runner. I live on github and i am fast and responsive",
	"I am anton - the dry runner. I live on github and i am fast and responsive",
	"I am made up of Javascript, Nodejs and codemirror",
	"I am made up of Javascript, Nodejs and codemirror",
	"I live alone but i have good relation with Minus and Glowbadge",
	"I live alone but i have good relation with Minus and Glowbadge",
	"07 Feb 2017",
	"07 Feb 2017",
	"3 years",
	"3 years",
	"github",
	"github",
	"lovekesh",
	"lovekesh",
	"lovekesh",
];

let input = document.getElementById("message-input");
let messageList = document.getElementsByClassName("messages-list")[0];
let isInputDisabled = false;

function findTop3Suggestions(question) {
	let ind1 = 0;
	let ind2 = 0;
	let ind3 = 0;
	let a = 0;
	let b = 0;
	let c = 0;
	for (let i = 0; i < questions.length; i++) {
		let temp = similarity(question, questions[i]);
		if (temp >= ind1) {
			ind3 = ind2;
			ind2 = ind1;
			ind1 = temp;
			c = b;
			b = a;
			a = i;
		} else if (temp >= ind2) {
			ind3 = ind2;
			ind2 = temp;
			c = b;
			b = i;
		} else if (temp > ind3) {
			ind3 = temp;
			c = i;
		}
	}
	console.log(ind1, ind2, ind3);
	return [question[a], questions[b], questions[c]];
}

function giveReply(question) {
	let message = document.createElement("LI");
	message.classList.add("message-left");
	let index = -1;
	let sim = 0;
	for (let i = 0; i < questions.length; i++) {
		let temp = similarity(question, questions[i]);
		if (temp > sim) {
			sim = temp;
			index = i;
		}
	}
	if (sim >= 0.6) {
		message.innerText = answeres[index];
	} else if (sim < 0.6) {
		message.innerText = "Do you mean any of the follow?";
		messageList.append(message);
		// create suggestions
		let suggestionBox = document.createElement("DIV");
		suggestionBox.classList.add("suggestions");
		let arr = findTop3Suggestions(question);
		console.log(arr);
		let str = `<li class="message-left">
                <a class="message-link" href="">${arr[0]}</a>
            </li>
            <li class="message-left">
                <a class="message-link" href=""
                    >${arr[1]}</a
                >
            </li>
            <li class="message-left">
                <a class="message-link" href=""
                    >${arr[2]}</a
                >
            </li>`;
		console.log(
			"simirlarity for",
			question,
			"is",
			sim,
			"with",
			questions[index]
		);
		messageList.append(suggestionBox);
		suggestionBox.innerHTML = str;
		suggestionBox.scrollIntoView();
		addListenerOnMessagelinks();
		return;
	} else {
		message.innerText = "Sorry I don't understand";
	}
	console.log(
		"simirlarity for",
		question,
		"is",
		sim,
		"with",
		questions[index]
	);
	messageList.append(message);
	message.scrollIntoView();
}

function addMessageToChat() {
	if (input.value != "") {
		let message = document.createElement("LI");
		let messageText = input.value.toLowerCase().replace(/[^\w\s\d]/gi, "");
		message.classList.add("message-right");
		message.innerText = messageText;
		messageList.append(message);
		input.value = "";
		message.scrollIntoView();
		isInputDisabled = true;
		setTimeout(() => {
			giveReply(messageText);
			isInputDisabled = false;
			input.focus();
		}, 500);
	}
}
div.addEventListener("keypress", (e) => {
	if (e.key == "Enter") {
		if (!isInputDisabled) {
			addMessageToChat();
		}
	}
});

document.getElementById("send-message-btn").addEventListener("click", () => {
	if (!isInputDisabled) {
		addMessageToChat();
	}
});

function addListenerOnMessagelinks() {
	let messageLinks = document.getElementsByClassName("message-link");
	for (let i = 0; i < messageLinks.length; i++) {
		messageLinks[i].addEventListener("click", (e) => {
			e.preventDefault();
			input.value = messageLinks[i].innerText;
			document.getElementById("send-message-btn").click();
		});
	}
}
addListenerOnMessagelinks();
