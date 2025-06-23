import React from 'react';
import ProgressBar from '../components/ProgressBar';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
};

const Template = (args) => <ProgressBar {...args} />;

export const Halfway = Template.bind({});
Halfway.args = {
  current: 2,
  total: 4,
};

export const Start = Template.bind({});
Start.args = {
  current: 0,
  total: 5,
};

export const Complete = Template.bind({});
Complete.args = {
  current: 5,
  total: 5,
};
