import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    act(() => {
      const tree = renderer.create(<App />);
      expect(tree.toJSON()).toBeDefined();
    });
  });
});
