import { useReactConfStore } from "@/store/reactConfStore.js";
import { ThemedText } from "./Themed.jsx";
// import { useActionSheet } from '@/polyfill.js';
import { getCurrentTimezone } from "@/utils/formatDate.js";
import styles from "./TimeZoneSwitch.module.css";

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
    <view className={styles.container} bindtap={onPress}>
      <ThemedText fontSize={"14px"} fontWeight="medium">
        {shouldUseLocalTz ? "Local Time " : "Venue Time Zone "}
        <ThemedText fontSize={"12px"} fontWeight="light">
          ({shouldUseLocalTz ? getCurrentTimezone() : "PDT"})
        </ThemedText>
      </ThemedText>
    </view>
  );
}
