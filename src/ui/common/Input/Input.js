import React, { useReducer, useState, useEffect, forwardRef } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {
  TextInput
} from 'react-native-paper';

import Feather1s from 'react-native-feather1s/src/Feather1s';

import LUPA_DB from '../../../controller/firebase/firebase';

const INPUT_CHANGE = 'INPUT_CHANGE'
const INPUT_BLUR = 'INPUT_BLUR'

const inputReducer = (state, action) => {
    switch(action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid,
            }
        case INPUT_BLUR:
            return {
                ...state,
                touched: true 
            }
        default:
            return state
    }
}

const Input = (props) => {
    let TEXT_INPUT_COLOR = '#1089ff'
    const [focused, setIsFocused] = useState(false)
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initiallyValid,
        touched: false,
    });
    const [errorText, setErrorText] = useState("")

    const { onInputChange, id } = props;

    const getInputStateColor = () => {
      if (inputState.isValid) {
        return '#1089ff'
      }

      if (!inputState.isValid) {
        return 'red';
      }
    }

    useEffect(() => {
        if(inputState.touched) {
            onInputChange(id, inputState.value, inputState.isValid);
        }

    }, [inputState, onInputChange, id])



    const textChangeHandler = text => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
          setErrorText("This field is required.")
          isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
          isValid = false;
          setErrorText("Please enter a valid email address")
        }

        if (props.password && text.trim().length === 0) {
          isValid = false;
        }

        if (props.min != null && +text < props.min) {
          isValid = false;
        }

        if (props.max != null && +text > props.max) {
          isValid = false;
        }

        if (props.minLength != null && text.length < props.minLength && props.password && props.signUpInput) {
          isValid = false;
          setErrorText(`Password must be atleast ${8} characters long`)
        }

        dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });

        //temporary call to update text
        lostFocusHandler()
      };

      const lostFocusHandler = () => {
          setIsFocused(false)
          dispatch({ type: INPUT_BLUR })
      }

      
    
    return (
        <View style={styles.formControl}>
      <Text style={[styles.label, focused ? { color: 'rgba(13,71,161 ,1)' } : {color: 'rgb(142, 142, 147)'}]}>{props.label}</Text>
      <TextInput
        {...props}
        label={props.label}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor}
        returnKeyLabel="done"
        returnKeyType="done"
        keyboardAppearance="light"
        keyboardType={props.email ? 'email-address' : 'default'}
        mode="outlined"
        style={[focused ? styles.focusedInput : styles.input]}
        value={inputState.value}
        onChangeText={textChangeHandler}
      // onBlur={lostFocusHandler}
        secureTextEntry={props.secureTextEntry}
        theme={{
          colors: {
            primary: getInputStateColor()
          }
        }}
      />
      {!inputState.isValid && <Text style={{paddingHorizontal: 30, paddingVertical: 10}}>{errorText}</Text>}
    </View>
    )
}

const styles = StyleSheet.create({
    formControl: {
        width: '100%'
      },
      label: {
         
        color: '#212121',
        marginVertical: 8,
        fontWeight: '500',
        marginLeft: 20,
      },
      input: {
        width: '90%',
        marginHorizontal: 20,
        alignSelf: 'center',
        fontWeight: '400', 
        fontSize: 15,
        borderRadius: 0,
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        color: 'black',
      },
      focusedInput: {
        width: '90%',
        marginHorizontal: 20,
        alignSelf: 'center',
        fontWeight: '500', 
        fontSize: 15,
        borderRadius: 0,
        height: 50,
        paddingHorizontal: 10,
        color: 'black'
      }
  });

export default Input;