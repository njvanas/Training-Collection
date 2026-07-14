import { describe, expect, it } from 'vitest';
import { getPreferredTheme, getStoredTheme } from './theme';

describe('theme', () => {
  it('defaults to light when nothing is stored', () => {
    expect(getStoredTheme()).toBeNull();
    expect(getPreferredTheme()).toBe('light');
  });
});
