import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className = "", ...rest }: Props) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/70 dark:bg-zinc-800 ${className}`}
      {...rest}
    />
  );
}
