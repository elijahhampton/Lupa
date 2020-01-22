<View style={{display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around", padding: 10}}>

<View style={styles.header}>

<Avatar.Image source={this.state.packImageSource} size={130} label="EH" />
<Text style={{fontSize: 20, fontWeight: "400", padding: 5}}>
    Pick an avatar for your pack
</Text>
</View>

{ /* */}
<View style={{ flex: 0.5, flexDirection: "column" }}>
<Text style={styles.sectionText}>
Pack Name
</Text>
<View>
<Input inputContainerStyle={{borderColor: "transparent"}} placeholder="Enter a name for your pack" />
</View>
</View>

{ /* */}
<View style={{ flex: 0.5, flexDirection: "column" }}>
<Text style={styles.sectionText}>
Pack Objective
</Text>
<View>
<View>
<Input inputContainerStyle={{borderColor: "transparent"}} placeholder="Enter a purpose for your pack" />
</View>
</View>
</View>

{ /* */}
<View style={{ flex: 1, flexDirection: "column", marginBottom: 10 }}>
<Text style={styles.sectionText}>
Privacy Preference
</Text>
<View style={{ flexDirection: "column" }}>

<View style={{flexDirection: "column", padding: 10 }}>
        <Text style={{fontWeight: "bold"}}>
            Public
    </Text>

    <Caption>
        This pack will be public for all users to see on the explore and search pages
</Caption>
</View>


<View style={{flexDirection: "column", padding: 10}}>
        <Text style={{fontWeight: "bold"}}>
            Private
    </Text>

    <Caption>
    Only users inside you invite and users in this pack will be able to see it on the explore and search pages
</Caption>
</View>
</View>



</View>

{ /* */}
<View style={{ flex: 1, flexDirection: "column" }}>
<Text style={styles.sectionText}>
Pack Type
</Text>

<View style={{ flexDirection: "column" }}>

<View style={{ flexDirection: "column", padding: 10}}>
        <Text style={{fontWeight: "bold"}}>
            Global
    </Text>

    <Caption>
        Users can join your pack for free
</Caption>
</View>

<View style={{flexDirection: "column", padding: 10}}>
        <Text style={{fontWeight: "bold"}}>
            Subscription
    </Text>

    <Caption>
        Users will have to pay a subscription fee to join this pack
</Caption>
</View>

</View>
</View>

                        </View>