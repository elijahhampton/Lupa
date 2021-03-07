
import React, { useState } from 'react';
import { Dimensions, Text } from 'react-native';
import { Modal, View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import LupaController from '../../../../controller/lupa/LupaController';
import { useSelector } from 'react-redux/lib/hooks/useSelector';

const questions = [
    {
        id: 0,
        question: 'Has your doctor ever sadi that you have a heart conditiona nd that you should onlu prtgotm physical activity recommended by a doctor?',
    },
    {
        id: 1,
        question: 'Do you feel pain in your chest when you perform physical activity?',
    },
    {
        id: 2,
        question: 'In the past month, have you had chest pain when you were not performing any physical activity?',
    },
    {
        id: 3,
        question: 'Do you lose your balance because of dizziness or do you ever lose consciousness?',
    },
    {
        id: 4,
        question: 'Do you have a bone or joint problem that could be made worse by a change in your physical?',
    },
    {
        id: 5,
        question: 'Is your doctor currently prescribing any medication for your blood pressure or for your heart condition?',
    },
    {
        id: 6,
        question: 'Do you know of any other reason why you should not engage in physical activity?',
    },
]

function AssessmentQuestion({ question, captureInput, assessmentType }) {
    const [inputText, setInputText] = useState("");
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    handleOnChangeText = (text) => {
        setInputText(text)
        captureInput(question.id, inputText)
    }

    return (
        <View style={{borderWidth: 1, alignItems: 'center', borderRadius: 5, borderColor: '#EEEEEE', marginVertical: 10, alignSelf: 'center', width: Dimensions.get('window').width - 20, padding: 10}}>
            <Text style={{paddingVertical: 10, color: '#AAAAAA'}}>
                {question.question}
            </Text>
            <View style={{width: '100%'}}>
                <Input 
                value={inputText}
                onChangeText={text => setInputText(text)}
                inputContainerStyle={{borderWidth: 1, borderRadius: 5,}} 
                />
            </View>
        </View>
    )
}

function ParQAssessment({ isVisible, closeModal }) {
    const [inputTexts, setInputTexts] = useState(new Array(questions.length))

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const captureInput = (id, text) => {
        let updatedTexts = inputTexts;
        updatedTexts[id] = text;
        setInputTexts(updatedTexts)
    }

    const handleOnSubmit = () => {
        LUPA_CONTROLLER_INSTANCE.submitAssessment(currUserData.user_uuid, "PARQ", inputTexts);
        closeModal()
    }


    return (
        <Modal presentationStyle="fullScreen" visible={isVisible}>
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                <Appbar.BackAction />
                <Appbar.Content title="PARQ Assessment" />
                <Appbar.Action onPress={handleOnSubmit} icon={() => <FeatherIcon name="check" size={20} />} />
            </Appbar.Header>
            <View style={styles.container}>
                <ScrollView>
                {
                    questions.map(question => {
                        return <AssessmentQuestion key={question.id} question={question} assessmentType="PARQ" captureInput={(id, text) => captureInput(id, text)} />
                    })
                }
                 </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    controlContainer: {
        width: '40%',
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        height: 30,
        justifyContent: 'space-evenly',
    }
})

export default ParQAssessment;