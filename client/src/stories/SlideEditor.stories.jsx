import React from 'react';
import SlideEditor from '../components/SlideEditor';
import { SlidesContext } from '../context/SlidesContext';

export default {
title: 'Components/SlideEditor',
component: SlideEditor,
decorators: [
(Story) => {
const mockSlidesContext = {
slides: [],
currentIndex: 0,
currentSlide: {
id: 1,
title: 'Initial Title',
content: '## Edit me',
layout: 'default',
order: 1,
},
setCurrentIndex: () => {},
updateSlide: (id, slide) => console.log('Mock update', id, slide),
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

const Template = (args) => <SlideEditor {...args} />;

export const Default = Template.bind({});
Default.args = {
slide: {
id: 1,
title: 'Slide Title',
content: '## Edit me',
layout: 'default',
order: 1,
},
onSave: (id, updatedSlide) => console.log('Slide saved', id, updatedSlide),
onCancel: () => console.log('Cancelled'),
};
