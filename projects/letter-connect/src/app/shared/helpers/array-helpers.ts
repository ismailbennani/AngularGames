export const shuffle = <T>(array: T[]) => {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }

    return result;
};

export const pickAtRandom = <T>(array: T[]): T => {
    if (array.length === 0) {
        throw new Error('Array is empty');
    }

    return array[Math.floor(Math.random() * array.length)];
};