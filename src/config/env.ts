export enum EnvKey {
  AlchemyKey = "VITE_ALCHEMY_KEY",
}

export function requireEnvVariable(key: EnvKey): string {
  const variable = import.meta.env[key];

  if (variable === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return variable;
}
