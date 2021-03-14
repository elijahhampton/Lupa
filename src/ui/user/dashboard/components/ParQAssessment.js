
import React, { useEffect, useState } from 'react';
import { Dimensions, Text } from 'react-native';
import { Modal, View, StyleSheet } from 'react-native';
import { Appbar, Caption, Snackbar } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import LupaController from '../../../../controller/lupa/LupaController';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import LUPA_DB from '../../../../controller/firebase/firebase';
import { RefreshControl } from 'react-native';

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

function AssessmentQuestion({ question, captureInput, assessmentType, editable, input, value, id }) {
    const [inputText, setInputText] = useState("");
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const handleOnChangeText = (text) => {
        setInputText(text)
        captureInput(id, text)
    }


    return (
        <View style={{borderWidth: 1, alignItems: 'center', borderRadius: 5, borderColor: '#EEEEEE', marginVertical: 10, alignSelf: 'center', width: Dimensions.get('window').width - 20, padding: 10}}>
            <Text style={{paddingVertical: 10, color: '#AAAAAA'}}>
                {question.question}
            </Text>
            <View style={{width: '100%'}}>
                <Input 
                key={question.id}
                editable={editable}
                value={editable == true ? inputText : input}
                inputStyle={{color: editable == false ? '#AAAAAA' : 'black', fontSize: 15, padding: 10}}
                onChangeText={text => handleOnChangeText(text)}
                inputContainerStyle={{borderWidth: 1, borderRadius: 5,}} 
                />
            </View>
        </View>
    )
}

function ParQAssessment({ isVisible, closeModal, loadAnswers }) {
    const [inputTexts, setInputTexts] = useState(new Array(questions.length).fill(""))
const [loadedPARQ, setLoadedParQ] = useState([]);
const [loadedParQFound, setLoadedParQFound] = useState(false);
const [ready, setReady] = useState(false);
const [refreshing, setRefreshing] = useState(false);
const [snackBarVisible, setSnackBarVisible] = useState(false);
const [snackBarReason, setSnackBarReason] = useState("")

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const handleValidateForm = () => {
        for (let i = 0; i < inputTexts.length; i++) {
            if (inputTexts[i].length == 0) {
                return false;
            }
        }

        return true;
    }

    const captureInput = (id, text) => {
        console.log(id)
        console.log(text)
        let updatedTexts = inputTexts;
        updatedTexts[id] = text;
        setInputTexts(updatedTexts)
    }

    const handleOnSubmit = () => {
        LUPA_CONTROLLER_INSTANCE.submitAssessment(currUserData.user_uuid, "PARQ", inputTexts);
        handleOnCloseModal()
    }

    handleOnCloseModal = async () => {
        const formValidated = await handleValidateForm();
        if (formValidated == false) {
           // setSnackBarReason("You have left one or more inputs blank.")
           // setSnackBarVisible(true);
           closeModal()
        } else {
            setReady(false);
            closeModal();
        }
    }

    const renderQuestions = () => {
        if (loadedParQFound == false) {
            return questions.map(question => {
                return <AssessmentQuestion  id={question.id} editable={true} key={question.id} question={question} assessmentType="PARQ" captureInput={(id, text) => captureInput(id, text)} />
            })
        }

        if (loadAnswers == true && loadedParQFound == true) {
            if (ready == true && loadedParQFound == true) {
                return questions.map((question, index, arr) => {
                    return <AssessmentQuestion id={question.id} editable={false} key={question.id} question={question} input={loadedPARQ['assessment'][index].response} assessmentType="PARQ" captureInput={(id, text) => captureInput(id, text)} />
                })
            }
        } else if (loadAnswers == true && loadedParQFound == false) {
            return questions.map(question => {
                return <AssessmentQuestion  id={question.id} editable={true} key={question.id} question={question} assessmentType="PARQ" captureInput={(id, text) => captureInput(id, text)} />
            })
        }else {
            return (
                <View style={{padding: 20, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Caption>
                        There was an error loading your parq assessment.  Please try refreshing the page
                    </Caption>
                </View>
            )
        }
    }

    const handleOnRefresh = async () => {
        setReady(false);
        setRefreshing(true)
        await loadParQData().then(() => {
            setRefreshing(false)
            setReady(true)
        })
    }   

    const loadParQData = async () => {
        const userAssessments = currUserData.assessments;
            let id = -1;
            for (let i = 0; i < userAssessments.length; i++)
            {
                if (userAssessments[i].includes('PARQ')) {
                    id = userAssessments[i].toString().substring(4);
                    continue;
                }
            }

            if (id != -1) {
                await LUPA_DB.collection('assessments').doc(id).get().then(documentSnapshot => {
                    const data = documentSnapshot.data();
                    setLoadedParQ(data);
                    setLoadedParQFound(true);
                })
                .catch(error => {
                
                    setLoadedParQFound(false);
                    setReady(false);
                })
            } else {
          
                setLoadedParQFound(false);
                setReady(false);
            }
    }

    useEffect(() => {
        async function loadPARQAnswers() {
            const userAssessments = currUserData.assessments;
            let id = -1;
            for (let i = 0; i < userAssessments.length; i++)
            {
                if (userAssessments[i].includes('PARQ')) {
                    id = userAssessments[i].toString().substring(4);
                    continue;
                }
            }

            if (id != -1) {
                await LUPA_DB.collection('assessments').doc(id).get().then(documentSnapshot => {
                    const data = documentSnapshot.data();
                    setLoadedParQ(data);
                    setLoadedParQFound(true);
                })
                .catch(error => {
                
                    setLoadedParQFound(false);
                    setReady(false);
                })
            } else {
          
                setLoadedParQFound(false);
                setReady(false);
            }
        }

        loadPARQAnswers()
        .then(() => {
            setReady(true);
        })
        .catch(error => {
            setReady(false);
        })
    }, [])


    return (
        <Modal presentationStyle="fullScreen" visible={isVisible}>
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                <Appbar.BackAction onPress={handleOnCloseModal} />
                <Appbar.Content title="PARQ Assessment" />
                <Appbar.Action onPress={handleOnSubmit} icon={() => <FeatherIcon name="check" size={20} />} disabled={loadedParQFound == true} />
            </Appbar.Header>
            <View style={styles.container}>
                
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />}>
                    <View style={{alignItems: 'center', justifyContent: 'center', padding: 20}}>
                        <Caption style={{color: '#23374d'}}>
                            You must take a parq before entering into your first session with a trainer or if you don't have one on file.
                        </Caption>
                    </View>
                    {renderQuestions()}
                 </ScrollView>
            </View>
            <Snackbar
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
        action={{
          label: 'Okay',
          onPress: () => {
            // Do something
          },
        }}>
        {snackBarReason}
      </Snackbar>
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