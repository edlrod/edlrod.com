import { ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type LinkProps = React.ComponentProps<"a">;

const linkClasses =
	"relative after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 group flex gap-4 items-center justify-between";

const iconClasses =
	"opacity-0 transition-all duration-200 group-hover:opacity-60 group-hover:translate-x-0";

export const Link = ({ children, className, ...props }: LinkProps) => {
	return (
		<a
			target="_blank"
			rel="noopener noreferrer"
			className={cn(linkClasses, className)}
			{...props}
		>
			{children}
			<ExternalLinkIcon size={16} className={iconClasses} />
		</a>
	);
};
