export const pipe = (...fns) => v => fns.reduce((a, f) => f(a), v);
