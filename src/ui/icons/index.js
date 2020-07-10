const MENU_ICON_IMAGE = require('../icons/menu.png')

import React from 'react'
import {
    TouchableOpacity,
    Image
} from 'react-native'

export const MenuIcon = ({ onPress, customStyle }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Image source={MENU_ICON_IMAGE} style={[{width: 15, height: 15}, customStyle]} />
        </TouchableOpacity>
    )
}