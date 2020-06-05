import React from 'react';
import Link from '../Link.react';
import Lupa from '../Lupa'
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Lupa></Lupa>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});