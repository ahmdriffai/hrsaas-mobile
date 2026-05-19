import Input from "@/components/ui/input";
import InputDateRange, { DateRange } from "@/components/ui/input-date-range";
import Select from "@/components/ui/select";
import { useZodForm } from "@/hooks/use-zod-form";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useCreateTimeOff } from "../hooks/use-create-time-off";
import { useGetTimeOffType } from "../hooks/use-get-timeoff-type";
import {
  TimeOffRequest,
  TimeOffRequestSchema,
} from "../schemas/time-off-schema";
import SubmitCardTimeOff from "./submit-card-time-off";

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default function FormTimeOff() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  const minDate = addDays(new Date(), 3);
  const { data, isLoading } = useGetTimeOffType();
  const { mutate: createTimeOff, isPending } = useCreateTimeOff();

  const options =
    data?.data.map((t) => ({
      label: t.name,
      value: t.id,
    })) ?? [];

  const form = useZodForm(TimeOffRequestSchema, {
    defaultValues: {
      time_off_type_id: "",
      start_date: "",
      end_date: "",
      request_reason: "",
    },
  });

  const handleRangeChange = (r: DateRange) => {
    setRange(r);
    form.setValue("start_date", r.from ? toDateStr(r.from) : "", {
      shouldValidate: true,
    });
    form.setValue("end_date", r.to ? toDateStr(r.to) : "", {
      shouldValidate: true,
    });
  };

  const onSubmit = (data: TimeOffRequest) => {
    console.log(data);
    createTimeOff(data);
  };

  const dateError =
    form.formState.errors.start_date?.message ||
    form.formState.errors.end_date?.message;

  return (
    <>
      <View style={style.form}>
        <Controller
          control={form.control}
          name="time_off_type_id"
          render={({ field, fieldState }) => (
            <Select
              label="Jenis Cuti"
              placeholder="Pilih jenis cuti..."
              options={options}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <InputDateRange
          label="Periode Cuti"
          value={range}
          onChange={handleRangeChange}
          error={dateError}
          minDate={minDate}
        />

        <Controller
          control={form.control}
          name="request_reason"
          render={({ field, fieldState }) => (
            <Input
              label="Alasan Cuti"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </View>
      <SubmitCardTimeOff onPress={form.handleSubmit(onSubmit)} />
    </>
  );
}

const style = StyleSheet.create({
  form: {
    flex: 1,
    gap: 4,
  },
  submitBtn: {
    marginTop: 12,
  },
});
