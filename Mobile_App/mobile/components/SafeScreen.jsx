import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets} from 'react-native-safe-area-context';
import COLORS from '../constants/colors';

export default function SafeScreen({children}) {
    const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {children}
    </View>
  )
  const styles = {
    container: {
    backgroundColor: COLORS.background,
    
    },
  }
}