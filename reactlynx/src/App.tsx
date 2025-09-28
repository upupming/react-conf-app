import { theme } from "./theme.js";
import { ThemedText, ThemedView, useThemeColor } from "./components/Themed.jsx";
import { interpolate, useSafeAreaInsets } from "./polyfill.js";
import { COLLAPSED_HEADER, EXPANDED_HEADER, ROW_HEIGHT } from "./consts.js";
import { ReactConfHeader } from "./components/ReactConfHeader.jsx";
import { TimeZoneSwitch } from "./components/TimeZoneSwitch.jsx";
import { useReactConfStore } from "./store/reactConfStore.js";
import type { NodesRef } from "@lynx-js/types";
import { useState, useRef } from "@lynx-js/react";
import type { Session } from "@/types.js";
import { ActivityCard } from "./components/ActivityCard.jsx";
import { TalkCard } from "@/components/TalkCard.jsx";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  sectionHeader: {
    marginBottom: `${theme.space12}px`,
    paddingLeft: `${theme.space16}px`,
    paddingRight: `${theme.space16}px`,
    paddingTop: `${theme.space12}px`,
    paddingBottom: `${theme.space12}px`,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: "3px",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: `${theme.space8}px`,
    backgroundColor: theme.colorThemeLightGrey,
    overflow: "hidden",
  },
  header: {
    position: "absolute",
    top: 0,
    zIndex: 1,
    width: "100%",
  },
} as const;

interface HeaderProps {
  scrollOffset: number;
  refreshing: boolean;
}

function Header({ scrollOffset, refreshing }: HeaderProps) {
  const settingsBgColor = useThemeColor({
    light: theme.colorThemeGrey,
    dark: "rgba(255, 255, 255, 0.2)",
  });
  const animatedHeader = {
    height: `${interpolate(
      scrollOffset,
      [0, EXPANDED_HEADER],
      [EXPANDED_HEADER, 0],
    )}px`,
  };
  const animatedRow = {
    height: `${interpolate(scrollOffset, [0, ROW_HEIGHT], [ROW_HEIGHT, 0])}px`,
    paddingTop: `${interpolate(
      scrollOffset,
      [0, ROW_HEIGHT],
      [theme.space8, 0],
    )}px`,
    paddingBottom: `${interpolate(
      scrollOffset,
      [0, ROW_HEIGHT],
      [theme.space8, 0],
    )}px`,
  };
  // console.log('animatedRow', animatedRow);

  return (
    <view
      style={{
        ...styles["header"],
        ...animatedHeader,
      }}
    >
      <ReactConfHeader scrollOffset={scrollOffset} />
      <view
        style={{
          ...styles["row"],
          backgroundColor: settingsBgColor,
          ...animatedRow,
        }}
      >
        <TimeZoneSwitch />
      </view>
      <view
        style={{
          position: "absolute",
          right: "20px",
          top: "15px",
        }}
      >
        {/* <ActivityIndicator
				size="small"
				hidesWhenStopped={true}
				animating={refreshing}
			/> */}
      </view>
    </view>
  );
}

const SectionListButton = ({
  onPress,
  isBold,
  title,
  subtitle,
}: {
  onPress: () => void;
  isBold: boolean;
  title: string;
  subtitle: string | null;
}) => {
  const opacity = { opacity: isBold ? 1 : 0.5 };

  return (
    <view bindtap={onPress}>
      <ThemedText
        fontWeight={isBold ? "bold" : "medium"}
        lightColor={theme.colorWhite}
        darkColor={theme.colorBlack}
        fontSize={"24px"}
        style={opacity}
      >
        {title}
        {subtitle ? (
          <ThemedText fontWeight="medium">{subtitle}</ThemedText>
        ) : null}
      </ThemedText>
    </view>
  );
};

type SessionItem =
  | {
      type: "session";
      day: number;
      item: Session;
    }
  | {
      type: "section-header";
      day: number;
    };

export function Schedule() {
  const insets = useSafeAreaInsets();
  const [scrollOffset, setScrollOffset] = useState(0);

  const paddingTopStyle = {
    paddingTop: `${interpolate(
      scrollOffset,
      [COLLAPSED_HEADER, EXPANDED_HEADER],
      [0, ROW_HEIGHT],
    )}px`,
  };
  // console.log('paddingTopStyle', scrollOffset, paddingTopStyle.paddingTop);

  const sectionListBackgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkestBlue,
  });

  const isRefreshing = useReactConfStore((state) => !!state.isRefreshing);
  const [shouldShowDayOneHeader, setShouldShowDayOneHeader] = useState(true);
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const scrollRef = useRef<NodesRef>(null);
  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);

  const scrollToSection = ({ isDayOne }: { isDayOne: boolean }) => {
    // console.log('scrollToSection', isDayOne);
    scrollRef.current
      ?.invoke({
        method: "scrollToPosition",
        params: {
          position: isDayOne ? 1 : dayOne.length + 1,
          offset: 0,
          alignTo: "top",
          smooth: true,
        },
        success: function (res) {},
        fail: function (res) {},
      })
      .exec();
  };

  const data = [
    ...dayOne.map((item) => ({ type: "session", day: 1, item })),
    { type: "section-header", day: 2 },
    ...dayTwo.map((item) => ({ type: "session", day: 2, item })),
  ] as SessionItem[];

  return (
    <ThemedView
      style={{
        ...styles["container"],
        paddingTop: `${insets.top}px`,
      }}
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
    >
      <ThemedView
        style={{
          ...styles["container"],
          paddingTop: `${Math.max(0, EXPANDED_HEADER - scrollOffset)}px`,
        }}
        animated
      >
        <list
          ref={scrollRef}
          style={{
            backgroundColor: sectionListBackgroundColor,
            paddingBottom: `${EXPANDED_HEADER}px`,
            height: "100%",
          }}
          bindscroll={(e) => {
            // console.log('list bindscroll', e, e.detail.scrollTop);

            setScrollOffset(e.detail.scrollTop);
          }}
          sticky
        >
          <list-item key="header" item-key="header" sticky-top>
            <ThemedView
              style={{
                ...styles.sectionHeader,
                ...{
                  borderBottomColor: shouldShowDayOneHeader
                    ? theme.colorReactLightBlue
                    : theme.colorLightGreen,
                },
                ...paddingTopStyle,
              }}
              lightColor={theme.colorWhite}
              darkColor={theme.colorDarkBlue}
            >
              <SectionListButton
                title="Day 1"
                subtitle={!shouldUseLocalTz ? "(May 15)" : null}
                isBold={shouldShowDayOneHeader}
                onPress={() => scrollToSection({ isDayOne: true })}
              />
              <SectionListButton
                title="Day 2"
                subtitle={!shouldUseLocalTz ? "(May 16)" : null}
                isBold={!shouldShowDayOneHeader}
                onPress={() => scrollToSection({ isDayOne: false })}
              />
            </ThemedView>
          </list-item>
          {data.map((item) => {
            const isDayOne = item.day === 1;
            if (item.type === "section-header") {
              return (
                <list-item key="header-2" item-key="header-2" sticky-top>
                  <ThemedView
                    style={{
                      ...styles.sectionHeader,
                      borderBottomColor: isDayOne
                        ? theme.colorReactLightBlue
                        : theme.colorLightGreen,
                      ...paddingTopStyle,
                    }}
                    lightColor={theme.colorWhite}
                    darkColor={theme.colorDarkBlue}
                  >
                    <SectionListButton
                      title="Day 1"
                      subtitle={!shouldUseLocalTz ? "(May 15)" : null}
                      isBold={isDayOne}
                      onPress={() => scrollToSection({ isDayOne: true })}
                    />
                    <SectionListButton
                      title="Day 2"
                      subtitle={!shouldUseLocalTz ? "(May 16)" : null}
                      isBold={!isDayOne}
                      onPress={() => scrollToSection({ isDayOne: false })}
                    />
                  </ThemedView>
                </list-item>
              );
            }

            if (item.item.isServiceSession) {
              return (
                <list-item key={item.item.id} item-key={item.item.id}>
                  <ActivityCard session={item.item} />
                </list-item>
              );
            } else {
              return (
                <list-item key={item.item.id} item-key={item.item.id}>
                  <TalkCard
                    key={item.item.id}
                    session={item.item}
                    isDayOne={isDayOne}
                  />
                </list-item>
              );
            }
          })}
        </list>
        <Header scrollOffset={scrollOffset} refreshing={isRefreshing} />
      </ThemedView>
    </ThemedView>
  );
}
