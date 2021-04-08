import * as React from 'react'
import { View, Text } from 'react-native'
import PDFReader from 'rn-pdf-reader-js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function Reader (props) {

    const uri = props.navigation.getParam('uri') + '.pdf';
    const name = props.navigation.getParam('name') 
    console.log(uri)

    return (
        <View style = {{flex : 1}}>

            <View style = {{height : hp('5%'),backgroundColor : 'white',borderBottomWidth : 1,flexDirection : 'column'}}>
                <Text style = {{color : 'black', fontSize : hp('2%'), fontWeight : 'bold',textAlign : 'center',marginTop : hp('1%')}}>{name}</Text>
            </View>

            <PDFReader
                source={{
                    uri: uri,
                }}
                withScroll = {true}
                withPinchZoom = {true}
                customStyle = {{
                    readerContainer : {
                        backgroundColor : '#E1DCDE'
                    },

                }}
            />
        </View>
    )
}