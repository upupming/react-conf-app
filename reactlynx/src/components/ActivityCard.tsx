import { ThemedText, ThemedView } from "./Themed.jsx";
import "./ActivityCard.css";

import { useReactConfStore } from "@/store/reactConfStore.js";
import type { Session } from "@/types.js";
import { formatSessionTime } from "@/utils/formatDate.js";

type Props = {
  session: Session;
};

export function ActivityCard({ session }: Props) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);

  return (
    <ThemedView className="ActivityCard_container">
      <ThemedText fontSize={`16px`} fontWeight="medium">
        {formatSessionTime(session, shouldUseLocalTz)}
      </ThemedText>
      <view className={`flex-row ActivityCard_row`}>
        <ThemedText fontSize={`20px`} fontWeight="bold">
          {session.title}
        </ThemedText>
        <ThemedText fontSize={`14px`} fontWeight="light">
          {session.room}
        </ThemedText>
      </view>
    </ThemedView>
  );
}
