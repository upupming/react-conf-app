import {
  interpolate,
  useColorScheme,
  useHeaderHeight,
  useSafeAreaInsets,
} from "@/polyfill.js";
import { useReactConfStore } from "@/store/reactConfStore.js";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { theme } from "@/theme.js";
import { ThemedText, ThemedView } from "@/components/Themed.jsx";

import type { Session, Speaker } from "@/types.js";
import { NotFound } from "@/components/NotFound.jsx";
import reactLogo from "../assets/images/react-logo.png";
import { SpeakerImage } from "@/components/SpeakerImage.jsx";
import { formatSessionTime } from "@/utils/formatDate.js";

const findTalk = (
  talkId: string | string[] | undefined,
  { dayOne, dayTwo }: { dayOne: Session[]; dayTwo: Session[] },
) => {
  const talkDay1 = dayOne.find((session) => session.id === talkId);
  if (talkDay1) {
    return { talk: talkDay1, isDayOne: true };
  }
  const talkDay2 = dayTwo.find((session) => session.id === talkId);
  if (talkDay2) {
    return { talk: talkDay2, isDayOne: false };
  }

  return { talk: null, isDayOne: false };
};

// We use a transparent header background on Android to provide a nice looking
// header that expands to the top of the screen. This component ensures that
// a header background becomes visible as we scroll past the header, so we don't
// just see a floating back button.
function HeaderBackgroundAndroid({
  scrollTranslationY,
}: {
  scrollTranslationY: number;
}) {
  const headerHeight = useHeaderHeight();
  const animatedStyle = {
    opacity: interpolate(scrollTranslationY, [50, 150], [0, 1]),
  };

  return (
    <ThemedView
      animated
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
      style={{
        ...animatedStyle,
        ...{
          height: `${headerHeight}px`,
          position: "absolute",
          elevation: 4,
          top: 0,
          left: 0,
          right: 0,
        },
      }}
    />
  );
}

function HeaderBackgroundIOS({
  scrollTranslationY,
}: {
  scrollTranslationY: number;
}) {
  const headerHeight = useHeaderHeight();
  const colorScheme = useColorScheme();
  const animatedStyle = {
    opacity: interpolate(scrollTranslationY, [0, 150], [0, 1]),
  };

  return (
    <view
      style={{
        ...animatedStyle,
        ...{
          position: "absolute",
          elevation: 4,
          top: 0,
          left: 0,
          right: 0,
        },
      }}
    >
      <view
        // intensity={40}
        // tint={
        //   colorScheme === "light"
        //     ? "systemThinMaterialLight"
        //     : "systemThinMaterialDark"
        // }
        style={{
          height: `${headerHeight}px`,
          flexGrow: 1,
          filter: "blur(40px)",
        }}
      />
    </view>
  );
}

function SpeakerDetails({ speaker }: { speaker: Speaker }) {
  return (
    <view style={styles.speaker}>
      <SpeakerImage profilePicture={speaker.profilePicture} />
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

function Section({ title, value }: { title: string; value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <view style={styles.sectionContainer}>
      <ThemedText fontSize={"18px"} fontWeight="bold">
        {title}
      </ThemedText>
      <ThemedText fontSize={"18px"} fontWeight="medium">
        {value}
      </ThemedText>
    </view>
  );
}

export default function TalkDetail() {
  const params = useParams<{ talk: string }>();
  const talkId = params.talk;

  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const { talk, isDayOne } = findTalk(talkId, { dayOne, dayTwo });
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);

  const insets = useSafeAreaInsets();

  const [translationY, setTranslationY] = useState(0);
  const headerStyle = {
    transform: `translateY(${translationY}px) scale(${interpolate(translationY, [-120, 0], [1.4, 1])})`,
    opacity: interpolate(translationY, [0, 100], [1, 0.6]),
  };
  const nav = useNavigate();

  return (
    <view
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 2,
        marginTop: "120px",
      }}
    >
      <ThemedView
        style={styles.container}
        darkColor={theme.colorDarkBlue}
        lightColor={theme.colorWhite}
      >
        {talk ? (
          <>
            <scroll-view
              style={{
                ...styles.container,
                ...styles.contentContainer,
                paddingBottom: `${insets.bottom + theme.space24 * 10}px`,
                height: "100%",
                borderRadius: "20px",
              }}
              bindscroll={(e) => {
                console.log("scroll-view scroll", e, e.detail.scrollTop);
                setTranslationY(e.detail.scrollTop);
              }}
              scroll-y
            >
              <ThemedView
                animated
                lightColor={
                  isDayOne ? theme.colorReactLightBlue : theme.colorLightGreen
                }
                darkColor={
                  isDayOne ? "rgba(88,196,220, 0.5)" : "rgba(155,223,177, 0.5)"
                }
                style={{
                  ...styles.header,
                  ...headerStyle,
                }}
              >
                <view
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  bindtap={() => {
                    console.profile(`TalkPage Closing ${talkId}`);
                    console.profileEnd(`TalkPage Closing ${talkId}`);
                    nav(-1);
                  }}
                >
                  <text
                    style={{
                      fontSize: "24px",
                    }}
                  >
                    &times;
                  </text>
                </view>
                <image
                  src={reactLogo}
                  style={{
                    ...styles.reactLogo,
                  }}
                />
                <view style={styles.centered}>
                  <ThemedText
                    fontWeight="bold"
                    fontSize={"32px"}
                    style={styles.talkTitle}
                  >
                    {talk?.title}
                  </ThemedText>
                </view>
              </ThemedView>
              <ThemedView
                darkColor={theme.colorDarkBlue}
                lightColor={theme.colorWhite}
                style={styles.content}
              >
                {talk.speakers.map((speaker) => (
                  // <Link
                  //   push
                  //   key={speaker.id}
                  //   href={{
                  //     pathname: "/speaker/[speaker]",
                  //     params: { speaker: speaker.id },
                  //   }}
                  //   asChild
                  // >
                  <view key={speaker.id}>
                    <SpeakerDetails speaker={speaker} />
                  </view>
                  // </Link>
                ))}
                <Section
                  title="Date"
                  value={
                    isDayOne
                      ? "May 15, 2024 (Conference Day 1)"
                      : "May 15, 2024 (Conference Day 2)"
                  }
                />
                <Section
                  title="Time"
                  value={formatSessionTime(talk, shouldUseLocalTz)}
                />
                <Section title="Venue" value={talk.room} />
                <Section title="Description" value={talk.description} />
              </ThemedView>
            </scroll-view>

            {SystemInfo.platform === "Android" ? (
              <HeaderBackgroundAndroid scrollTranslationY={translationY} />
            ) : (
              <HeaderBackgroundIOS scrollTranslationY={translationY} />
            )}
          </>
        ) : (
          <NotFound message="Talk not found" />
        )}
      </ThemedView>
    </view>
  );
}

const styles = {
  container: {
    flexGrow: 1,
    height: "100%",
  },
  header: {
    height: `250px`,
    paddingTop: `50px`,
    paddingLeft: `${theme.space16}px`,
    paddingRight: `${theme.space16}px`,
    overflow: "hidden",
  },
  contentContainer: {
    borderBottomRightRadius: `${theme.borderRadius20}px`,
    borderBottomLeftRadius: `${theme.borderRadius20}px`,
  },
  speaker: {
    display: "flex",
    flexDirection: "row",
    marginBottom: `${theme.space12}px`,
  },
  speakerDetails: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  talkTitle: {
    textAlign: "center",
  },
  centered: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
  },
  reactLogo: {
    position: "absolute",
    right: `-100px`,
    top: "30%",
    height: `300px`,
    width: `300px`,
    opacity: 0.2,
  },
  sectionContainer: {
    marginBottom: `${theme.space24}px`,
  },
  content: {
    paddingTop: `${theme.space16}px`,
    paddingLeft: `${theme.space16}px`,
    paddingRight: `${theme.space16}px`,
  },
} as const;
