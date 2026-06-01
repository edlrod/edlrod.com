import { useEffect, useRef } from "react";

interface Position {
	x: number;
	y: number;
}

export const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frameRef = useRef<number | null>(null);
	const mouseRef = useRef<Position[]>([]);

	useEffect(() => {
		const pointers = new Map<number, { x: number; y: number }>();

		const update = (e: PointerEvent) => {
			pointers.set(e.pointerId, {
				x: e.clientX,
				y: e.clientY,
			});

			mouseRef.current = [...pointers.values()];
		};

		const remove = (e: PointerEvent) => {
			pointers.delete(e.pointerId);
			mouseRef.current = [...pointers.values()];
		};

		window.addEventListener("pointerdown", update);
		window.addEventListener("pointermove", update);
		window.addEventListener("pointerup", remove);
		window.addEventListener("pointercancel", remove);

		return () => {
			window.removeEventListener("pointerdown", update);
			window.removeEventListener("pointermove", update);
			window.removeEventListener("pointerup", remove);
			window.removeEventListener("pointercancel", remove);
		};
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resize();
		window.addEventListener("resize", resize);

		let progress = 0;

		const render = (time: number) => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const t = time * 0.001;

			const y = (x: number, t: number) => {
				const waterTop = canvas.height * 0.8;

				const baseWave =
					Math.sin(x * 0.01 + t * 1.5) * 12 +
					Math.sin(x * 0.025 + t * 0.8) * 6 +
					Math.sin(x * 0.05 + t * 2.2) * 3;

				const surfaceY = waterTop + baseWave;

				const mouseEffect = mouseRef.current.reduce((total, mouse) => {
					const dx = mouse.x - x;
					const dy = Math.abs(surfaceY - mouse.y);

					const horizontalFalloff = Math.exp(-(dx * dx) / 8000);
					const verticalFalloff = Math.exp(-dy / 100);

					const ripple =
						Math.sin(dx * 0.08 - t * 8) *
						20 *
						horizontalFalloff *
						verticalFalloff;

					return total + ripple;
				}, 0);

				return surfaceY + mouseEffect;
			};

			ctx.strokeStyle = "#fff";

			ctx.moveTo(0, y(0, t));
			ctx.beginPath();
			for (let x = 0; x < canvas.width * progress; x += 1)
				ctx.lineTo(Math.round(x), y(x, t));
			ctx.stroke();

			if (performance.now() > 600) progress += (1.025 - progress) * 0.01;

			frameRef.current = requestAnimationFrame(render);
		};

		frameRef.current = requestAnimationFrame(render);

		return () => {
			window.removeEventListener("resize", resize);

			if (frameRef.current !== null) {
				cancelAnimationFrame(frameRef.current);
			}
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 w-screen h-screen -z-10 touch-none"
		/>
	);
};
