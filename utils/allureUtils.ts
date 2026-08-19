import { allure } from 'allure-playwright';

/** Converts camelCase method names to "Title Case Step Names" for Allure reports. */
export function toStepName(camelCase: string): string {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapAsyncMethods(target: abstract new (...args: any[]) => object): void {
  for (const key of Object.getOwnPropertyNames(target.prototype)) {
    if (key === 'constructor') continue;
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
    if (!descriptor || typeof descriptor.value !== 'function') continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((descriptor.value as any).constructor.name !== 'AsyncFunction') continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const original = descriptor.value as (...args: any[]) => Promise<unknown>;
    descriptor.value = function (this: object, ...args: unknown[]) {
      return allure.step(toStepName(key), () => original.apply(this, args) as Promise<void>);
    };
    Object.defineProperty(target.prototype, key, descriptor);
  }
}

/** Class decorator: wraps every async method in an Allure step named after the method. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Steps<T extends abstract new (...args: any[]) => object>(
  target: T,
  _context: ClassDecoratorContext<T>,
): void {
  wrapAsyncMethods(target);
}

/** Class decorator: wraps every async method in an Allure step named after the method. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Verifications<T extends abstract new (...args: any[]) => object>(
  target: T,
  _context: ClassDecoratorContext<T>,
): void {
  wrapAsyncMethods(target);
}
