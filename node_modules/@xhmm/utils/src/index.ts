export function getType(val): string {
  return Object.prototype.toString
    .call(val)
    .split(" ")[1]
    .slice(0, -1)
    .toLowerCase();
}
export function assertType(receivedValue, expectedType): void|never {
  if (getType(receivedValue) !== expectedType)
    throw new Error(
      `参数${receivedValue}类型不符: expect ${expectedType}, received ${getType(
        receivedValue
      )}`
    );
}

// null and undefined will not be included
export function objectToQS(obj?: Record<string, any>): string {
  if (obj === undefined) return "";
  const str = Object.keys(obj).reduce((acc, cur) => {
    let value = obj[cur];
    const type = getType(value);
    if (['undefined', 'null'].includes(type)) return acc;
    if (type === 'string') value = value;
    else value = JSON.stringify(obj[cur]);
    acc += `&${cur}=${encodeURIComponent(value)}`;
    return acc;
  }, "");
  return str.slice(1);
}

export function conditionalObjectMerge<
  T extends Record<string, any>,
  K extends Record<string, any>
  >(target: T, ...args: Array<[boolean, K]>): T & K | T {
  const obj = {};
  for (const [condition, val] of args) {
    assertType(val, 'object');
    if (condition) Object.assign(obj, val);
  }

  return Object.assign(target, obj);
}

export function conditionalArrayMerge(
  target: Array<any>,
  ...args: Array<[boolean, any]>
): Array<any> {
  for (const [condition, val] of args) {
    if (condition) target.push(val);
  }

  return target;
}


export function valueExistsInObject(
  obj: any,
  ...values: Array<string | number>
): boolean {
  if (getType(obj) !== "object")
    throw new TypeError(
      `the first parameter should be an object, received ${getType(obj)}`
    );
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (values.includes(obj[key])) return true;
      if (getType(obj[key]) === "object")
        return valueExistsInObject(obj[key], ...values);
    }
  }
  return false;
}

export function hasRepeat(arr: string[]): boolean {
  return arr.filter((item, idx) => arr.indexOf(item) !== idx).length !== 0;
}
