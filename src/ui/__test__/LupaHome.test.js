import React from 'react';
import renderer from 'react-test-renderer';
import LupaHome from '../LupaHome';

describe('LupaHome Component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <LupaHome />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});