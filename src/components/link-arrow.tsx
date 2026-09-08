import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  CornerDownRight,
} from "lucide-react";

export function LinkArrow({
  direction = "up-right",
}: {
  direction?: "up-right" | "right" | "left" | "turn";
}) {
  const Icon = {
    "up-right": ArrowUpRight,
    right: ArrowRight,
    left: ArrowLeft,
    turn: CornerDownRight,
  }[direction];
  return (
    <Icon
      className="inline-icon"
      size={14}
      strokeWidth={1.7}
      aria-hidden="true"
    />
  );
}
