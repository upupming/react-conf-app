import { COLLAPSED_HEADER, EXPANDED_HEADER, ROW_HEIGHT } from "../consts.js";
import { theme } from "../theme.js";
import { ThemedText, ThemedView } from "./Themed.jsx";
import reactLogo from "../assets/images/react-logo.png";

const styles = {
  reactImage: {
    width: `75px`,
    height: `75px`,
  },
  logoText: {
    paddingLeft: `${theme.space8}px`,
  },
  header: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: `${theme.space8}px`,
    paddingRight: `${theme.space8}px`,
  },
} as const;

const interpolateHeader = (
  scrollOffset: number,
  outputRange: [number, number],
) => {
  return (
    outputRange[0] +
    (outputRange[1] - outputRange[0]) *
      Math.max(
        Math.min(
          (scrollOffset - COLLAPSED_HEADER) /
            (EXPANDED_HEADER - COLLAPSED_HEADER),
          1,
        ),
        0,
      )
  );
};

interface ReactConfHeaderProps {
  scrollOffset: number;
}

export function ReactConfHeader({ scrollOffset }: ReactConfHeaderProps) {
  const headerStyle = {
    height: `${interpolateHeader(scrollOffset, [
      EXPANDED_HEADER - ROW_HEIGHT,
      COLLAPSED_HEADER,
    ])}px`,
  };
  const animatedLogoStyle = {
    transform: `translateX(${interpolateHeader(
      scrollOffset,
      [0, -30],
    )}px) scale(${interpolateHeader(scrollOffset, [1, 0.6])})`,
  };
  const firstLineStyle = {
    transform: `translateX(${interpolateHeader(
      scrollOffset,
      [0, -45],
    )}px) translateY(${interpolateHeader(scrollOffset, [0, 13])}px)`,
    fontSize: `${interpolateHeader(scrollOffset, [36, 24])}px`,
  };
  const secondLineStyle = {
    transform: `translateX(${interpolateHeader(
      scrollOffset,
      [0, 35],
    )}px) translateY(${interpolateHeader(scrollOffset, [0, -18])}px)`,
  };

  // console.log('animatedLogoStyle', animatedLogoStyle);

  return (
    <ThemedView
      style={{
        ...styles["header"],
        ...headerStyle,
      }}
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
      animated
    >
      <image
        src={reactLogo}
        style={{
          ...styles["reactImage"],
          ...animatedLogoStyle,
        }}
      />
      <view>
        <ThemedText
          fontSize={"36px"}
          fontWeight="bold"
          style={{
            ...styles["logoText"],
            ...firstLineStyle,
          }}
          darkColor={theme.colorWhite}
          lightColor={theme.colorBlack}
          animated
        >
          REACT
        </ThemedText>
        <ThemedText
          fontSize={"24px"}
          style={{
            ...styles["logoText"],
            ...secondLineStyle,
          }}
          animated
        >
          CONF 2024
        </ThemedText>
      </view>
    </ThemedView>
  );
}
