// screens/SplashScreen.js
import React from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Logo centrado */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      
      {/* Texto debajo del logo */}
      <Text style={styles.title}>Instagram Replica</Text>
      
      {/* Loader */}
      <ActivityIndicator size="large" color="tomato" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  logo: { 
    width: 150, 
    height: 150, 
    marginBottom: 10, 
    resizeMode: 'contain' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#E1306C' // 👈 color estilo Instagram (rosado)
  },
});