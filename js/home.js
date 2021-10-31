window.onbeforeunload = function () {
	window.scrollTo(0, 0);
};
let colors = [
	"#39FF71",
	"#A181FF",
	"#A5C93E",
	"#4B6FF0",
	"#FF39B0",
	"#F0CC4B",
	"#3D39FF",
];
let canvasScale = 6;
function home() {
	// home page content

	function handleHomePageCanvas() {
		const canvas = document.querySelector("#canvas1");
		const canvas2 = document.querySelector("#canvas2");
		const c = canvas.getContext("2d");
		const c2 = canvas2.getContext("2d");

		const sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		let grd = c.createLinearGradient(0, 0, sizes.width, 0);
		grd.addColorStop(0, "#6441a5");
		grd.addColorStop(1, "#2a0845");
		c.fillStyle = grd;

		if (sizes.width < 1200) {
			canvasScale = 1;
		}

		canvas.width = sizes.width;
		canvas.height = sizes.height * canvasScale;

		canvas2.width = sizes.width;
		canvas2.height = sizes.height * canvasScale;

		// sizes
		window.addEventListener("resize", () => {
			sizes.width = window.innerWidth;
			sizes.height = window.innerHeight;

			canvas.width = sizes.width;
			canvas.height = sizes.height * canvasScale;

			canvas2.width = sizes.width;
			canvas2.height = sizes.height * canvasScale;

			console.log(sizes.width);
			if (sizes.width <= 1200) {
				canvasScale = 1;
				canvas2.width = sizes.width;
				canvas2.height = sizes.height * canvasScale;
			}
			drawFixedBalls();
		});

		let Yscroll = 0;
		window.onscroll = function () {
			Yscroll =
				document.documentElement.scrollTop || document.body.scrollTop;
		};

		class FixedBalls {
			constructor(x, y, r) {
				this.x = x;
				this.y = y;
				this.r = r;
				this.dx = 0;
				this.dy = 0;
				this.id = null;
				this.curr = 0;
			}

			draw() {
				if (this.curr >= this.r) {
					cancelAnimationFrame(this.id);
					return;
				}

				c2.fillStyle = "white";
				c2.beginPath();
				c2.arc(this.x, this.y, this.curr, 0, 2 * Math.PI);
				c2.fill();

				this.curr += this.r / 60;
				this.id = requestAnimationFrame(this.draw.bind(this));
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

				for (let i = 0; i < this.r * 2; i++) {
					particles.push(
						new Particle(
							this.x,
							this.y,
							Math.random() * 3,
							colors[Math.floor(randomIntFromRange(0, 7))],
							{
								x: (Math.random() - 0.5) * (Math.random() * 4),
								y: (Math.random() - 0.5) * (Math.random() * 4),
							},
						),
					);
				}

				if (balls.length == 0) {
					let numberOfBalls = randomIntFromRange(1, 3);
					for (let i = 0; i < numberOfBalls; i++) {
						let radius = randomIntFromRange(10, 30);
						let x = randomIntFromRange(radius, sizes.width);
						let y = Yscroll - radius;
						let dx = randomIntFromRange(-0.5, 0.5);
						let dy = randomIntFromRange(-0.5, 0.5);
						balls.push(new Ball(x, y, dx, dy, radius));
					}
				}
			}

			update() {
				let finalY = Math.min(Yscroll + sizes.height, canvas.height);
				if (this.y + this.r + this.dy >= finalY) {
					this.dy = -this.dy * friction;
					this.touched += 1;
				} else {
					this.dy += gravity;
				}

				if (canvasScale > 1) {
					// ball5
					if (
						this.x >= sizes.width * 0.75 &&
						this.y + this.r >= fixedBalls[4].y - fixedBalls[4].r &&
						this.y + this.r <= fixedBalls[4].y
					) {
						this.dy = -this.dy * friction;
						this.touched += 1;
					}

					// ball6
					if (
						this.x <= sizes.width * 0.25 &&
						this.y + this.r >= fixedBalls[5].y - fixedBalls[5].r &&
						this.y + this.r <= fixedBalls[5].y
					) {
						this.dy = -this.dy * friction;
						this.touched += 1;
					}

					// ball7
					if (
						this.x >= sizes.width * 0.75 &&
						this.y + this.r >= fixedBalls[6].y - fixedBalls[6].r &&
						this.y + this.r <= fixedBalls[6].y
					) {
						this.dy = -this.dy * friction;
						this.touched += 1;
					}

					// ball8
					if (
						this.x <= sizes.width * 0.25 &&
						this.y + this.r >= fixedBalls[7].y - fixedBalls[7].r &&
						this.y + this.r <= fixedBalls[7].y
					) {
						this.dy = -this.dy * friction;
						this.touched += 1;
					}

					// ball9
					if (
						this.x >= sizes.width * 0.75 &&
						this.y + this.r >= fixedBalls[8].y - fixedBalls[8].r &&
						this.y + this.r <= fixedBalls[8].y
					) {
						this.dy = -this.dy * friction;
						this.touched += 1;
					}
				}

				if (
					this.x + this.r + this.dx >= canvas.width ||
					this.x - this.r <= 0
				) {
					this.dx = -this.dx;
				}

				if (this.touched > 3) {
					gsap.to(this, { duration: 0.2, r: 0 });
					if (this.r <= 9) {
						this.kill();
					}
				}

				this.x += this.dx;
				this.y += this.dy;
				this.dx += grav[0];

				this.draw();
			}
		}

		class Particle {
			constructor(x, y, radius, color, velocity) {
				this.x = x;
				this.y = y;
				this.radius = radius;
				this.color = color;
				this.velocity = velocity;
				this.alpha = 1;
			}

			draw() {
				c.save();
				c.beginPath();
				c.globalAlpha = this.alpha;
				c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
				c.fillStyle = this.color;
				c.fill();
				c.restore();
			}

			update() {
				this.draw();
				this.velocity.x *= 0.99;
				this.velocity.y *= 0.99;
				this.x = this.x + this.velocity.x;
				this.y = this.y + this.velocity.y;
				this.alpha = this.alpha - 0.005;
			}
		}

		let particles = [];

		function randomIntFromRange(min, max) {
			return Math.random() * (max - min + 1) + min;
		}

		function drawFixedBalls() {
			c2.fillStyle = "#fff";
			let circle1 = new FixedBalls(0, 0, 0);

			let circle2 = new FixedBalls(
				sizes.width * 0.8,
				sizes.height * 0.45,
				sizes.width * 0.12,
			);
			// if (sizes.width < 900) {
			// 	circle2.y = sizes.height * 0.35;
			// }
			// if (sizes.width < 500) {
			// 	circle2.x = sizes.width * 1;
			// 	circle2.y = sizes.height * 0.18;
			// 	circle2.r = sizes.width * 0.2;
			// }

			let circle3 = new FixedBalls(
				sizes.width * 0.6,
				sizes.height * 0.8,
				sizes.width * 0.04,
			);
			// if (sizes.width < 900) {
			// 	circle3.y = sizes.height * 0.2;
			// }
			let circle4 = new FixedBalls(
				sizes.width * 0.02,
				sizes.height * 0.8,
				sizes.width * 0.05,
			);
			// if (sizes.width < 500) {
			// 	circle4.x = sizes.width * 0.04;
			// 	circle4.y = sizes.height * 0.8;
			// 	circle4.r = sizes.width * 0.12;
			// }

			if (sizes.width < 1000) {
				// circle1
				circle1.x = sizes.width * 0.9;
				circle1.y = sizes.height * 0.15;
				circle1.r = sizes.width * 0.08;

				// circle2

				circle2.x = sizes.width * 0.7;
				circle2.y = sizes.height * 0.68;
				circle2.r = sizes.width * 0.09;

				// circle3

				// circle4
			}

			// circle1.draw();
			circle2.draw();
			circle3.draw();
			circle4.draw();

			let radius = 0;
			let scaleFactor = 0;
			if (sizes.height <= sizes.width) {
				radius = sizes.height * 0.5;
			} else {
				radius = sizes.width * 0.5;
			}

			console.log(sizes.width / sizes.height);
			if (
				sizes.width > sizes.height &&
				sizes.width / sizes.height < 1.4
			) {
				scaleFactor = 120;
			}

			let circle5 = new FixedBalls(
				sizes.width * 0.75 + scaleFactor,
				sizes.height * 1.51,
				radius,
			);

			let circle6 = new FixedBalls(
				sizes.width * 0.23 - scaleFactor,
				sizes.height * 2.51,
				radius,
			);

			let circle7 = new FixedBalls(
				sizes.width * 0.75 + scaleFactor,
				sizes.height * 3.51,
				radius,
			);

			let circle8 = new FixedBalls(
				sizes.width * 0.22 - scaleFactor,
				sizes.height * 4.51,
				radius,
			);

			let circle9 = new FixedBalls(
				sizes.width * 0.75 + scaleFactor,
				sizes.height * 5.51,
				radius,
			);

			if (fixedBalls.length == 0) {
				fixedBalls.push(circle1);
				fixedBalls.push(circle2);
				fixedBalls.push(circle3);
				fixedBalls.push(circle4);
				if (canvasScale > 1) {
					circle5.draw();
					circle6.draw();
					circle7.draw();
					circle8.draw();
					circle9.draw();

					fixedBalls.push(circle5);
					fixedBalls.push(circle6);
					fixedBalls.push(circle7);
					fixedBalls.push(circle8);
					fixedBalls.push(circle9);
				}
			} else if (fixedBalls[0].x != circle1.x) {
				fixedBalls = [];
				fixedBalls.push(circle1);
				fixedBalls.push(circle2);
				fixedBalls.push(circle3);
				fixedBalls.push(circle4);
				if (canvasScale > 1) {
					circle5.draw();
					circle6.draw();
					circle7.draw();
					circle8.draw();
					circle9.draw();

					fixedBalls.push(circle5);
					fixedBalls.push(circle6);
					fixedBalls.push(circle7);
					fixedBalls.push(circle8);
					fixedBalls.push(circle9);
				}
			}
		}

		function generateMore() {
			setInterval(() => {
				if (!document.hidden && balls.length < 7) {
					let numberOfBalls = Math.floor(randomIntFromRange(1, 3));
					for (let i = 0; i < numberOfBalls; i++) {
						let radius = Math.floor(randomIntFromRange(10, 30));
						let x = Math.floor(
							randomIntFromRange(radius, sizes.width),
						);
						let y = Yscroll - radius;
						let dx = randomIntFromRange(-1, 2);
						let dy = randomIntFromRange(-0.1, 0.1);
						balls.push(new Ball(x, y, dx, dy, radius));
					}
				}
			}, 4000);
		}

		function init() {
			let numberOfBalls = Math.floor(randomIntFromRange(3, 5));
			for (let i = 0; i < numberOfBalls; i++) {
				let radius = randomIntFromRange(10, 30);
				let x = Math.floor(randomIntFromRange(radius, sizes.width));
				let y = Yscroll - radius;
				let dx = randomIntFromRange(-1, 2);
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
			const percent = 0.2;
			const slop = 0.01;
			let correction =
				(Math.max(depth - slop, 0) / (1 / ballA.r + 1 / ballB.r)) *
				percent;

			let norm = [ballB.x - ballA.x, ballB.y - ballA.y];
			let mag = Math.sqrt(norm[0] * norm[0] + norm[1] * norm[1]);
			norm = [norm[0] / mag, norm[1] / mag];
			correction = [correction * norm[0], correction * norm[1]];
			ballA.x -= (1 / ballA.r) * correction[0];
			ballA.y -= (1 / ballA.r) * correction[1];
		}

		let animationId;
		function animate() {
			c.fillStyle = grd;
			c.fillRect(0, 0, sizes.width, sizes.height * canvasScale);

			particles.forEach((particle, index) => {
				if (particle.alpha <= 0) {
					particles.splice(index, 1);
				} else {
					particle.update();
				}
			});

			for (let ball of balls) {
				ball.update();
				if (ball.y + ball.r > Yscroll) {
					for (let ball2 of balls) {
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
					// for brusting ball
					if (ball.y >= sizes.height * 5) {
						setTimeout(() => {
							ball.touched = 6;
						}, randomIntFromRange(1500, 2500));
					}
				} else {
					ball.dy = 0.01;
				}
			}
			animationId = requestAnimationFrame(animate);
		}

		function removeBallAnimation() {
			document
				.getElementById("stop-anim")
				.addEventListener("click", () => {
					if (animationId == null) {
						animate();
					} else {
						cancelAnimationFrame(animationId);
						animationId = null;
						particles = [];
						balls = [];
						c.fillStyle = grd;
						c.fillRect(
							0,
							0,
							sizes.width,
							sizes.height * canvasScale,
						);
					}
				});
		}

		animate();
		removeBallAnimation();

		setTimeout(() => {
			drawFixedBalls();
			document.body.style["overflow-y"] = "unset";
			document.body.style.height = "unset";
		}, 1500);

		setTimeout(() => {
			init();
		}, 3000);
	}

	function addAnimToMainText() {
		let line1 = document.getElementsByClassName("line1")[0];
		let line2 = document.getElementsByClassName("line2")[0];
		let line3 = document.getElementsByClassName("line3");

		line2.style["animation-delay"] = "300ms";
		line3[0].style["animation-delay"] = "600ms";
		line3[1].style["animation-delay"] = "600ms";

		line1.classList.add("line-animation");
		line2.classList.add("line-animation");
		line3[0].classList.add("line-animation");
		line3[1].classList.add("line-animation");

		gsap.to("#links", 1.5, {
			x: 0,
		});

		// setTimeout(() => {
		// 	document.getElementById("links").style.transform =
		// 		"translateX(0px)";
		// }, 2);

		document.getElementById("section2-container").style.display = "block";
	}

	addAnimToMainText();
	handleHomePageCanvas();
}

function about() {
	function animOnDownArrow() {
		let resumeBtn = document.querySelector(".resume");

		resumeBtn.addEventListener("mouseenter", () => {
			gsap.to("#arrow-down", {
				y: 0,
				opacity: 1,
			});
		});

		resumeBtn.addEventListener("mouseleave", () => {
			gsap.to("#arrow-down", {
				y: -40,
				opacity: 0,
			});
		});
	}
	animOnDownArrow();

	window.addEventListener("resize", () => {
		resetCanvas();

		for (let i = 0; i < ids.length; i++) {
			cancelAnimationFrame(ids[i]);
		}
	});

	class SmallShapes {
		constructor(x, y, shape, color, r, isHollow, ctx, lineWidth) {
			this.x = x;
			this.y = y;
			this.r = r;
			this.color = color;
			this.shape = shape;
			this.isHollow = isHollow;
			this.ctx = ctx;
			this.lineWidth = lineWidth;
			this.dx = randomIntFromRange(-6, 6);
			this.dy = randomIntFromRange(-6, 6);
		}

		draw() {
			this.ctx.beginPath();
			if (this.shape == "circle") {
				this.ctx.fillStyle = this.color;
				this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
				if (this.isHollow) {
					this.ctx.lineWidth = this.lineWidth;
					this.ctx.strokeStyle = this.color;
					this.ctx.stroke();
				} else {
					this.ctx.fill();
				}
			} else {
				this.ctx.fillStyle = this.color;
				if (this.isHollow) {
					this.ctx.lineWidth = this.lineWidth;
					this.ctx.strokeStyle = this.color;
					this.ctx.strokeRect(this.x, this.y, this.r, this.r);
				} else {
					this.ctx.fillRect(this.x, this.y, this.r, this.r);
				}
			}
			this.ctx.closePath();
		}

		update() {
			if (
				this.y + this.r + this.dy >= allCanvas[0].height ||
				this.y - 2 * this.r <= 0
			) {
				this.dy = -this.dy;
			}
			if (
				this.x + this.r + this.dx >= allCanvas[0].width ||
				this.x - 2 * this.r <= 0
			) {
				this.dx = -this.dx;
			}

			if (this.dx > 0) {
				this.dx -= 0.05;
			} else {
				this.dx += 0.05;
			}

			if (this.dy > 0) {
				this.dy -= 0.05;
			} else {
				this.dy += 0.05;
			}
			this.x += this.dx;
			this.y += this.dy;
			this.draw();
		}
	}

	function randomIntFromRange(min, max) {
		return Math.random() * (max - min + 1) + min;
	}

	let shapes = [];
	let allctx = [];
	let ids = [];

	let scale = window.devicePixelRatio;

	let allCanvas = document.getElementsByClassName("card1-canvas");
	let card = document
		.getElementsByClassName("one-card")[0]
		.getBoundingClientRect();

	function resetCanvas() {
		shapes = [];
		allctx = [];
		scale = window.devicePixelRatio;

		allCanvas = document.getElementsByClassName("card1-canvas");
		card = document
			.getElementsByClassName("one-card")[0]
			.getBoundingClientRect();

		for (let i = 0; i < allCanvas.length; i++) {
			let canvas = allCanvas[i];
			let ctx = canvas.getContext("2d");
			allctx.push(ctx);
			let width = card.width;
			let height = card.height;

			canvas.style.width = width + "px";
			canvas.style.height = height + "px";

			if (scale >= 2) {
				canvas.width = width * scale;
				canvas.height = height * scale;
				ctx.scale(scale / 2, scale / 2);
			} else {
				canvas.width = width;
				canvas.height = height;
				ctx.scale(scale, scale);
			}
		}

		enableMouseEvent();
		createCanvasObjects();
		animate1(allctx[0], 0);
		animate2(allctx[1], 1);
		animate3(allctx[2], 2);
		animate4(allctx[3], 3);
		animate5(allctx[4], 4);
		animate6(allctx[5], 5);
	}
	resetCanvas();

	function createCanvasObjects() {
		for (let j = 0; j < allctx.length; j++) {
			let temp = [];
			for (let i = 0; i < 7; i++) {
				let x = randomIntFromRange(0, allCanvas[j].width);
				let y = randomIntFromRange(0, allCanvas[j].height);
				let shape = randomIntFromRange(0, 2) > 1 ? "circle" : "rect";
				let isHollow = randomIntFromRange(0, 2) > 1 ? true : false;
				let object = new SmallShapes(
					x,
					y,
					shape,
					colors[i],
					randomIntFromRange(3, 8) * scale,
					isHollow,
					allctx[j],
					randomIntFromRange(10, 16),
				);
				object.draw();
				temp.push(object);
			}
			shapes.push(temp);
		}
	}

	function enableMouseEvent() {
		let cards = document.getElementsByClassName("one-card");

		for (let i = 0; i < cards.length; i++) {
			cards[i].addEventListener("mouseenter", () => {
				for (let j = 0; j < 7; j++) {
					shapes[i][j].dx = randomIntFromRange(6, 8);
					shapes[i][j].dy = randomIntFromRange(6, 8);
					shapes[i][j].shape =
						randomIntFromRange(0, 2) > 1 ? "rect" : "circle";
				}
				switch (i) {
					case 0:
						cancelAnimationFrame(ids[0]);
						animate1(allctx[0], 0);
						setTimeout(() => {
							cancelAnimationFrame(ids[0]);
						}, 3000);
						break;
					case 1:
						cancelAnimationFrame(ids[1]);
						animate2(allctx[1], 1);
						setTimeout(() => {
							cancelAnimationFrame(ids[1]);
						}, 3000);
						break;
					case 2:
						cancelAnimationFrame(ids[2]);
						animate3(allctx[2], 2);
						setTimeout(() => {
							cancelAnimationFrame(ids[2]);
						}, 3000);
						break;
					case 3:
						cancelAnimationFrame(ids[3]);
						animate4(allctx[3], 3);
						setTimeout(() => {
							cancelAnimationFrame(ids[3]);
						}, 3000);
						break;
					case 4:
						cancelAnimationFrame(ids[4]);
						animate5(allctx[4], 4);
						setTimeout(() => {
							cancelAnimationFrame(ids[4]);
						}, 3000);
						break;
					case 5:
						cancelAnimationFrame(ids[5]);
						animate6(allctx[5], 5);
						setTimeout(() => {
							cancelAnimationFrame(ids[5]);
						}, 3000);
						break;
					default:
						break;
				}
			});
		}
	}

	function animate1(tempCtx, i) {
		tempCtx.fillStyle = "white";
		tempCtx.fillRect(0, 0, card.width * scale, card.height * scale);

		for (let object of shapes[i]) {
			object.update();
		}
		ids[0] = requestAnimationFrame(animate1.bind(null, tempCtx, i));
	}
	function animate2(tempCtx, i) {
		tempCtx.fillStyle = "white";
		tempCtx.fillRect(0, 0, card.width * scale, card.height * scale);
		for (let object of shapes[i]) {
			object.update();
		}
		ids[1] = requestAnimationFrame(animate2.bind(null, tempCtx, i));
	}
	function animate3(tempCtx, i) {
		tempCtx.fillStyle = "white";
		tempCtx.fillRect(0, 0, card.width * scale, card.height * scale);
		for (let object of shapes[i]) {
			object.update();
		}
		ids[2] = requestAnimationFrame(animate3.bind(null, tempCtx, i));
	}
	function animate4(tempCtx, i) {
		tempCtx.fillStyle = "white";
		tempCtx.fillRect(0, 0, card.width * scale, card.height * scale);
		for (let object of shapes[i]) {
			object.update();
		}
		ids[3] = requestAnimationFrame(animate4.bind(null, tempCtx, i));
	}
	function animate5(tempCtx, i) {
		tempCtx.fillStyle = "white";
		tempCtx.fillRect(0, 0, card.width * scale, card.height * scale);
		for (let object of shapes[i]) {
			object.update();
		}
		ids[4] = requestAnimationFrame(animate5.bind(null, tempCtx, i));
	}
	function animate6(tempCtx, i) {
		tempCtx.fillStyle = "white";
		tempCtx.fillRect(0, 0, card.width * scale, card.height * scale);
		for (let object of shapes[i]) {
			object.update();
		}
		ids[5] = requestAnimationFrame(animate6.bind(null, tempCtx, i));
	}

	setTimeout(() => {
		for (let i = 0; i < ids.length; i++) {
			cancelAnimationFrame(ids[i]);
		}
	}, 2000);
}

function project() {
	const canvas = document.querySelector("#canvas3");
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

window.onload = function () {
	let url = window.location.pathname.split("/").pop();
	console.log(url);
	if (url == "index.html" || url == "") {
		console.log("home");
		home();
	} else if (url == "about.html") {
		console.log("about");
		document.body.style["overflow-y"] = "unset";
		document.body.style.height = "unset";
		about();
	} else {
		document.body.style["overflow-y"] = "unset";
		document.body.style.height = "unset";
		project();
	}
};
function pageTransition() {
	let tl = gsap.timeline();

	tl.to("ul.transition li", {
		duration: 0.5,
		scaleY: 1,
		transformOrigin: "bottom left",
		stagger: 0.2,
	});

	tl.to("ul.transition li", {
		duration: 0.5,
		scaleY: 0,
		transformOrigin: "bottom left",
		stagger: 0.1,
		delay: 0.2,
	});
}

function contentAnimation() {
	let tl = gsap.timeline();

	tl.to(
		"img",
		{
			clipPath: "polygon(0 0, 100% 0,100% 100%, 0% 100% ",
		},
		"-=1.1s",
	);
}

function delay(n) {
	n = n || 2000;
	return new Promise((done) => {
		setTimeout(() => {
			done();
		}, n);
	});
}

barba.init({
	sync: true,
	transitions: [
		{
			async leave(data) {
				const done = this.async();

				pageTransition();
				await delay(1500);
				done();
			},

			async enter(data) {
				contentAnimation();
				window.scrollTo(0, 0);
				let url = window.location.pathname.split("/").pop();
				console.log(url);
				if (url == "index.html") {
					console.log("home");
					home();
				} else if (url == "about.html") {
					console.log("about");
					document.body.style["overflow-y"] = "unset";
					document.body.style.height = "unset";
					about();
				} else {
					document.body.style["overflow-y"] = "unset";
					document.body.style.height = "unset";
					project();
				}
			},

			async once(data) {
				contentAnimation();
			},
		},
	],
});
