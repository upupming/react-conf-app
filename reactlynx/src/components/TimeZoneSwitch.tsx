import { useReactConfStore } from "@/store/reactConfStore.js";
import { ThemedText, useThemeColor } from "./Themed.jsx";
import { theme } from "@/theme.js";
// import { useActionSheet } from '@/polyfill.js';
import { getCurrentTimezone } from "@/utils/formatDate.js";

const styles = {
  container: {
    display: "flex",
    marginLeft: `${theme.space16}px`,
    marginRight: `${theme.space16}px`,
    flexDirection: "row",
    alignItems: "center",
    height: "55px",
    justifyContent: "flex-end",
    flexGrow: 1,
  },
  switch: {
    marginLeft: `${theme.space8}px`,
    marginRight: `${theme.space8}px`,
  },
} as const;

export function TimeZoneSwitch() {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const toggleLocalTz = useReactConfStore((state) => state.toggleLocalTz);

  // const iconColor = useThemeColor({
  //   light: theme.colorBlack,
  //   dark: theme.colorWhite,
  // });

  // const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    // const options = [
    //   shouldUseLocalTz
    //     ? 'Use venue time (PDT)'
    //     : `Use local time (${getCurrentTimezone()})`,
    //   'Cancel',
    // ];
    // const cancelButtonIndex = 1;

    // // showActionSheetWithOptions(
    // //   {
    // //     options,
    // //     cancelButtonIndex,
    // //   },
    // //   (selectedIndex) => {
    // //     if (selectedIndex === 0) {

    // //     }
    // //   },
    // // );
    toggleLocalTz();
  };

  return (
    <view style={styles.container} bindtap={onPress}>
      <ThemedText fontSize={"14px"} fontWeight="medium">
        {shouldUseLocalTz ? "Local Time " : "Venue Time Zone "}
        <ThemedText fontSize={"12px"} fontWeight="light">
          ({shouldUseLocalTz ? getCurrentTimezone() : "PDT"})
        </ThemedText>
      </ThemedText>
    </view>
  );
}
