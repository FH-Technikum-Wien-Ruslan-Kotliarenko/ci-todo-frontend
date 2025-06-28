// tests/unit/LoginRegister.test.js
import { describe, it, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import LoginRegister from '@/components/LoginRegister.vue';
import * as api from '@/api';

describe('LoginRegister.vue', () => {
  it('registers successfully and shows success message', async () => {
    vi.spyOn(api, 'register').mockResolvedValue({ success: true });
  
    const wrapper = mount(LoginRegister);
  
    await wrapper.setData({ 
      regEmail: 'test@example.com', 
      regPassword: 'password123' 
    });
  
    await wrapper.find('button.register-btn-variantA').trigger('click');
  
    // Wait for all promises to resolve
    await flushPromises();
  
    // Check the specific element for the success message
    expect(wrapper.find('.success').text()).toBe('Registered successfully!');
  });
  

  it('emits "loggedIn" after a successful login', async () => {
    // Mock the login API
    vi.spyOn(api, 'login').mockResolvedValue({});

    const wrapper = mount(LoginRegister);

    // Fill the login fields
    await wrapper.setData({ 
      loginEmail: 'test@example.com', 
      loginPassword: 'password123' 
    });

    // Click the login button
    await wrapper.find('button.login-btn').trigger('click');

    // The component should emit "loggedIn"
    expect(wrapper.emitted().loggedIn).toBeTruthy();
  });
});
