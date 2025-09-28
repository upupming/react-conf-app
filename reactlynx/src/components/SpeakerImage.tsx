import type { CSSProperties } from "@lynx-js/types";

import { ThemedView } from "./Themed.jsx";
import "./SpeakerImage.css";

import reactLogoWhite from "@/assets/images/reactlogo-white.png";

export function SpeakerImage({
  profilePicture,
  size = 'medium',
  style,
  animated,
}: {
  profilePicture?: string | null;
  size?: "medium" | "large" | "xlarge";
  style?: CSSProperties;
  animated?: boolean;
}) {

  const placeholder = (
    <view className="speaker-profile-image image speaker-image-fallback">
      <image src={reactLogoWhite} className="react-logo" />
    </view>
  );

  return (
    <ThemedView
      className={`${size} speaker-image-container`}
      style={style}
      id="speaker-image-container"
    >
      {profilePicture ? (
        <image 
          src={profilePicture} 
          className="speaker-profile-image image" 
        />
      ) : (
        placeholder
      )}
    </ThemedView>
  );
}
