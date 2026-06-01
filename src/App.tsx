import { Link } from "./components/Link";
import { Canvas } from "./components/ui/Canvas";

const fadeInClasses = "opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]";

const fadeInDelay = (delay: number) => ({ animationDelay: `${delay}ms` });

export const App = () => (
	<div className="fixed inset-0 flex items-center justify-center">
		<div className="flex flex-col gap-4">
			<div className={fadeInClasses} style={fadeInDelay(100)}>
				<h1 className="text-xl font-bold">edlrod</h1>
				<p className="text-sm text-muted-foreground">E-D spells Ed.</p>
			</div>
			<div className="flex flex-col gap-2 w-32">
				<Link
					className={fadeInClasses}
					style={fadeInDelay(200)}
					href="https://github.com/edlrod"
				>
					github
				</Link>
				<Link
					className={fadeInClasses}
					style={fadeInDelay(300)}
					href="https://www.linkedin.com/in/edwardleselrod"
				>
					linkedin
				</Link>
				<Link
					className={fadeInClasses}
					style={fadeInDelay(400)}
					href="https://www.instagram.com/edlrod"
				>
					instagram
				</Link>
				<Link
					className={fadeInClasses}
					style={fadeInDelay(500)}
					href="https://last.fm/user/edlrod"
				>
					last.fm
				</Link>
			</div>
		</div>
		<Canvas />
	</div>
);
