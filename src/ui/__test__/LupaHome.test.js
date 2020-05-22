import React from 'react';
import renderer from 'react-test-renderer';
import LupaHome from '../LupaHome';

describe('Some component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <LupaHome />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});