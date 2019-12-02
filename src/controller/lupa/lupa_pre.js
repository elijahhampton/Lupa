import React from 'react';
import { Feather as Icon } from '@expo/vector-icons';

export const interestData = [
    'Yoga',
    'High Intensity Training',
    'Running',
    'Training',
    'Squats',
    'Interest 6',
    'Interest 7',
    'Interest 8',
    'Interest 9',
    'Interset 10',
]

export const timesOfDay = [
    Morning = {
        title: 'Morning',
        times: '4:00 AM - 11:00 AM',
        icon: <Icon name="sunrise" size={15} />,
    },
    Midday = {
        title: 'Midday',
        times: '11:00 AM - 3:00 PM',
        icon: <Icon name="sun" />
    },
    Afternoon = {
        title: 'Afternoon',
        times: '3:00 PM - 8:00 PM',
        icon: <Icon name="sunset" />
    },
    Night = {
        title: 'Evening',
        times: '8:00 PM - 2:00 AM',
        icon: <Icon name="moon" />
    }
]