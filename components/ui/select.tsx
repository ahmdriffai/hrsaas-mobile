import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import BottomSheet from "./bottom-sheet";
import Text from "./text";

const PRIMARY = "#3F9AAE";

export interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export default function Select({
  label,
  placeholder = "Pilih...",
  options,
  value,
  onChange,
  error,
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        style={[styles.trigger, error ? styles.triggerError : null]}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Feather
          name="chevron-down"
          size={18}
          color={error ? "#FF4D4F" : "#999"}
        />
      </Pressable>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <BottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={label}
        snapHeight={0.45}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <Feather name="check" size={16} color={PRIMARY} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
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
    justifyContent: "space-between",
  },
  triggerError: {
    backgroundColor: "#FFF1F0",
    borderWidth: 1,
    borderColor: "#FF4D4F",
  },
  triggerText: {
    fontSize: 14,
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
  },
  optionSelected: {
    backgroundColor: "#EBF6F9",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderBottomColor: "transparent",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  optionTextSelected: {
    color: PRIMARY,
    fontWeight: "600",
  },
});
