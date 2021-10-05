import { useRef } from "react";
import { Animated, Easing } from "react-native";

export const useButtonAnimation = () => {
  const animationSettings = {
    easing: Easing.bezier(0.38, 0.46, 0.08, 0.91),
    duration: 400,
    useNativeDriver: false,
  };

  const getAnimatedButton = () => {
    return animatedButton;
  };
  const animatedButton = useRef(new Animated.Value(0)).current;

  const onAnimatedPress = () => {
    Animated.timing(animatedButton, {
      ...animationSettings,
      toValue: 1,
    }).start();
  };

  const animatedButtonColor = animatedButton.interpolate({
    inputRange: [0, 1],
    outputRange: ["#4e4e4e", "#ff0000"],
  });

  return {
    onAnimatedPress,
    animatedButton,
    animationSettings,
    getAnimatedButton,
    animatedButtonColor,
  };
};
