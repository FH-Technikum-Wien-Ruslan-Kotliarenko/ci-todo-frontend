// Temporary mock
const posthog = {
    isFeatureEnabled(flagName) {
      if (flagName === 'todo-sorting') return true; // or false to test off
      return false;
    },
    getFeatureFlag(flagName) {
      if (flagName === 'register-button-variant') {
        // randomly pick 'variantA' or 'variantB' or just return 'variantA'
        return Math.random() < 0.5 ? 'variantA' : 'variantB';
      }
      return 'variantA';
    }
  };
  
export default posthog;
  