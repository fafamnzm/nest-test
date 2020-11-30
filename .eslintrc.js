export const parser = "@typescript-eslint/parser"
export const parserOptions = {
  project: "tsconfig.json",
  sourceType: "module",
}
export const root = true
export const env = {
  node: true,
  jest: true,
}
export const rules = {
  "@typescript-eslint/interface-name-prefix": "off",
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/no-explicit-any": "off",
}
