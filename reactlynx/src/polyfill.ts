import type { CSSProperties } from "@lynx-js/types";

// Lynx does not support `useAnimatedStyle` yet, let us just mock it
export type SharedValue<T> = {
  value: T;
};
export const useAnimatedStyle = (func: () => CSSProperties) => {
  return func();
};

export function interpolate(
  x: number,
  inputRange: readonly [number, number],
  outputRange: readonly [number, number],
): number {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;
  const inputRangeSize = inputMax - inputMin;
  const outputRangeSize = outputMax - outputMin;
  let xScaled = (x - inputMin) / inputRangeSize;
  if (xScaled < 0) {
    xScaled = 0;
  } else if (xScaled > 1) {
    xScaled = 1;
  }
  return outputMin + xScaled * outputRangeSize;
}

export const useActionSheet = () => {
  return {
    showActionSheetWithOptions: (
      options: any,
      callback: (i: number) => void,
    ) => {
      console.log("showActionSheetWithOptions", options, callback);
    },
  };
};

export const useSafeAreaInsets = () => {
  return {
    top: 56,
    bottom: 0,
    left: 0,
    right: 0,
  };
};

export const useSharedValue = (value: number) => {
  return {
    value,
  };
};

export const useHeaderHeight = () => {
  return 0;
};

export const useColorScheme = () => {
  return lynx.__globalProps.theme ?? "light";
};
