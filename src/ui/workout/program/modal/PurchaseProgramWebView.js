import React, { createRef } from 'react';

import {
    Dimensions,
    Modal,
} from 'react-native';

import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';

const mapStateToProps = (state, action) =>  {
    return {
        lupa_data: state
    }
}

class PurchaseProgramWebView extends React.Component {
    constructor(props) {
        super(props);
    }

    

    render() {
        const programUUID = this.props.programUUID;
        const programOwnerUUID = this.props.programOwnerUUID;
        const purchaserUUID = this.props.lupa_data.Users.currUserData.user_uuid;
        return (
            <Modal presentationStyle="formSheet" visible={this.props.isVisible}>
              <WebView 
                ref={ref => this.webviewRef = ref}
                style={{flex: 1, width: Dimensions.get('window').width}} 
                source={{uri: `https://lupa-cd0e3.web.app/${programOwnerUUID}/${programUUID}/${purchaserUUID}` }}
                />
            </Modal>
        )
    }
}

export default connect(mapStateToProps)(PurchaseProgramWebView);