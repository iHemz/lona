function nameParts(name: string): string[] {
  return name.trim().split(/\s+/).filter(Boolean);
}

/** "Marcus Richmond" → "MR", "Cher" → "C" */
export function initials(name: string): string {
  const parts = nameParts(name);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** "John Doe" → "John" */
export function firstName(name: string): string {
  return nameParts(name)[0] ?? name;
}

/** "Sasha Bello" → "Sasha B." */
export function shortName(name: string): string {
  const parts = nameParts(name);
  if (parts.length < 2) return parts[0] ?? "";
  return `${parts[0]} ${parts[parts.length - 1]?.[0]}.`;
}

/** Case-insensitive substring match on a name; an empty query matches everything. */
export function matchesName(name: string, query: string): boolean {
  const needle = query.trim().toLocaleLowerCase();
  return !needle || name.toLocaleLowerCase().includes(needle);
}

/** Stable index for picking a colour from a palette, so a friend keeps the same colour. */
export function stableIndex(key: string, size: number): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % size;
}
