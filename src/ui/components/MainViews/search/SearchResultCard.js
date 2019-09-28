import React from 'react';

import {
    View,
    StyleSheet,
    Text
} from 'react-native';

class SearchResultCard extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <View style={styles.cardContainer}>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        display: "flex",
    }
});

export default SearchResultCard;