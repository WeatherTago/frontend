import { theme } from '@/styles/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type StepIndicatorProps = {
  totalSteps: number;
  currentStep: number;
  activeColor?: string;
  inactiveColor?: string;
};

const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  currentStep,
  activeColor = theme.colors.primary[700], // 선택된 점 색상
  inactiveColor = theme.colors.gray[100], // 비활성 점 색상
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.dotsWrapper}>
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              {
                backgroundColor: idx === currentStep - 1 ? activeColor : inactiveColor,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingVertical: 30,
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
  },
  dotsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default StepIndicator;
