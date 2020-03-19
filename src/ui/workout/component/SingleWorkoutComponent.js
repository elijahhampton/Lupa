import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Button as NativeButton,
    Modal
} from 'react-native';

import {
    Caption,
    Headline
} from 'react-native-paper';

import {
    IconButton,
    ProgressBar,
} from 'react-native-paper';

const SingleWorkoutComponentModal = props => {
    return (
                <Modal visible={props.isOpen} presentationStyle="pageSheet" animationType="slide" style={styles.root}>
                    <NativeButton title="Close" style={{alignSelf: 'center'}} onPress={() => props.closeModalMethod()}/>
                    <ScrollView shouldRasterizeIOS={true} showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 10, flexDirection: 'column', flexGrow: 2, justifyContent: 'space-between'}}>
                        <Headline>
                            Workout Name
                        </Headline>

                        <Text style={{fontSize: 15, fontWeight: '500'}}>
                        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis 
                        et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni 
                        dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non 
                        numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis 
                        suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, 
                        vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
                        </Text>

                        <View>
                        <Caption>
                            Enter the data below and we will provide you with a custom blah.  You can use this at anytime if you want us to recalculate blah.
                        </Caption>
                        </View>
                        
                        <View>
                        <Text>
                            Self Report
                        </Text>
                        </View>

                        <>
                        <Text>
                            Suggested By
                        </Text>
                            <ScrollView showsHorizontalScrollIndicator={true} shouldRasterizeIOS={true} contentContainerStyle={{padding: 5, alignItems: 'center', justifyContent: 'space-around'}}>

                            </ScrollView>  
                        </>

                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <IconButton icon="favorite_border" />
                            <IconButton icon="share" />
                        </View>
                    </ScrollView>
                </Modal>
    )
}

class SingleWorkoutComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 0.6,
            workoutModalIsOpen: false,
        }

    }

    handleModalOpen = () => {
        this.setState({ workoutModalIsOpen: true })
    }

    handleModalClose = () => {
        this.setState({ workoutModalIsOpen: false })
    }

    render() {
        return (
            <>
            <TouchableOpacity onPress={() => this.handleModalOpen()}>
            <View style={{width: '100%', height: 'auto', padding: 15, flexDirection: 'column', justifyContent: 'space-around'}}>
                <View style={{flex: 1}}>
                    <Text style={{alignSelf: 'flex-start', fontWeight: "600"}}>
                        Workout Name
                    </Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                    <View style={{width: '100%'}}>
                        <ProgressBar progress={this.state.progress} color="#1A237E" visible={true} style={{width: '60%'}} />
                    </View>
                        <Text style={{fontWeight: 'bold', margin: 5, color: "#1A237E"}}>
                            0%
                        </Text>
                </View>
            </View>
            </TouchableOpacity>
            <SingleWorkoutComponentModal isOpen={this.state.workoutModalIsOpen} closeModalMethod={this.handleModalClose}/>
            </>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        margin: 0,
        display: 'flex',
    },
    container: {
        flex: 1,
    }
});



export default SingleWorkoutComponent;