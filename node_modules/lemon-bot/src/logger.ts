export function warn(msg: string): void {
  console.log(`[warning] ${msg}`);
}

export function error(msg: any): void {
  console.error(msg);
}