import posthog from 'posthog-js';
import { ref } from 'vue';

const isInitialized = ref(false);

export default function usePostHog() {
  if (!isInitialized.value) {
    // It's not safe, but I could not get the env variable to work in this fucking Vite app
    const apiKey = "phc_A4hZ05pnaEifw8HDREfFBN9SHQiWt84eO7Q3RK8QrBL";

    if (!apiKey) {
      console.error('[PostHog.js] API key is missing. Check your environment variables.');
      return { posthog }; // Return posthog instance even if uninitialized
    }

    posthog.init(apiKey, {
      api_host: 'https://us.i.posthog.com',
    });

    isInitialized.value = true;
  }

  return { posthog };
}
