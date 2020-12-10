const MENU_ICON_IMAGE = require('../icons/menu.png')
const INFORMATION_ICON = require('../icons/information-icon.png')
import React from 'react'
import {
    TouchableOpacity,
    Image
} from 'react-native'

export const MenuIcon = ({ onPress, customStyle }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Image source={MENU_ICON_IMAGE} style={[{width: 15, height: 15, marginHorizontal: 10}, customStyle]} />
        </TouchableOpacity>
    )
}

export const InformationIcon = ({ onPress, customStyle }) => {
    return (
        <TouchableOpacity onPress={onPress}>
        <Image source={INFORMATION_ICON} style={[{width: 13, height: 13}, customStyle]} />
    </TouchableOpacity>
    )
}