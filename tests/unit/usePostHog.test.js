import { describe, it, expect, vi, beforeEach } from 'vitest';
import posthog from 'posthog-js';
import usePostHog from '@/usePostHog';

// Mock posthog-js
vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
  },
}));

describe('usePostHog', () => {
  beforeEach(() => {
    vi.resetModules(); // Reset module state
  });

  it('initializes posthog if not initialized', () => {
    // Call the composable
    usePostHog();

    // Expect posthog.init to have been called once with the correct arguments
    expect(posthog.init).toHaveBeenCalledTimes(1);
    expect(posthog.init).toHaveBeenCalledWith(
      'phc_A4hZ05pnaEifw8HDREfFBN9SHQiWt84eO7Q3RK8QrBL',
      expect.objectContaining({
        api_host: 'https://us.i.posthog.com',
      })
    );
  });

  it('does not re-initialize posthog if already initialized', () => {
    // First call to set isInitialized.value = true
    usePostHog();
    // Second call
    usePostHog();

    // posthog.init should only be called once
    expect(posthog.init).toHaveBeenCalledTimes(1);
  });
});
