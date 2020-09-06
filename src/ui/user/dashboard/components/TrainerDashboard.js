import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    ScrollView,
    RefreshControl
} from 'react-native';

import {
    Button,
    Divider,
    Appbar,
    Surface,
    DataTable,
    Caption
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'

import { LineChart } from 'react-native-chart-kit'
import { useNavigation } from '@react-navigation/native';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { MenuIcon } from '../../../icons';
import LupaController from '../../../../controller/lupa/LupaController';
import LOG from '../../../../common/Logger';

function TrainerDashboard(props) {
    const navigation = useNavigation();

    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({
        purchaseMetaData: {
            purchase_history: [],
            gross_pay: 0,
            net_pay: 0,
        },
        interactions: {
            numInteractions: 0,
            shares: 0,
            views: 0
        }
    })
    const [lastUpdated, setLastUpdated] = useState(new Date().getTime());
    const [componentReady, setComponentReady] = useState(false);
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                await LUPA_CONTROLLER_INSTANCE.fetchDashboardData().then(data => {
                     setData(data);
                 });
            } catch(error) {
                setData({})
                alert(error);
                setComponentReady(false)
            }
        }

        LOG('TrainerDashboard.js', 'Running useEffect')
        setComponentReady(false);
        fetchDashboardData();
        setComponentReady(true)
    }, [componentReady]);

    const handleOnRefresh =  React.useCallback(() => {
        setRefreshing(true);

        LUPA_CONTROLLER_INSTANCE.fetchDashboardData().then(data => {
            setData(data);
        }).then(() => {
            setLastUpdated(new Date().getTime())
            setRefreshing(false);
        })
    }, []);

    const renderDataTableRows = () => {
        if (componentReady === false || typeof(data) == 'undefined' || data.purchaseMetaData.purchase_history.length === 0) {
            return (
                <Caption onPress={() => navigation.push('CreatePost')} style={{paddingHorizontal: 10, alignSelf: 'center', paddingVertical: 10}}>
                You haven't received any program purchases.{" "}
                <Caption style={{color: '#1089ff',}}>
                    Create a vlog to advertise your content.
                </Caption> 
                </Caption>
            )
        }

        return data.purchaseMetaData.purchase_history.map((purchaseHistory, index, arr) => {
            return (
                <DataTable.Row>
                <DataTable.Cell>{purchaseHistory.purchaser} </DataTable.Cell>
                <DataTable.Cell >{purchaseHistory.date_purchased.seconds}</DataTable.Cell>
                <DataTable.Cell>{purchaseHistory.program_name}</DataTable.Cell>
              </DataTable.Row>
            )
        })
    }

    const renderDataTablePagination = () => {
        if (typeof(data) == 'undefined' || data.purchaseMetaData.purchase_history.length === 0 || componentReady === false) {
            return (
                null
            )
        } else {
            <DataTable.Pagination
                page={1}
                numberOfPages={3}
                onPageChange={(page) => { console.log(page); }}
                label="1-1 of 1"
                
              />
        }
    }

    const renderGrossPay = () => {
        if (typeof(data) == 'undefined') {
            return 0;
        }

        try {
            return data.purchaseMetaData.gross_pay
        } catch(error) {
            return 0;
        }
    }

    const renderNetPay = () => {
        if (typeof(data) == 'undefined') {
            return 0;
        }

        try {
            return data.purchaseMetaData.net_pay;
        } catch(error) {
            return 0;
        }
    }

    const renderSales = () => {
        if (typeof(data) == 'undefined' || componentReady === false) {
            return 0;
        }

        try {
            return data.purchaseMetaData.purchase_history.length;
        } catch(error) {
            return 0;
        }
    }

    const renderShares = () => {
        if (typeof(data) == 'undefined') {
            return 0;
        }

        try {
            return data.interactions.shares;
        } catch(error) {
            return 0;
        }
    }

    const renderViews = () => {
        if (typeof(data) == 'undefined') {
            return 0;
        }

        try {
            return data.interactions.views;
        } catch(error) {
            return 0;
        }
    }

    return (
        componentReady === true ?
        <View style={{
            flex: 1,
            backgroundColor: 'rgb(247, 247, 246)'
        }}>
             <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 3,}}>
                <MenuIcon onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Dashboard"  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
                <Appbar.Action onPress={() => this.props.navigation.push('Messages')} icon={() => <Feather1s thin={true} name="mail" size={20} />}/>
              <Appbar.Action onPress={() => this.props.navigation.push('Notifications')} icon={() => <Feather1s thin={true} name="bell" size={20} />}/>
</Appbar.Header> 
 <ScrollView refreshControl={<RefreshControl refreshing={refreshing}  onRefresh={handleOnRefresh} />} contentContainerStyle={{flexGrow: 2, justifyContent: 'space-evenly'}}>

 <View>
                        <Text style={{padding: 10,   fontSize: 18}}>
                           Purchase History
                        </Text>
                        <DataTable>
        <DataTable.Header>
          <DataTable.Title>User</DataTable.Title>
          <DataTable.Title >Purchase Date</DataTable.Title>
          <DataTable.Title >Program</DataTable.Title>
        </DataTable.Header>
        {renderDataTableRows()}
        {renderDataTablePagination()}
      </DataTable>
                        </View>

                        <Divider style={{ marginVertical: 10, height: 8, backgroundColor: '#EEEEEE' }} />

<View style={{ }}>
    <Text style={{ padding: 10, fontSize: 18 }}>
        Interactions
        </Text>

    <LineChart
        bezier
        data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jul", "Aug", "Sep"],
            datasets: [
                {
                    data: [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                    ]
                }
            ]
        }}
        width={Dimensions.get('window').width} // from react-native
        height={200}
        yAxisLabel="N"
        withHorizontalLabels={true}
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
            strokeWidth: 0.5,
            backgroundColor: "rgb(247, 247, 246)",
            backgroundGradientFrom: "rgb(247, 247, 246)",
            backgroundGradientTo: "rgb(247, 247, 246)",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 0) => `rgba(33, 150, 243, ${opacity})`,
            labelColor: (opacity = 0) => `rgba(33, 150, 243, ${opacity})`,
            style: {
                borderRadius: 0
            },
            propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#FFFFFF"
            },
            propsForBackgroundLines: {
                backgroundColor: 'transparent',
                color: 'transparent',
                stroke: 'transparent',
            }
        }}
        style={{
            borderRadius: 0
        }}
    />

    <Caption style={{alignSelf: 'flex-end', paddingRight: 20}}>
        Updated {new Date().getTime() - Math.round(lastUpdated)} seconds ago
    </Caption>

   {/* <Divider style={{ marginHorizontal: 30, marginVertical: 5 }} />

    <Button color="#1089ff" uppercase={false} mode="text" style={{ alignSelf: 'flex-end' }} onPress={() => navigation.push('TrainerInsights')}>
        Trainer Insights
<FeatherIcon name="arrow-right" size={12} />
    </Button> */}
</View>

<Divider style={{ marginVertical: 10, height: 8, backgroundColor: '#EEEEEE' }} />




<View style={{padding: 10}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <View style={{flex: 1}}>
                                <Text style={{  fontSize: 18}}>
                            Overview
                        </Text>
                                </View>
                                
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <Text>
                        <Text style={{fontSize: 15}}>
                            Gross:{" "}
                        </Text>
                        <Text style={{fontSize: 15}}>
                            ${renderGrossPay()}
                        </Text>
                        </Text>

                        <Text>
                        <Text style={{fontSize: 15}}>
                            Net:{" "}
                        </Text>
                        <Text style={{fontSize: 15}}>
                            ${renderNetPay()}
                        </Text>
                        </Text>
                    </View>
                                </View>
  
                            </View>


                            <View>
                            <ScrollView horizontal contentContainerStyle={{alignItems: 'center'}}>
                                <Surface style={{margin: 10, elevation: 0, width: 135, height: 130, borderRadius: 20, backgroundColor: 'rgb(229, 229, 234)'}}>
                                    <View style={{position: 'absolute', top: 0, left: 0, margin: 5, width: 45, height: 45, borderRadius: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                                        <FeatherIcon name="shopping-cart" color="rgb(33,150,243)" size={20} />
                                    </View> 

                                    <View style={{padding: 10, position: 'absolute', bottom: 0, width: '100%'}}>
                                        <Text style={{color: 'rgb(99, 99, 102)', fontSize: 15}}>
                                            Sales
                                        </Text>
                                        <Text style={{fontSize: 20}}>
                                            {renderSales()}
                                        </Text>
                                    </View>
                                </Surface>

                                <Surface style={{margin: 10, elevation: 0, width: 135, height: 130, borderRadius: 20, backgroundColor: 'rgb(229, 229, 234)'}}>
                                    <View style={{position: 'absolute', top: 0, left: 0, margin: 5, width: 45, height: 45, borderRadius: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                                        <FeatherIcon name="share-2" color="rgb(33,150,243)" size={20} />
                                    </View> 

                                    <View style={{padding: 10, position: 'absolute', bottom: 0, width: '100%'}}>
                                        <Text style={{color: 'rgb(99, 99, 102)', fontSize: 15}}>
                                            Shares
                                        </Text>
                                        <Text style={{fontSize: 20}}>
                                            {renderShares()}
                                        </Text>
                                    </View>
                                </Surface>

                                <Surface style={{margin: 10, elevation: 0, width: 135, height: 130, borderRadius: 20, backgroundColor: 'rgb(229, 229, 234)'}}>
                                    <View style={{position: 'absolute', top: 0, left: 0, margin: 5, width: 45, height: 45, borderRadius: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                                        <FeatherIcon name="eye" color="rgb(33,150,243)" size={20} />
                                    </View> 

                                    <View style={{padding: 10, position: 'absolute', bottom: 0, width: '100%'}}>
                                        <Text style={{color: 'rgb(99, 99, 102)', fontSize: 15}}>
                                            Views
                                        </Text>
                                        <Text style={{fontSize: 20}}>
                                        {renderViews()}
                                        </Text>
                                    </View>
                                </Surface>

                            </ScrollView>
                        </View>

</ScrollView>
        </View>
        :
        <View style={{flex: 1, backgroundColor: 'rgb(247 ,247, 247)'}} />
    )
}

export default TrainerDashboard;