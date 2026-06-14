import { View, Text } from 'react-native'
import React from 'react'
import styles from "../../assets/styles/login.styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {}
  return (
    <View style ={styles.container}>
    
    </View>
  )
}