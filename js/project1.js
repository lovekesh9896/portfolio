let colors = [
	"#39FF71",
	"#A181FF",
	"#A5C93E",
	"#4B6FF0",
	"#FF39B0",
	"#F0CC4B",
	"#3D39FF",
];

function handleHomePageCanvas() {
	const canvas = document.querySelector("#canvas1");
	const c = canvas.getContext("2d");

	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	};

	let grd = c.createLinearGradient(0, 0, sizes.width, 0);
	grd.addColorStop(0, "#6441a5");
	grd.addColorStop(1, "#2a0845");
	c.fillStyle = grd;

	canvas.width = sizes.width;
	canvas.height = sizes.height;

	// sizes
	window.addEventListener("resize", () => {
		sizes.width = window.innerWidth;
		sizes.height = window.innerHeight;

		canvas.width = sizes.width;
		canvas.height = sizes.height;
	});

	let balls = [];

	class Ball {
		constructor(x, y, dx, dy, r, color) {
			this.x = x;
			this.y = y;
			this.r = r;
			this.dx = dx;
			this.dy = dy;
			this.color = color;
			this.id = Math.random();
		}

		draw() {
			c.fillStyle = this.color;
			c.beginPath();
			c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
			c.fill();
		}

		update() {
			if (this.y + this.r >= sizes.height || this.y - this.r <= 0) {
				this.dy = -this.dy;
			}
			if (this.x + this.r >= canvas.width || this.x - this.r <= 0) {
				this.dx = -this.dx;
			}

			this.x += this.dx;
			this.y += this.dy;

			this.draw();
		}
	}

	function randomIntFromRange(min, max) {
		return Math.random() * (max - min + 1) + min;
	}

	function generateMore() {
		setInterval(() => {
			if (!document.hidden && balls.length < 7) {
				let numberOfBalls = Math.floor(randomIntFromRange(1, 3));
				for (let i = 0; i < numberOfBalls; i++) {
					let radius = Math.floor(randomIntFromRange(10, 30));
					let x = Math.floor(randomIntFromRange(radius, sizes.width));
					let y = Yscroll - radius;
					balls.push(new Ball(x, y, dx, dy, radius));
				}
			}
		}, 4000);
	}

	function init() {
		let numberOfBalls = Math.floor(randomIntFromRange(8, 12));
		for (let i = 0; i < numberOfBalls; i++) {
			let radius = randomIntFromRange(30, 60);
			let x = Math.floor(randomIntFromRange(radius, sizes.width));
			let y = Math.floor(randomIntFromRange(radius, sizes.height));
			let dx = randomIntFromRange(-1, 1);
			let dy = randomIntFromRange(-1, 1);
			let color = colors[Math.floor(randomIntFromRange(0, 6))];
			balls.push(new Ball(x, y, dx, dy, radius, color));
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
		c.fillStyle = grd;
		c.fillRect(0, 0, sizes.width, sizes.height);

		for (let ball of balls) {
			ball.update();
			for (let ball2 of balls) {
				if (ball !== ball2) {
					let collision = checkCollision(ball, ball2);
					if (collision[0]) {
						adjustPositions(ball, ball2, collision[1]);
						resolveCollision(ball, ball2);
					}
				}
			}
		}
		requestAnimationFrame(animate);
	}

	animate();

	// setTimeout(() => {
	init();
	// document.body.style["overflow-y"] = "unset";
	// document.body.style.height = "unset";
	// }, 2000);
}

handleHomePageCanvas();
