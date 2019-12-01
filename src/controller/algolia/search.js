const functions  = ('firebase-functions')

exports = onCreateSearch = functions.firestore.document('users/{firstName}').onCreate(event => {
    const user = event.data.data();

    user.firstName = event.params.firstName;

    const index = client.initIndex('dev_GENSEARCH');
    return index.saveObject(user);
});