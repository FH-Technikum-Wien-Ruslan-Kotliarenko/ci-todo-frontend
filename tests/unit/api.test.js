// tests/unit/api.test.js
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import * as api from '../../src/api';

describe('api.js', () => {
  it('calls the correct endpoint for readTodos', async () => {
    // Mock axios.get
    const mockData = [{ id: 1, name: 'Test TODO' }];
    vi.spyOn(axios, 'get').mockResolvedValue({ data: mockData });

    const result = await api.readTodos();

    expect(axios.get).toHaveBeenCalledWith('/api/todos');
    expect(result).toEqual(mockData);
  });
});
