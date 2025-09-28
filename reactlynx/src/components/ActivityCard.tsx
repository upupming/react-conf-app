import { ThemedText, ThemedView } from "./Themed.jsx";

import { useReactConfStore } from "@/store/reactConfStore.js";
import { theme } from "@/theme.js";
import type { Session } from "@/types.js";
import { formatSessionTime } from "@/utils/formatDate.js";

type Props = {
  session: Session;
};

export function ActivityCard({ session }: Props) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);

  return (
    <ThemedView style={styles.container}>
      <ThemedText fontSize={`16px`} fontWeight="medium">
        {formatSessionTime(session, shouldUseLocalTz)}
      </ThemedText>
      <view style={styles.row}>
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

const styles = {
  container: {
    margin: `${theme.space16}px`,
    padding: `${theme.space12}px`,
    borderRadius: `${theme.borderRadius10}px`,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
} as const;
