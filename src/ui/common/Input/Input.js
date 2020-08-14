import React, { useReducer, useState, useEffect } from 'react';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
} from 'react-native';

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

const Input = props => {
    const [focused, setIsFocused] = useState(false)
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initiallyValid,
        touched: false,
    });

    const { onInputChange, id } = props;

    useEffect(() => {
        if(inputState.touched) {
            onInputChange(id, inputState.value, inputState.isValid);
        }

    }, [inputState, onInputChange, id])



    const textChangeHandler = text => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
          isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
          isValid = false;
        }
        if (props.min != null && +text < props.min) {
          isValid = false;
        }
        if (props.max != null && +text > props.max) {
          isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
          isValid = false;
        }
        dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
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
        style={[focused ? styles.focusedInput : styles.input]}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
        
      />
      {!inputState.isValid && <Text>{props.errorText}</Text>}
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
        borderWidth: 1.5,
        fontWeight: '400', 
        fontSize: 15,
        borderRadius: 0,
        height: 40,
        paddingHorizontal: 10,
        borderColor: '#212121',
        borderWidth: 0.5,
        borderRadius: 5,
        backgroundColor: 'white',
        color: 'black'
      },
      focusedInput: {
        width: '90%',
        marginHorizontal: 20,
        alignSelf: 'center',
        borderWidth: 1.5,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        fontWeight: '500', 
        fontSize: 15,
        borderRadius: 0,
        height: 40,
        paddingHorizontal: 10,
        borderColor: '#1089ff',
        borderBottomColor: '#1089ff',
        color: 'black'
      }
  });

export default Input;