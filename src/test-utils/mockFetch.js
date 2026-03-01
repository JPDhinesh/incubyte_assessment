export const createDeferredPromise = () => {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
};

export const jsonResponse = (payload) =>
  Promise.resolve({
    ok: true,
    json: async () => payload,
  });
