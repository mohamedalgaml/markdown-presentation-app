import React from 'react';
import SlideViewer from '../components/SlideViewer';
import { SlidesContext } from '../context/SlidesContext';

export default {
title: 'Components/SlideViewer',
component: SlideViewer,
decorators: [
(Story) => {
const mockSlidesContext = {
slides: [
{
id: 1,
title: 'Welcome',
content: '# Hello World\nThis is a **markdown** slide.',
layout: 'default',
},
],
currentIndex: 0,
};

return (
<SlidesContext.Provider value={mockSlidesContext}>
<Story />
</SlidesContext.Provider>
);
},
],
};

const Template = (args) => <SlideViewer {...args} />;

export const Default = Template.bind({});
Default.args = {};
