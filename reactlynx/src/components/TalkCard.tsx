// import { Bookmark } from "./Bookmark";
import { SpeakerImage } from "./SpeakerImage.jsx";
import { ThemedText, ThemedView } from "./Themed.jsx";
import type { Session, Speaker } from "../types.js";
import { formatSessionTime } from "../utils/formatDate.js";
import "./TalkCard.css";

import { useReactConfStore } from "@/store/reactConfStore.js";
import { useNavigate } from "react-router";

type Props = {
  session: Session;
  isDayOne: boolean;
};

export function TalkCard({ session, isDayOne }: Props) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
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
        className={"TalkCard_container" + (isDayOne ? "primary" : "secondary")}
      >
        <ThemedView
          className="TalkCard_heading"
        >
          <view className={`flex-row TalkCard_timeAndBookmark`}>
            <ThemedText fontSize={"18px"} fontWeight="medium">
              {formatSessionTime(session, shouldUseLocalTz)}
            </ThemedText>
            {/* <Bookmark session={session} /> */}
          </view>
          <ThemedText
            class="bottom-12"
            fontSize={"20px"}
            fontWeight="bold"
          >
            {session.title}
          </ThemedText>
        </ThemedView>
        <ThemedView 
          className="TalkCard_content"
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
    <view className={`flex-row TalkCard_speaker`}>
      <SpeakerImage profilePicture={speaker.profilePicture} animated />
      <view className="TalkCard_speakerDetails">
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
