const locks: Record<string, boolean> = {};

export const acquireLock = (key: string) => {
  if (locks[key]) {
    return false;
  }
  locks[key] = true;
  return true;
};

export const releaseLock = (key: string) => {
  delete locks[key];
};
