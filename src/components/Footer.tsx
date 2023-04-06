export default function Footer() {
  const revision = import.meta.env.DEV
    ? "DEVELOPMENT"
    : `Rev ${import.meta.env.VITE_REVISION.slice(0, 6)}`;

  return <footer>{revision}</footer>;
}
