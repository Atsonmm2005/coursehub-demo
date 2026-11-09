export default function Notice({ kind = "info", children }) {
  if (!children) return null;
  return (
    <p
      className={`notice ${kind}`}
      role={kind === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
