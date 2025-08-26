import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
    testRegex: '.*\\.int-spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        'src/**/*.(t|j)s',
        '!src/**/*.spec.ts',
        '!src/**/*.int-spec.ts',
        '!src/**/*.e2e-spec.ts',
        '!src/__tests__/**/*',
        '!src/main.ts',
        '!src/**/*.module.ts'
    ],
    coverageDirectory: 'coverage/integration',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
    testTimeout: 60000, // Integration tests may take longer
    verbose: true
}
