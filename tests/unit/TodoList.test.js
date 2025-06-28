// tests/unit/TodoList.test.js
import { describe, it, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import TodoList from '@/components/TodoList.vue';
import * as api from '@/api';

describe('TodoList.vue', () => {
  it('fetches and displays todos on creation', async () => {
    const mockTodos = [
      { id: 1, name: 'Test 1', done: false },
      { id: 2, name: 'Test 2', done: true },
    ];

    // Mock the readTodos function
    vi.spyOn(api, 'readTodos').mockResolvedValue(mockTodos);

    const wrapper = mount(TodoList);

    // Wait until next tick so that the created lifecycle has fetched todos
    await flushPromises()// Wait for all promises to resolve

    // Now we expect the rendered text to contain "Test 1" and "Test 2"
    expect(wrapper.text()).toContain('Test 1');
    expect(wrapper.text()).toContain('Test 2');
  });

  it('emits "loggedOut" after successful logout', async () => {
    // Mock the logout API
    vi.spyOn(api, 'logout').mockResolvedValue({});

    const wrapper = mount(TodoList);

    // Click the logout button
    await wrapper.find('button.logout-btn').trigger('click');

    // After the API call resolves, we expect "loggedOut" to be emitted
    expect(wrapper.emitted().loggedOut).toBeTruthy();
  });
});
