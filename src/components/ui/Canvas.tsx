import { useEffect, useRef } from "react";

interface Position {
	x: number;
	y: number;
}

interface FadingPosition extends Position {
	releasedAt: number;
}

export const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const frameRef = useRef<number | null>(null);
	const activeRef = useRef<Position[]>([]);
	const fadingRef = useRef<FadingPosition[]>([]);

	const FADE_DURATION = 600;

	useEffect(() => {
		const pointers = new Map<number, { x: number; y: number }>();

		const update = (e: PointerEvent) => {
			pointers.set(e.pointerId, {
				x: e.clientX,
				y: e.clientY,
			});

			activeRef.current = [...pointers.values()];
		};

		const remove = (e: PointerEvent) => {
			const pos = pointers.get(e.pointerId);
			if (pos) {
				fadingRef.current = [
					...fadingRef.current,
					{ ...pos, releasedAt: performance.now() },
				];
			}
			pointers.delete(e.pointerId);
			activeRef.current = [...pointers.values()];
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

				const computeRipple = (
					mouse: Position,
					amplitude: number,
				) => {
					const dx = mouse.x - x;
					const dy = Math.abs(surfaceY - mouse.y);
					const horizontalFalloff = Math.exp(-(dx * dx) / 8000);
					const verticalFalloff = Math.exp(-dy / 100);
					return (
						Math.sin(dx * 0.08 - t * 8) *
						amplitude *
						horizontalFalloff *
						verticalFalloff
					);
				};

				const mouseEffect = activeRef.current.reduce(
					(total, mouse) => total + computeRipple(mouse, 20),
					0,
				);

				const cutOff = time - FADE_DURATION;
				fadingRef.current = fadingRef.current.filter(
					(f) => f.releasedAt > cutOff,
				);

				const fadeEffect = fadingRef.current.reduce((total, fading) => {
					const elapsed = time - fading.releasedAt;
					const decay = 1 - elapsed / FADE_DURATION;
					return total + computeRipple(fading, 20 * decay);
				}, 0);

				return surfaceY + mouseEffect + fadeEffect;
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
