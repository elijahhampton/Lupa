import React, { useState } from 'react'

import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import {
    Appbar, FAB,
    Divider,
} from 'react-native-paper'

import {
    Container,
    Left,
    Content,
    Tabs,
    Tab,
    Body,
    Right,
    Title,
    Header
} from 'native-base'

import { SearchBar} from 'react-native-elements'

import Search from './search/Search'
import Featured from './Featured'
import MyPrograms from './MyPrograms'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { MenuIcon } from './icons'
import { useNavigation } from '@react-navigation/native'
import ThinFeatherIcon from 'react-native-feather1s'
import { useSelector } from 'react-redux/lib/hooks/useSelector'
import LupaController from '../controller/lupa/LupaController'

function LupaHome(props) {
    const navigation = useNavigation()
    const LUPA_CONTROLLER_INSTANCE= LupaController.getInstance();

    const [searching, setIsSearching] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [searchResults, setSearchResults] = useState([])

    const performSearch = async searchQuery => {
        //If no search query then set state and return
        if (searchQuery == "" || searchQuery == "") {
            setIsSearching(true)
            setSearchValue("")
            setSearchResults([])

            return;
        }

        await setSearchResults([])
        await setIsSearching(true)
        await setSearchValue(searchQuery)

        await LUPA_CONTROLLER_INSTANCE.searchPrograms(searchQuery).then(searchData => {
            setSearchResults(searchData)
        })

        await setIsSearching(false)
    }

    const renderSearchResults = () => {
            return searchResults.map(result => {
                return (
                    <LargeProgramSearchResultCard program={result} />
                )
            })
        }

    return(
        <Container style={styles.root}>
            <Header hasTabs={true}>
                <Left>
                <MenuIcon customStyle={{ margin: 10 }} onPress={() => navigation.openDrawer()} />
                </Left>

                <Body>
                    <Title style={{fontFamily: 'Avenir-Roman'}}>
                        Book Trainers
                    </Title>
                </Body>

                <Right />
            </Header>
            <Tabs locked={true} tabContainerStyle={{backgroundColor: '#FFFFFF'}} tabBarBackgroundColor='#FFFFFF'>
             <Tab heading="Featured">
                <Featured />
             </Tab>
              <Tab heading="My Programs">
                <MyPrograms />
              </Tab>
            </Tabs>
    </Container>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    searchContainerStyle: {
        backgroundColor: "transparent", width: '90%'
    },
    inputContainerStyle: {
        backgroundColor: '#eeeeee',
    },
    inputStyle: {
        fontSize: 15, color: 'black', fontWeight: '800', fontFamily: 'avenir-roman'
    },
    iconContainer: {
        width: '10%', alignItems: 'center', justifyContent: 'center'
    },
})

export default LupaHome;