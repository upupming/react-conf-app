import type { CSSProperties } from "@lynx-js/types";

import { theme } from "@/theme.js";
import { ThemedView } from "./Themed.jsx";

import reactLogoWhite from "@/assets/images/reactlogo-white.png";

export function SpeakerImage({
  profilePicture,
  size,
  style,
  animated,
}: {
  profilePicture?: string | null;
  size?: "medium" | "large" | "xlarge";
  style?: CSSProperties;
  animated?: boolean;
}) {
  const imageSize = (() => {
    switch (size) {
      case "large":
        return styles.imageSizeLarge;
      case "xlarge":
        return styles.imageSizeExtraLarge;
      case "medium":
      default:
        return styles.imageSizeMedium;
    }
  })();
  const imageStyles = { ...styles.profileImage, ...imageSize };

  const reactLogoSize = (() => {
    switch (size) {
      case "large":
        return styles.reactLogoSizeLarge;
      case "xlarge":
        return styles.reactLogoSizeExtraLarge;
      case "medium":
      default:
        return styles.reactLogoSizeMedium;
    }
  })();

  const placeholder = (
    <view
      style={{
        ...imageStyles,
        ...styles.fallbackImage,
      }}
    >
      <image src={reactLogoWhite} style={reactLogoSize} />
    </view>
  );

  return (
    <ThemedView
      lightColor="rgba(255,255,255,0.15)"
      darkColor="rgba(0,0,0,0.15)"
      style={{
        ...imageSize,
        ...styles.imageContainer,
        ...style,
      }}
    >
      {profilePicture ? (
        <image src={profilePicture} style={imageStyles} />
      ) : (
        placeholder
      )}
    </ThemedView>
  );
}

const styles = {
  imageContainer: {
    marginRight: `${theme.space12}px`,
    borderRadius: `${theme.borderRadius10}px`,
    overflow: "hidden",
  },
  profileImage: {
    width: "50px",
    height: "70px",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  imageSizeMedium: {
    width: "60px",
    height: "60px",
  },
  imageSizeLarge: {
    width: "100px",
    height: "100px",
  },
  imageSizeExtraLarge: {
    width: "200px",
    height: "200px",
  },
  fallbackImage: {
    backgroundColor: theme.colorReactDarkBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  reactLogoSizeMedium: {
    width: "30px",
    height: "30px",
  },
  reactLogoSizeLarge: {
    width: "50px",
    height: "50px",
  },
  reactLogoSizeExtraLarge: {
    width: "100px",
    height: "100px",
  },
} as const;
