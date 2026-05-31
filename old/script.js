const $ = (selector) => document.querySelector(selector);

const setFaviconColor = (color) => {
	const canvas = document.createElement("canvas");
	canvas.width = 64;
	canvas.height = 64;

	const ctx = canvas.getContext("2d");
	ctx.fillStyle = color;

	//draw circle
	ctx.beginPath();
	ctx.arc(32, 32, 32, 0, 2 * Math.PI);
	ctx.fill();

	const dataUrl = canvas.toDataURL();
	let link = document.querySelector("link[rel~='icon']");
	if (!link) {
		link = document.createElement("link");
		link.rel = "icon";
		document.head.appendChild(link);
	}
	link.href = dataUrl;
};

const color = `hsl(${Math.random() * 360}deg, 72%, 60%)`;
document.querySelector(":root").style.setProperty("--accent", color);
setFaviconColor(color);

window.addEventListener("mousemove", (e) => {
	const target = $("h1");
	const x =
		e.clientX - target.getBoundingClientRect().left + target.offsetWidth / 2;
	const y =
		e.clientY - target.getBoundingClientRect().top + target.offsetHeight / 2;
	const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
	target.style.setProperty("--angle", `${angle}deg`);
});
