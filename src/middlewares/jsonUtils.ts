// Utility to serialize an object into JSON string
export const toJSON = (data: Record<string, any>): string => {
    return JSON.stringify(data);
};

// Utility to deserialize a JSON string back into an object
export const fromJSON = <T>(data: string): T => {
    return JSON.parse(data);
};
