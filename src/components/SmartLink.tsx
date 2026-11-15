import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  to: string;
  className?: string;
  children: ReactNode;
}

/** Site paths use the router, "#anchors" stay on the page, everything else opens in a new tab. */
export default function SmartLink({ to, className, children }: Props) {
  if (to.startsWith("/")) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  if (to.startsWith("#")) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={to} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
