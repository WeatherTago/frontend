import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

type OnboardingHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
};

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      {subtitle && (
        <View style={styles.subtitleWrapper}>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: 160,
    paddingVertical: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'stretch',
  },
  titleWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  subtitleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  } as TextStyle,
  subtitleText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
  } as TextStyle,
});

export default OnboardingHeader;
