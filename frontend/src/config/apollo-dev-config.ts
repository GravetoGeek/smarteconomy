// Apollo Client Dev Configuration
// Suppress known deprecation warnings from Apollo Client 3.x

// Store original console.warn
const originalWarn=console.warn

// Override console.warn to filter Apollo deprecation warnings
console.warn=(...args: any[]) => {
    // Filter out the canonizeResults deprecation warning
    const message=args[0]?.toString()||''

    if(
        message.includes('canonizeResults is deprecated')||
        message.includes('canonizeResults')
    ) {
        // Silently ignore this specific deprecation warning
        return
    }

    // Pass through all other warnings
    originalWarn.apply(console,args)
}

// Export empty object to make this a module
export {};

