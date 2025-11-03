import { View } from 'react-native'
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function SafeScreen({ children }) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="flex-1 bg-blue-100"
      style={{ paddingTop: insets.top }}
    >
      {children}
    </View>
  )
}
