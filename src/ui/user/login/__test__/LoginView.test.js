// __tests__/Login-page-test.js
import React from 'react';
import LoginView from '../LoginView';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <LoginView />
    ).toJSON();
  expect(tree).toMatchSnapshot();
});