import pluginJs from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"


export default [
    {
        files: ["**/*.{js,cjs,mjs,ts}"],
    },
    {languageOptions: {globals: globals.node}},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-namespace': 'off',
        }
    },
    {
        ignores: [
            "node_modules/**/*",
            "dist/**/*",
            "build/**/*",
            "coverage/**/*",
            "temp/**/*",
            "tests/**/*",
        ],
    }

]
