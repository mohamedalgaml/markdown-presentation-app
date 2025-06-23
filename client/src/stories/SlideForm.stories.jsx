import React from 'react';
import SlideForm from '../components/SlideForm';
import { SlidesContext } from '../context/SlidesContext';

export default {
title: 'Components/SlideForm',
component: SlideForm,
decorators: [
(Story) => {
const mockSlidesContext = {
slides: [
{ id: 1, title: 'Slide 1', content: 'Content 1', layout: 'default' },
{ id: 2, title: 'Slide 2', content: 'Content 2', layout: 'default' },
{ id: 3, title: 'Slide 3', content: 'Content 3', layout: 'default' },
],
currentIndex: 2,
setCurrentIndex: () => {},
addSlide: (slide) => console.log('Mock add slide:', slide),
loading: false,
error: null,
};

return (
<SlidesContext.Provider value={mockSlidesContext}>
<Story />
</SlidesContext.Provider>
);
},
],
};

const Template = (args) => <SlideForm {...args} />;

export const Default = Template.bind({});
Default.args = {
slideCount: 3,
};
