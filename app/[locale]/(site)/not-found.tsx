import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
        404
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        La pagina que buscas no existe o fue movida.
      </p>
      <Link
        href="/es"
        className="mt-8 inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
