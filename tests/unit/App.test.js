// tests/unit/App.test.js
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '@/App.vue';

describe('App.vue', () => {
  it('shows loading text while checking authentication', async () => {
    const wrapper = mount(App);

    // Initially, <div> with text "Checking authentication..." should be visible
    expect(wrapper.text()).toContain('Checking authentication...');
  });
});
