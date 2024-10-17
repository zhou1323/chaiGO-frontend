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

export function weeksLeftInMonth(): number {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const lastDayOfMonth = new Date(year, month + 1, 0);

  const dayOfWeek = today.getDay();

  const daysLeftInMonth = lastDayOfMonth.getDate() - today.getDate();

  const weeksLeft = Math.ceil((daysLeftInMonth + (7 - dayOfWeek)) / 7);

  return weeksLeft;
}

export function getUnitPrice(
  unit: string,
  quantity: number,
  unitRangeFrom: number,
  price: number
) {
  let standardUnit = unit;
  let standardUnitRangeFrom = unitRangeFrom;
  let maxStandardUnitPrice = price;
  if (unit === 'g') {
    standardUnit = 'kg';
    standardUnitRangeFrom = unitRangeFrom / 1000;
    maxStandardUnitPrice = price / (quantity * standardUnitRangeFrom);
  } else if (unit === 'dl') {
    standardUnit = 'l';
    standardUnitRangeFrom = unitRangeFrom / 10;
    maxStandardUnitPrice = price / (quantity * standardUnitRangeFrom);
  } else if (unit === 'ml') {
    standardUnit = 'l';
    standardUnitRangeFrom = unitRangeFrom / 1000;
    maxStandardUnitPrice = price / (quantity * standardUnitRangeFrom);
  }
  return [standardUnit, maxStandardUnitPrice.toFixed(2)];
}

export function getOfferInfo(
  quantity: number,
  unit: string,
  unitRangeFrom: number,
  unitRangeTo: number,
  price: number,
  getCurrencyString: (price: number) => string
) {
  const quantityString = quantity !== 1 ? `${quantity} x ` : '';
  const unitRangeString =
    unitRangeFrom === unitRangeTo
      ? unitRangeFrom
      : `${unitRangeFrom}-${unitRangeTo}`;
  const unitString = unit;
  const [standardUnit, maxStandardUnitPrice] = getUnitPrice(
    unit,
    quantity,
    unitRangeFrom,
    price
  );

  let unitPriceString = `${getCurrencyString(Number(maxStandardUnitPrice))}/${standardUnit}`;
  if (unitRangeFrom !== unitRangeTo) {
    unitPriceString = 'max ' + unitPriceString;
  }
  return `${quantityString}${unitRangeString}${unitString} * ${unitPriceString}`;
}
