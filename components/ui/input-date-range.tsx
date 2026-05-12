import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import BottomSheet from "./bottom-sheet";
import Text from "./text";

const PRIMARY = "#3F9AAE";
const RANGE_BG = "#EBF6F9";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface Props {
  label?: string;
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  error?: string;
}

function fmt(d: Date | null) {
  if (!d) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function buildCalendar(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(first).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function InputDateRange({
  label,
  value,
  onChange,
  error,
}: Props) {
  const today = startOfDay(new Date());
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState<"from" | "to">("from");
  const [draft, setDraft] = useState<DateRange>(
    value ?? { from: null, to: null },
  );
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const weeks = buildCalendar(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleDay = (date: Date) => {
    const d = startOfDay(date);
    if (cursor === "from") {
      setDraft({ from: d, to: null });
      setCursor("to");
    } else {
      if (draft.from && d < draft.from) {
        setDraft({ from: d, to: draft.from });
      } else {
        setDraft((prev) => ({ ...prev, to: d }));
      }
      setCursor("from");
    }
  };

  const handleApply = () => {
    if (draft.from) {
      onChange?.(draft);
      setOpen(false);
    }
  };

  const handleOpen = () => {
    setDraft(value ?? { from: null, to: null });
    setCursor("from");
    setOpen(true);
  };

  const getDayStyle = (date: Date | null) => {
    if (!date) return {};
    const d = startOfDay(date);
    const isFrom = draft.from && sameDay(d, draft.from);
    const isTo = draft.to && sameDay(d, draft.to);
    const inRange = draft.from && draft.to && d > draft.from && d < draft.to;
    const isToday = sameDay(d, today);

    if (isFrom || isTo) return styles.daySelected;
    if (inRange) return styles.dayInRange;
    if (isToday) return styles.dayToday;
    return {};
  };

  const getDayTextStyle = (date: Date | null) => {
    if (!date) return {};
    const d = startOfDay(date);
    const isFrom = draft.from && sameDay(d, draft.from);
    const isTo = draft.to && sameDay(d, draft.to);
    const inRange = draft.from && draft.to && d > draft.from && d < draft.to;

    if (isFrom || isTo) return styles.dayTextSelected;
    if (inRange) return styles.dayTextInRange;
    return {};
  };

  const fromLabel = fmt(value?.from ?? null);
  const toLabel = fmt(value?.to ?? null);
  const displayText =
    fromLabel && toLabel
      ? `${fromLabel}  →  ${toLabel}`
      : fromLabel
        ? `${fromLabel}  →  ...`
        : null;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        style={[styles.trigger, error ? styles.triggerError : null]}
        onPress={handleOpen}
      >
        <Feather
          name="calendar"
          size={16}
          color={error ? "#FF4D4F" : "#999"}
          style={styles.calIcon}
        />
        <Text style={[styles.triggerText, !displayText && styles.placeholder]}>
          {displayText ?? "Pilih rentang tanggal"}
        </Text>
        {displayText && (
          <Pressable
            hitSlop={8}
            onPress={() => {
              setDraft({ from: null, to: null });
              onChange?.({ from: null, to: null });
            }}
          >
            <Feather name="x" size={16} color="#999" />
          </Pressable>
        )}
      </Pressable>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <BottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        snapHeight={0.65}
      >
        {/* Month navigation */}
        <View style={styles.nav}>
          <Pressable onPress={prevMonth} hitSlop={10}>
            <Feather name="chevron-left" size={22} color="#333" />
          </Pressable>
          <Text style={styles.navTitle}>
            {MONTHS[viewMonth]} {viewYear}
          </Text>
          <Pressable onPress={nextMonth} hitSlop={10}>
            <Feather name="chevron-right" size={22} color="#333" />
          </Pressable>
        </View>

        {/* Day-of-week headers */}
        <View style={styles.weekRow}>
          {DAYS.map((d) => (
            <Text key={d} style={styles.weekDay}>
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar grid */}
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((date, di) => (
              <Pressable
                key={di}
                style={[styles.day, date ? getDayStyle(date) : null]}
                onPress={() => date && handleDay(date)}
                disabled={!date}
              >
                {date && (
                  <Text style={[styles.dayText, getDayTextStyle(date)]}>
                    {date.getDate()}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        ))}

        {/* Hint + Apply */}
        <Text style={styles.hint}>
          {cursor === "from" ? "Pilih tanggal mulai" : "Pilih tanggal selesai"}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerDates}>
            <Text style={styles.footerLabel}>Dari</Text>
            <Text style={styles.footerDate}>{fmt(draft.from) || "—"}</Text>
          </View>
          <View style={styles.footerDivider} />
          <View style={styles.footerDates}>
            <Text style={styles.footerLabel}>Sampai</Text>
            <Text style={styles.footerDate}>{fmt(draft.to) || "—"}</Text>
          </View>
          <Pressable
            style={[styles.applyBtn, !draft.from && styles.applyBtnDisabled]}
            onPress={handleApply}
            disabled={!draft.from}
          >
            <Text style={styles.applyText}>Terapkan</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    flexWrap: "wrap",
  },
  label: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 5,
    color: "#999",
    width: "100%",
  },
  trigger: {
    width: "100%",
    backgroundColor: "#F3F3F3",
    height: 45,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 8,
  },
  triggerError: {
    backgroundColor: "#FFF1F0",
    borderWidth: 1,
    borderColor: "#FF4D4F",
  },
  calIcon: { marginRight: 2 },
  triggerText: {
    fontSize: 13,
    color: "#090909",
    flex: 1,
  },
  placeholder: {
    color: "#ABABAB",
  },
  errorText: {
    width: "100%",
    fontSize: 11,
    color: "#FF4D4F",
    marginTop: 4,
  },
  // Calendar
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 4,
  },
  weekDay: {
    width: 36,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: {
    backgroundColor: PRIMARY,
  },
  dayInRange: {
    backgroundColor: RANGE_BG,
    borderRadius: 0,
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  dayText: {
    fontSize: 13,
    color: "#374151",
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  dayTextInRange: {
    color: PRIMARY,
    fontWeight: "500",
  },
  hint: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
  },
  footerDates: {
    flex: 1,
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  footerDate: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  footerDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E5E7EB",
  },
  applyBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyBtnDisabled: {
    backgroundColor: "#B0D8E3",
  },
  applyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
