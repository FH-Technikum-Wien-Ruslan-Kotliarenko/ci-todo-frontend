// tests/unit/TodoComponent.test.js
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TodoComponent from '@/components/TodoComponent.vue';

describe('TodoComponent.vue', () => {
  it('renders the todo name and applies line-through if done', () => {
    const todo = { id: 123, name: 'Mock TODO', done: true };
    const wrapper = mount(TodoComponent, {
      props: { todo },
    });

    // Check if the text is there
    expect(wrapper.text()).toContain('Mock TODO');

    // The line-through is indicated by the .done class
    const span = wrapper.find('span.done');
    expect(span.exists()).toBe(true);
  });

  it('emits "done" if the todo is undone, and "undone" if the todo is done', async () => {
    // If done is false, clicking should emit 'done'
    let wrapper = mount(TodoComponent, {
      props: { todo: { id: 123, name: 'Mock TODO', done: false } },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted().done).toBeTruthy();

    // If done is true, clicking should emit 'undone'
    wrapper = mount(TodoComponent, {
      props: { todo: { id: 123, name: 'Mock TODO', done: true } },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted().undone).toBeTruthy();
  });
});
