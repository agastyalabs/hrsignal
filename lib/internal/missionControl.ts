// Mission Control is **local-only** by design.
//
// Required behavior:
// - In dev/non-production: allowed.
// - In production: hard disabled (404 via callers).
//
// NOTE: LAN access should work automatically in dev since NODE_ENV !== 'production'.

export function missionControlAllowed(_req?: Request): boolean {
  // Local-only gate (v1): allow in non-production.
  // Callers may pass a Request in routes; currently unused.
  return process.env.NODE_ENV !== "production";
}
