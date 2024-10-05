export class MemoryStorage implements Storage {
  public readonly entities: Map<string, string> = new Map();
  private _migrationToHaveBeenCalled: number = 0;

  [name: string]: any;

  length: number = 0;

  clear(): void {
    throw new Error('Method not implemented.');
  }

  getItem(key: string): string | null {
    return this.entities.get(key) || null;
  }

  key(__index: number): string | null {
    throw new Error('Method not implemented.');
  }

  removeItem(__key: string): void {
    throw new Error('Method not implemented.');
  }

  setItem(key: string, value: string): void {
    this.entities.set(key, value);
    this._migrationToHaveBeenCalled = this._migrationToHaveBeenCalled + 1
  }

  add(value: string): void {
    this.entities.set('john-storage', value);
  }

  migrationToHaveBeenCalled(numberOfCalls: number): boolean {
    return this._migrationToHaveBeenCalled === numberOfCalls
  }
}
