import { theme } from "../theme.js";
import type {
  Modify,
  TextProps as TextPropsType,
  ViewProps as ViewPropsType,
  CSSProperties,
} from "@lynx-js/types";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = Modify<
  ThemeProps & {
    marginBottom?: string;
    fontSize?: CSSProperties["fontSize"];
    fontWeight?: "light" | "medium" | "bold";
    italic?: boolean;
    animated?: boolean;
  } & TextPropsType,
  {
    style?: CSSProperties;
  }
>;
export type ViewProps = Modify<
  ThemeProps & ViewPropsType & { animated?: boolean },
  {
    style?: CSSProperties;
  }
>;

export function useThemeColor<T, U>(props: { light: T; dark: U }) {
  const theme =
    (lynx.__globalProps.theme?.toLowerCase() as "light" | "dark") ?? "light";
  // const theme = "dark";
  return props[theme];
}

export function ThemedText(props: TextProps) {
  const {
    style = {},
    lightColor,
    darkColor,
    marginBottom = 0,
    fontSize = `${theme.fontSize16}px`,
    fontWeight,
    italic,
    animated,
    ...otherProps
  } = props;
  const color = useThemeColor({
    light: lightColor || theme.colorBlack,
    dark: darkColor || theme.colorWhite,
  });
  const fontFamily = (() => {
    if (fontWeight === "light") {
      return italic ? theme.fontFamilyLightItalic : theme.fontFamilyLight;
    } else if (fontWeight === "bold") {
      return italic ? theme.fontFamilyBoldItalic : theme.fontFamilyBold;
    } else {
      return italic ? theme.fontFamilyItalic : theme.fontFamily;
    }
  })();
  const { children, ...restProps } = otherProps;

  return (
    <text
      style={{ color, marginBottom, fontSize, fontFamily, ...style }}
      {...restProps}
    >
      {otherProps.children}
    </text>
  );
}

export function ThemedView(props: ViewProps) {
  const { style, lightColor, darkColor, animated, ...otherProps } = props;
  const backgroundColor = useThemeColor({
    light: lightColor || "transparent",
    dark: darkColor || "transparent",
  });
  const { children, ...restProps } = otherProps;

  return (
    <view style={{ backgroundColor, ...style }} {...restProps}>
      {otherProps.children}
    </view>
  );
}
