import {shallow} from 'enzyme';
import React from 'react';
import App from './App';

test('renders without failing', () => {
  const wrapper = shallow(<App />);

  expect(wrapper).toBeDefined();
});

test('able to change theme based on context', () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  expect(wrapper.state('theme')).toEqual('light');
  instance.contextUpdate({theme: 'dark'}, ['theme']);
  expect(wrapper.state('theme')).toEqual('dark');
});
