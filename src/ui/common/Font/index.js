import * as Font from 'expo-font';

async function loadFonts() {
    await Font.loadAsync({
    'avenir-book': require('./avenir-font/Avenir-Book.ttf'),
    'avenir-roman': require('./avenir-font/Avenir-Roman.ttf'),
    'avenir-light': require('./avenir-font/Avenir-Light.ttf'),
    'avenir-light-book': require('./avenir-font/AvenirLTStd-Book.otf'),
    'avenir-light-light': require('./avenir-font/AvenirLTStd-Light.otf'),
    'avenir-light-roman': require('./avenir-font/AvenirLTStd-Roman.otf'),
    'avenir-next-bold': require('./avenir-font/avenir-next-lt-pro-bold.otf'),
    'din': require('./din-font/D-DIN.otf'),
    'din-bold': require('./din-font/D-DIN-Bold.otf'),
    'din-condensed': require('./din-font/D-DINCondensed.otf'),
    'din-condensed-bold': require('./din-font/D-DINCondensed-Bold.otf')
});
}

export default loadFonts;