import { useRef } from "react";
import { Animated, Easing } from "react-native";

export const useButtonAnimation = () => {
  const animationSettings = {
    easing: Easing.bezier(0.38, 0.46, 0.08, 0.91),
    duration: 400,
    useNativeDriver: false,
  };

  const getAnimatedButton = () => {
    return animatedButtonColor;
  };
  const animatedButtonColor = useRef(new Animated.Value(0)).current;
  const animatedButtonOpacity = useRef(new Animated.Value(0)).current;

  const onAnimatedPress = () => {
    Animated.timing(animatedButtonColor, {
      ...animationSettings,
      toValue: 1,
    }).start();
  };

  const animatedButtonColorInterpolate = animatedButtonColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#4e4e4e", "#ff0000"],
  });

  const animatedButtonOpacityInterpolate = animatedButtonOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  });

  return {
    onAnimatedPress,
    animatedButtonColor,
    animatedButtonOpacity,
    animationSettings,
    getAnimatedButton,
    animatedButtonColorInterpolate,
    animatedButtonOpacityInterpolate,
  };
};
