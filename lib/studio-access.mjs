const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function canUseStudio(request, mode = process.env.NODE_ENV) {
  if (mode !== "development") return false;
  try {
    const host = new URL(`http://${request.headers.get("host")}`);
    if (!localHosts.has(host.hostname)) return false;
    const origin = request.headers.get("origin");
    if (origin) {
      const source = new URL(origin);
      if (source.origin !== host.origin) return false;
    } else if (!["GET", "HEAD"].includes(request.method)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
