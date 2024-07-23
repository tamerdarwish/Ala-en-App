// SafeAreaWrapper.js
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';

const SafeAreaWrapper = ({ children, barStyle, backgroundColor }) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]}>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeAreaWrapper;
