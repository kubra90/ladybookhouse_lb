import Image from "next/image";

type Props = {
  label?: string;
  size?: number;
};

export default function BrandedLoader({
  label = "Loading books…",
  size = 128,
}: Props) {
  const ringSize = size + 24;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-6 py-24"
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: ringSize, height: ringSize }}
      >
        {/* Spinning ring */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-4 border-muted border-t-primary animate-spin"
        />
        {/* Logo in the center */}
        <Image
          src="/icon_ladybookhouse.png"
          alt="Lady Bookhouse"
          width={size}
          height={size}
          priority
          className="rounded-full"
        />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <span className="sr-only">Loading, please wait.</span>
    </div>
  );
}
