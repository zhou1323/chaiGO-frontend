export function convertToCamel<T>(data: T): T {
  if (typeof data !== 'object' || !data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => convertToCamel(item)) as unknown as T;
  }

  const newData: Record<string, unknown> = {};
  for (const key in data) {
    const newKey = key.replace(/_([a-z])/g, (_, m) => m.toUpperCase());
    newData[newKey] = convertToCamel((data as Record<string, unknown>)[key]);
  }
  return newData as T;
}
