// import { Bookmark } from "./Bookmark";
import { SpeakerImage } from "./SpeakerImage.jsx";
import { ThemedText, ThemedView, useThemeColor } from "./Themed.jsx";
import { theme } from "../theme.js";
import type { Session, Speaker } from "../types.js";
import { formatSessionTime } from "../utils/formatDate.js";

import { useReactConfStore } from "@/store/reactConfStore.js";
import { useNavigate } from "react-router";

type Props = {
  session: Session;
  isDayOne: boolean;
};

export function TalkCard({ session, isDayOne }: Props) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);

  const shadow = useThemeColor({ light: theme.dropShadow, dark: undefined });
  const nav = useNavigate();

  return (
    // <Link
    //   push
    //   href={{
    //     pathname: "/talk/[talk]",
    //     params: { talk: session.id },
    //   }}
    //   asChild
    // >
    <view
      style={{
        opacity: 0.8,
      }}
      bindtap={() => {
        console.log("Tap talk card", session.id);
        nav(`/talk/${session.id}`);
        console.profile(`TalkPage Opening ${session.id}`);
        console.profileEnd(`TalkPage Opening ${session.id}`);
      }}
    >
      <ThemedView
        lightColor={theme.colorWhite}
        darkColor={theme.colorBlack}
        style={{
          ...styles.container,
          ...shadow,
        }}
      >
        <ThemedView
          lightColor={
            isDayOne ? theme.colorReactLightBlue : theme.colorLightGreen
          }
          darkColor={
            isDayOne ? "rgba(88,196,220, 0.5)" : "rgba(155,223,177, 0.5)"
          }
          style={styles.heading}
        >
          <view style={styles.timeAndBookmark}>
            <ThemedText fontSize={"18px"} fontWeight="medium">
              {formatSessionTime(session, shouldUseLocalTz)}
            </ThemedText>
            {/* <Bookmark session={session} /> */}
          </view>
          <ThemedText
            fontSize={"20px"}
            fontWeight="bold"
            marginBottom={`${theme.space12}px`}
          >
            {session.title}
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={styles.content}
          lightColor={
            isDayOne ? "rgba(88,196,220, 0.15)" : "rgba(155,223,177, 0.15)"
          }
          darkColor={
            isDayOne ? "rgba(88,196,220, 0.15)" : "rgba(155,223,177, 0.15)"
          }
        >
          {session.speakers.map((speaker) => (
            <SpeakerDetails speaker={speaker} key={speaker.id} />
          ))}
        </ThemedView>
      </ThemedView>
    </view>
    // </Link>
  );
}

function SpeakerDetails({ speaker }: { speaker: Speaker }) {
  return (
    <view style={styles.speaker}>
      <SpeakerImage profilePicture={speaker.profilePicture} animated />
      <view style={styles.speakerDetails}>
        <ThemedText fontSize={"18px"} fontWeight="bold">
          {speaker.fullName}
        </ThemedText>
        <ThemedText fontSize={"16px"} fontWeight="medium">
          {speaker.tagLine}
        </ThemedText>
      </view>
    </view>
  );
}

const styles = {
  container: {
    marginLeft: `${theme.space16}px`,
    marginRight: `${theme.space16}px`,
    marginBottom: `${theme.space16}px`,
    borderRadius: `${theme.borderRadius10}px`,
  },
  heading: {
    borderTopRightRadius: `${theme.borderRadius10}px`,
    borderTopLeftRadius: `${theme.borderRadius10}px`,
    paddingLeft: `${theme.space12}px`,
    paddingTop: `${theme.space12}px`,
    paddingRight: `${theme.space12}px`,
  },
  speaker: {
    display: "flex",
    flexDirection: "row",
    marginBottom: `${theme.space12}px`,
  },
  speakerDetails: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    paddingTop: `${theme.space12}px`,
    paddingLeft: `${theme.space12}px`,
    paddingRight: `${theme.space12}px`,
    borderBottomRightRadius: `${theme.borderRadius10}px`,
    borderBottomLeftRadius: `${theme.borderRadius10}px`,
  },
  timeAndBookmark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
} as const;
