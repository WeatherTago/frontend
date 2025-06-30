import React from 'react';
import { StyleSheet, View } from 'react-native';

const CARD_WIDTH = 400;
const CARD_HEIGHT = 498;

export default function FavoriteStationCard() {
  return (
    <View style={styles.card}>
      {/* 내부 내용은 추후 채움 */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    padding: 24,
    backgroundColor: '#cccccc', // 임시 배경색 
    borderRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
});
