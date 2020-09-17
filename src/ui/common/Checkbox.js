import React from 'react';

import {
    Checkbox
} from 'react-native-paper';

const LupaCheckbox = ({ checked }) => {
    return (
        <Checkbox.Android color="#1088ff" onPress={() => {}} status={checked} />
    )
}

export default LupaCheckbox;