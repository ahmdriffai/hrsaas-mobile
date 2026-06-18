import { Colors } from "@/constans/color";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Text from "./text";

export default function HeroCard() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formattedTime = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <LinearGradient
      colors={[Colors.light.primaryLight, Colors.light.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Check-in / Check-out row */}
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Feather size={22} name="clock" color={Colors.light.white} />
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkLabel}>Check-in</Text>
          <Text style={styles.checkValue}>-</Text>
        </View>

        <View style={styles.separator}>
          <Text style={styles.separatorDots}>·  ·  ·</Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkLabel}>Check-out</Text>
          <Text style={styles.checkValue}>-</Text>
        </View>
      </View>

      {/* Time & date row */}
      <View style={styles.bottomRow}>
        <Text style={styles.timeText}>{formattedTime} WIB</Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
    paddingBottom: 16,
  },
  iconBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkItem: {
    alignItems: "center",
    gap: 4,
  },
  checkLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "300",
  },
  checkValue: {
    fontSize: 16,
    color: Colors.light.white,
    fontWeight: "600",
  },
  separator: {
    flex: 1,
    alignItems: "center",
  },
  separatorDots: {
    fontSize: 18,
    color: "rgba(255,255,255,0.4)",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  timeText: {
    fontSize: 14,
    color: Colors.light.white,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "300",
  },
});
