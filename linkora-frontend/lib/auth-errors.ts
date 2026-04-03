export function formatAuthError(err: string | Record<string, string> | undefined): string {
  if (!err) return "Something went wrong";
  if (typeof err === "string") return err;
  return Object.entries(err)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}
