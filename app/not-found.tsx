import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center">
      <p className="font-display text-sm tracking-[0.3em] text-dmk-green">
        404
      </p>
      <h1 className="font-display mt-3 text-5xl sm:text-6xl tracking-tight">
        OFF THE RACK.
      </h1>
      <p className="mt-4 text-foreground/65">
        That page doesn't exist — or hasn't dropped yet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-dmk-green px-6 py-3 font-display tracking-widest text-dmk-black hover:bg-dmk-green-dark transition-colors"
      >
        BACK TO HOME
      </Link>
    </div>
  );
}
