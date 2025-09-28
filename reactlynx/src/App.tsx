import { ThemedText, ThemedView } from "./components/Themed.jsx";
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
import "./App.css";

interface HeaderProps {
  scrollOffset: number;
  refreshing: boolean;
}

function Header({ scrollOffset, refreshing }: HeaderProps) {
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
      [8, 0],
    )}px`,
    paddingBottom: `${interpolate(
      scrollOffset,
      [0, ROW_HEIGHT],
      [8, 0],
    )}px`,
  };
  // console.log('animatedRow', animatedRow);

  return (
    <view
      className="App_header" 
      style={animatedHeader}
    >
      <ReactConfHeader scrollOffset={scrollOffset} />
      <view
        className="App_row"
        style={animatedRow}
      >
        <TimeZoneSwitch />
      </view>
      <view
        className="App_activityIndicator"
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
      className="App_container"
      style={{
        paddingTop: `${insets.top}px`,
      }}
    >
      <ThemedView
        className="App_container"
        style={{
          paddingTop: `${Math.max(0, EXPANDED_HEADER - scrollOffset)}px`,
        }}
        animated
      >
        <list
          custom-list-name="list-container"
          experimental-disable-platform-implementation={true}
          ref={scrollRef}
          class="App_list"
          span-count={1}
          bindscroll={(e) => {
            // console.log('list bindscroll', e, e.detail.scrollTop);

            setScrollOffset(e.detail.scrollTop);
          }}
          sticky
        >
          <list-item key="header" item-key="header" sticky-top>
             <ThemedView
               className={"App_sectionHeader " + (shouldShowDayOneHeader ? 'primary' : 'secondary')}
              style={paddingTopStyle}
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
                     className={"App_sectionHeader " + (isDayOne ? 'primary' : 'secondary')}
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
