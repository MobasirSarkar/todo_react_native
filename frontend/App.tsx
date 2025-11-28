import {
    SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/app-navigator';
import { NavigationContainer } from '@react-navigation/native';
import Toast from "react-native-toast-message"
import { enGB, registerTranslation } from "react-native-paper-dates"
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

registerTranslation("en-GB", enGB)

const Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors
    }

};


const client = new QueryClient();
function App() {

    return (
        <Provider store={store}>
            <PaperProvider theme={Theme}
                settings={{}}
            >

                <QueryClientProvider client={client}>
                    <SafeAreaProvider>
                        <NavigationContainer >
                            <AppNavigator />
                        </NavigationContainer>
                        <Toast />
                    </SafeAreaProvider>
                </QueryClientProvider>
            </PaperProvider>
        </Provider>
    );
}


export default App;
