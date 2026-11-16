import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LeadScreen } from './src/features/lead/LeadScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <LeadScreen />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
