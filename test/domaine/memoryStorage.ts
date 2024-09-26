export class MemoryStorage implements Storage {
    public readonly entities: Map<string, string> = new Map();

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
    }

    add(value: string): void {
        this.entities.set('john-storage', value)
    }
}