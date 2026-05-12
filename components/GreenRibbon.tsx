type Props = {
  className?: string;
  size?: number;
};

export function GreenRibbon({ className, size = 28 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 2.5c-.4 0-.8.2-1 .6L4.2 8.4c-.3.5-.2 1.1.2 1.5L12 18l1.6-1.6-5-5L11.4 9 8 2.5z"
        fill="#22c55e"
      />
      <path
        d="M16 2.5c.4 0 .8.2 1 .6l2.8 5.3c.3.5.2 1.1-.2 1.5L12 18l-1.6-1.6 5-5L12.6 9 16 2.5z"
        fill="#16a34a"
      />
      <path
        d="M12 12.5 8 21l4-2.5L16 21l-4-8.5z"
        fill="#22c55e"
        stroke="#0a0a0a"
        strokeWidth="0.4"
      />
    </svg>
  );
}
