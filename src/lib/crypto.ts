import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { authSecret } from "./config";
export function equalSecret(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}
export function seal(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(
    "aes-256-gcm",
    createHash("sha256").update(authSecret()).digest(),
    iv,
  );
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), encrypted]
    .map((x) => x.toString("base64url"))
    .join(".");
}
export function unseal(value: string) {
  const [iv, tag, data] = value
    .split(".")
    .map((x) => Buffer.from(x, "base64url"));
  const cipher = createDecipheriv(
    "aes-256-gcm",
    createHash("sha256").update(authSecret()).digest(),
    iv,
  );
  cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString("utf8");
}
export function sign(value: unknown) {
  const data = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${data}.${createHmac("sha256", authSecret()).update(data).digest("base64url")}`;
}
export function verify<T>(token: string): T {
  const [data, mac] = token.split(".");
  if (
    !data ||
    !mac ||
    !equalSecret(
      mac,
      createHmac("sha256", authSecret()).update(data).digest("base64url"),
    )
  )
    throw new Error("Invalid confirmation. Preview the email again.");
  return JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as T;
}
