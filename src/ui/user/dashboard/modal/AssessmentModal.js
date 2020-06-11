import React from 'react';

    import {
        View,
        Text,
        StyleSheet,
        Modal,
        Button,
        SafeAreaView,
    } from 'react-native';
    
    import { 
        Paragraph,
        Title,
        Surface,
        Chip,
        Headline,
        Divider,
        Caption,
    } from 'react-native-paper';
    import { ScrollView } from 'react-native-gesture-handler';
    import { LinearGradient } from 'expo-linear-gradient';
    import LupaController from '../../../../controller/lupa/LupaController';
    
    import { connect } from 'react-redux';
    
    mapStateToProps = state => {
        return {
            lupa_data: state
        }
    }
    
    class AssessmentModal extends React.Component {
        constructor(props) {
            super(props);
    
            this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    
            this.state = {
                assessmentObject: this.props.assessmentObjectIn,
                userAssessmentData: {},
                parQArr: [
                    {
                      question: 'Has your doctor ever said that you have a heart condition and/or that you should only perform physical activity recommended by a doctor?',
                      check: false,
                      id: 0,
                    },
                    {
                      question: 'Do you feel pain in your chest when you perform physical activity?',
                      check: false,
                      id: 0,
                    },
                    {
                      question: 'In the past month, have you had chest pain when you were not performing any physical activity?',
                      check: false,
                      id: 0,
                    },
                    {
                      question: 'Do you lose your balance because of dizziness or do you ever lose consciousness?',
                      check: false,
                      id: 0,
                    },
                    {
                      question: 'Do you have a bone or joint problem that could be made worse by a chance in your physical activity?',
                      check: false,
                      id: 0,
                    },
                    {
                      question: 'Is your doctor currently prescribing any medication for your blood pressure or for a heart condition?',
                      check: false,
                      id: 0,
                    },
                    {
                      question: 'Do you know of any other reason why you should not engage in physical activity?',
                      check: false,
                      id: 0,
                    },
                ]
            }
        }
    
        async componentDidMount() {
           //await this.generateUserAssessment();
        }
    
        generateUserAssessment = async () => {
            let assessmentData;
            await this.LUPA_CONTROLLER_INSTANCE.getUserAssessment(this.state.assessmentObject.assessment_acronym, this.props.lupa_data.Users.currUserData.user_uuid).then(res => {
                assessmentData = res;
            });
    
            await this.setState({
                userAssessmentData: assessmentData
            })
        }
    
        mapData = () => {
            if (this.state.userAssessmentData.data)
            {
                this.state.userAssessmentData.data.map((submission, index, arr)=> {
                                return (
                                    <View style={{margin: 5}}>
                                        <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                                            <Text style={{paddingRight: 5}}>
                                                {index+1}.
                                            </Text>
                                            <Text style={{fontSize: 15, fontWeight: '300'}}>
                                                {submission.question}
                                            </Text>
                                        </View>
                                        <View style={{paddingLeft: 13, padding: 3, flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{fontWeight: '500'}}>
                                                Your Submission: {" "}
                                            </Text>
                                           <Text>
                                               {submission.answer == 'true' ? 'Yes' : 'No'}
                                           </Text>
                                        </View>
                                    </View>
                                )
                            })
            }
        }
    
        render() {
            return(
                <Modal 
                    style={styles.container} 
                    visible={this.props.isVisible} 
                    presentationStyle="fullScreen"
                    animated={true}
                    animationType="slide"
                    >
                    <SafeAreaView />
                    <ScrollView horizontal={false}>
                    <View style={{paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={{fontFamily: "Avenir-Roman"}}>
                            {this.state.assessmentObject.assessment_acronym}
                        </Text>
                            <Button title="Close" onPress={this.props.closeModalMethod}/>
                            </View>
                    <View style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                    <Title>
                    {this.state.assessmentObject.assessment_title}
                    </Title>
                    </View>
    
                    <View style={{backgroundColor: 'white', padding: 10}}>
                        <Paragraph style={{textAlign: 'center'}}>
                        {this.state.assessmentObject.assessment_description}
                        </Paragraph>
                    </View>
    
                    <Surface style={{alignSelf: 'center', alignItems:'center', justifyContent: 'center', margin: 8, borderRadius: 20, width: '90%', height: 20, elevation: 12}}>
                    <LinearGradient
                                      start={{ x: 0, y: 0 }}
                                      end={{ x: 1, y: 1 }}
              colors={[this.state.assessmentObject.assessment_colors[0], this.state.assessmentObject.assessment_colors[1], this.state.assessmentObject.assessment_colors[2]]}
              style={{ width: '100%', padding: 10, alignItems: 'center', borderRadius: 10}}>
     
            </LinearGradient>
                    </Surface>
    
                    <View style={{backgroundColor: 'transparent', flex: 1, padding: 20, justifyContent: 'space-evenly'}}>
                        {
                            this.state.parQArr.map((submission, index, arr)=> {
                                return (
                                    <View style={{margin: 5}}>
                                        <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
                                            <Text style={{paddingRight: 5}}>
                                                {index+1}.
                                            </Text>
                                            <Text style={{fontSize: 15, fontWeight: '300'}}>
                                                {submission.question}
                                            </Text>
                                        </View>
                                        <View style={{paddingLeft: 13, padding: 3, flexDirection: 'row', alignItems: 'center'}}>
                                            <Button title="Yes" />
                                            <Button title="No" />
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
    
                    <>
                    <Caption style={{padding: 10, textAlign: 'center', alignSelf: 'center'}}>
                        Lupa will never share your assessment results with anyone.  
                    </Caption>
                    </>
    
                    </ScrollView>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button  title="Reassess" />
                        <Button title="Share Results" />
                    </View>
                    <SafeAreaView />
                </Modal>
            )
        }
    }
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
            paddingLeft: 20,
            alignItems: 'center'
        },
        safeareaview: {
            flex: 1,
            backgroundColor: '#FFFFFF',
            paddingLeft: 20,
            alignItems: 'center'
        }
    })
    
    export default connect(mapStateToProps)(AssessmentModal);
