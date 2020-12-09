
import React, { useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  Animated,
  ScrollView,
} from 'react-native';

import { Surface, Avatar } from 'react-native-paper';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import FeatherIcon from 'react-native-vector-icons/Feather'
import {Appbar, Caption, Button, Divider} from 'react-native-paper';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Constants } from 'react-native-unimodules';
import { Rating } from 'react-native-elements';
import ProgramImageOne from '../images/placeholders/fitness_program_one.jpg'
import ProgramImageTwo from '../images/placeholders/fitness_program_two.jpg'
import ProgramImageThree from '../images/placeholders/fitness_program_three.jpg'
import GymImageOne from '../images/placeholders/gym_one.jpg'
import GymImageTwo from '../images/placeholders/gym_two.png'
import GymImageThree from '../images/placeholders/gym_three.jpg'
import { SafeAreaView } from 'react-native-safe-area-context';
const imageArr = [
  ProgramImageOne,
  ProgramImageTwo,
  ProgramImageThree
]

const gymImageArr = [
  GymImageTwo,
  GymImageThree,
  GymImageOne,
]
const HEADER_MAX_HEIGHT = 120
const HEADER_MIN_HEIGHT = 70
const PROFILE_IMAGE_MAX_HEIGHT = 80
const PROFILE_IMAGE_MIN_HEIGHT = 40

const items = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
]

function Community({ navigation, route}) {
  const renderFeaturedTrainer = () => {
    return (
      <View style={{marginVertical: 10, paddingHorizontal: 10, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar.Image source={require('../images/placeholders/trainer_picture_girl_one.jpg')} size={40} />
        <View style={{paddingHorizontal: 10}}>
        <Text style={{fontSize: 15, fontFamily: 'Avenir'}}>
          Jessica Lawson
        </Text>
        <Text style={{fontSize: 13, fontFamily: 'Avenir'}}>
          NASM
        </Text>
        </View>
        </View>

        <Button
        style={{elevation: 0}}
        theme={{roundness: 12}}
         color="#1089ff" 
         mode="contained" 
         uppercase={false}>
          <Text>
            Follow
          </Text>
        </Button>
      
      </View>
    )
  }

  const renderProgramOffers = () => {
    if (true) {
      return (
      <View>
        <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        shouldRasterizeIOS={true}>
          {
          imageArr.map(item => {
            return (
              <Surface style={{margin: 10, backgroundColor: 'black', width: 150, height: 160, borderRadius: 12 }}>
                <Image source={item} style={{width: '100%', height: '100%', borderRadius: 12}} />
              </Surface>
            )
          })
          }
        </ScrollView>
      </View>
      )
    } else {
      return (
        <Caption>
        This gym has no current program offers.
      </Caption>
      )
    }
  }
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
    <SafeAreaView style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingVertical: Constants.statusBarHeight, paddingHorizontal: 10, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
        <FeatherIcon onPress={() => navigation.pop()} name="arrow-left" style={{alignSelf: 'flex-start'}} size={20} />
      </View>
          <View style={{backgroundColor: 'rgb(245, 245, 245)', height: 150, width: '100%'}}>
              <Carousel 
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width}
                data={gymImageArr}
                renderItem={(item) => {
                  return (
                   <Image source={item.item} style={{backgroundColor: 'red', flex: 1, width: '100%', height: '100%'}} />
                  )
                }}
              />

              <Animated.View style={{position: 'absolute', bottom: 0, paddingLeft: 10, flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, justifyContent: 'space-between'}}>
                <Text style={{fontFamily: 'Avenir-Black', fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                  Community Name
                </Text>

                <Pagination activeDotIndex={0} inactiveDotColor="white" inactiveDotScale={1} dotsLength={gymImageArr.length} dotColor="#1089ff" />
              </Animated.View>
          </View>

          <View style={{padding: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather1s name="home" style={{paddingHorizontal: 5}} />
                <Caption> 123 Roadkill Lane</Caption>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather1s name="wifi" style={{paddingHorizontal: 5}} />
                <Caption>www.communitygym.com</Caption>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather1s name="phone" style={{paddingHorizontal: 5}} />
                <Caption>123-456-7890</Caption>
              </View>
          </View>

       
          
          <View style={{padding: 5}}>
            <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Button uppercase={false} color="#1089ff" mode='contained' style={{elevation: 0}} contentStyle={{height: 40}} theme={{roundness: 12}}>
                <Text style={{fontFamily: 'Avenir-Medium', fontSize: 13}}>
                    Follow
                  </Text>
                </Button>

                <Button uppercase={false} color="rgb(245, 245, 245)" mode='contained' style={{elevation: 0}} contentStyle={{height: 40}} theme={{roundness: 12}}>
                  <Text style={{fontFamily: 'Avenir-Medium', fontSize: 13}}>
                    Rate and Review
                  </Text>
                </Button>
            </View>


            <Divider style={{alignSelf: 'center', width: Dimensions.get('window').width}} />

            <View style={{marginVertical: 15}}>
              <View style={{paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View>
                <Text>
                  Reviews
                </Text>
                <Rating ratingCount={5} showRating={false}  imageSize={10}/>
                </View>
                
                <Caption style={{color: '#1089ff'}}>
                  See all reviews
                </Caption>
              </View>
           
                <Caption>
                  No reviews
                </Caption>
              </View>

              <View style={{marginVertical: 10}}>
              <Text>
                  Events
                </Text>
                <Caption>
                  No upcoming events
                </Caption>
              </View>
          </View>

          <Divider />

          <View style={{paddingVertical: 10}}>
            <View style={{  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               
            <Text style={{fontFamily: 'Avenir-Medium', fontSize: 16, padding: 10}}>
             Trainer Roster
            </Text>
            <Text style={{paddingHorizontal:3, fontFamily: 'Avenir-Light', color: 'rgb(160, 160, 160)'}}>
                (5)
              </Text>
     
            </View>

            <Feather1s name="chevron-down" size={16} />
            </View>

           {renderFeaturedTrainer()}
          </View>

          <View>
            <View style={{  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               
            <Text style={{fontFamily: 'Avenir-Medium', fontSize: 16, padding: 10}}>
              Program Offers
            </Text>
            <Text style={{paddingHorizontal:5, fontFamily: 'Avenir-Light', color: 'rgb(160, 160, 160)'}}>
                (3)
              </Text>
     
            </View>

            <Feather1s name="chevron-down" size={16} />
            </View>

            
            {renderProgramOffers()}
          </View>
        </ScrollView>
        </SafeAreaView>
    </View>
  )
}

export default Community;