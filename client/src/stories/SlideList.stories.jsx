import React from 'react';
import SlideList from '../components/SlideList';

export default {
title: 'Components/SlideList',
component: SlideList,
};

const Template = (args) => <SlideList {...args} />;

export const Default = Template.bind({});
Default.args = {
slides: [
{
id: 1,
title: 'Slide 1',
content: '# Slide 1\nThis is the content of slide 1',
layout: 'default',
order: 0,
},
{
id: 2,
title: 'Slide 2',
content: '# Slide 2\nThis is the content of slide 2',
layout: 'code',
order: 1,
},
],
onSelect: (slide) => console.log('Selected slide:', slide),
onDelete: (id) => console.log('Deleted slide with ID:', id),
};
