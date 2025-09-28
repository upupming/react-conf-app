import {
  interpolate,
  useColorScheme,
  useHeaderHeight,
  useSafeAreaInsets,
} from "@/polyfill.js";
import { useReactConfStore } from "@/store/reactConfStore.js";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ThemedText, ThemedView } from "@/components/Themed.jsx";
import "./talk.css";

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
      className='talk_headerBackground'
      style={{
        ...animatedStyle,
        height: `${headerHeight}px`,
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
      className="talk_headerBackground"
      style={{
        ...animatedStyle,
      }}
    >
      <view
        // intensity={40}
        // tint={
        //   colorScheme === "light"
        //     ? "systemThinMaterialLight"
        //     : "systemThinMaterialDark"
        // }
        className="talk_headerBackgroundBlur"
        style={{
          height: `${headerHeight}px`,
        }}
      />
    </view>
  );
}

function SpeakerDetails({ speaker }: { speaker: Speaker }) {
  return (
    <view className={`flex-row talk_speaker`}>
      <SpeakerImage profilePicture={speaker.profilePicture} />
      <view className={`flex-column talk_speakerDetails`}>
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
    <view className="talk_sectionContainer">
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
    <view className="talk_modal-overlay">
      <ThemedView className="talk_container">
        {talk ? (
          <>
            <scroll-view
              className="talk_sectionContainer talk_contentContainer"
              style={{
                paddingBottom: `${insets.bottom + 24 * 10}px`,
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
                className="talk_header" 
                style={headerStyle}
              >
                <view
                  className="talk_closeButtonContainer"
                  bindtap={() => {
                    console.profile(`TalkPage Closing ${talkId}`);
                    console.profileEnd(`TalkPage Closing ${talkId}`);
                    nav(-1);
                  }}
                >
                  <text className="talk_closeButtonText">&times;</text>
                </view>
                <image src={reactLogo} className="talk_reactLogo" />
                <view className="talk_centered">
                  <ThemedText
                    fontWeight="bold"
                    fontSize={"32px"}
                    className="talk_talkTitle"
                  >
                    {talk?.title}
                  </ThemedText>
                </view>
              </ThemedView>
              <ThemedView className="talk_content">
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
                  value={isDayOne ? "May 15, 2024 (Conference Day 1)" : "May 15, 2024 (Conference Day 2)"}
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
