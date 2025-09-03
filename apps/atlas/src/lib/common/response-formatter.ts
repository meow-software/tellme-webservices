
export class ResponseFormatter {
    /**
    * Format an object or array:
    * - Removes the attributes listed in `removeKeys`
    * - Converts all BigInts to strings
    */
    format<T>(data: T, removeKeys: string[] = []): T {
        if (Array.isArray(data)) {
            return data.map(item => this.format(item, removeKeys)) as any;
        } else if (data && typeof data === 'object') {
            const result: any = {};
            for (const [key, value] of Object.entries(data)) {
                if (removeKeys.includes(key)) continue;

                if (typeof value === 'bigint') {
                    result[key] = value.toString();
                } else if (Array.isArray(value) || (value && typeof value === 'object')) {
                    result[key] = this.format(value, removeKeys);
                } else {
                    result[key] = value;
                }
            }
            return result;
        }
        return data;
    }
}
