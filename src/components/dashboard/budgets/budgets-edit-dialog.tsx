'use client';
import {
  createBudget,
  CreateBudgetParams,
  updateBudget,
  UpdateBudgetParams,
} from '@/lib/dashboard/budgetClient';
import { Budget } from '@/types/budgets';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import * as React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z as zod } from 'zod';
interface BudgetsEditDialogProps {
  open: boolean;
  onClose: (refresh: boolean) => void;
  selectedBudget?: Budget;
}

const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
const schema = zod.object({
  date: zod.string().refine((val) => monthRegex.test(val), {
    message: "Invalid month format. Expected format is 'YYYY-MM'.",
  }),
  budget: zod.coerce.number().nonnegative(),
  otherExpense: zod.coerce.number().nonnegative(),
  notes: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  date: dayjs().format('YYYY-MM'),
  budget: 0,
  otherExpense: 0,
  notes: '',
};

export default function BudgetsEditDialog({
  open,
  onClose,
  selectedBudget,
}: BudgetsEditDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({
    defaultValues,
    values: selectedBudget,
    resolver: zodResolver(schema),
  });

  // Reset form when dialog is opened
  React.useEffect(() => {
    if (!open) return;
    if (selectedBudget) {
      reset({
        date: selectedBudget.date,
        budget: selectedBudget.budget,
        otherExpense: selectedBudget.otherExpense,
        notes: selectedBudget.notes,
      });
    } else {
      reset({ ...defaultValues });
    }
  }, [open, selectedBudget, reset]);

  const updatedBudget = useWatch({ control, name: ['budget', 'otherExpense'] });

  const onSubmit = async (data: Values) => {
    try {
      let message;
      if (selectedBudget?.id) {
        // Update
        let params = {
          id: selectedBudget.id,
          budget: data.budget,
          otherExpense: data.otherExpense,
          surplus:
            data.budget -
            data.otherExpense -
            (selectedBudget?.recordedExpense || 0),
          notes: data.notes,
        } satisfies UpdateBudgetParams;
        let response = await updateBudget(params);
        message = response.message;
      } else {
        // Create
        let params = {
          date: data.date,
          budget: data.budget,
          otherExpense: data.otherExpense,
          surplus:
            data.budget -
            data.otherExpense -
            (selectedBudget?.recordedExpense || 0),
          notes: data.notes,
        } satisfies CreateBudgetParams;
        let response = await createBudget(params);
        message = response.message;
      }

      if (message) {
        throw new Error(message);
      }
      onClose(true);
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Budget</DialogTitle>
      <DialogContent className="py-3">
        <form>
          <Stack spacing={2}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <FormControl error={Boolean(errors.date)} size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      slotProps={{
                        textField: { size: 'small' },
                      }}
                      label="Date"
                      views={['month', 'year']}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue?.format('YYYY-MM') || '');
                      }}
                    />
                  </LocalizationProvider>
                  {errors.date && (
                    <FormHelperText>{errors.date.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="budget"
              control={control}
              render={({ field }) => (
                <FormControl error={Boolean(errors.budget)} size="small">
                  <InputLabel>Budget</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Budget"
                    type="number"
                    inputProps={{ min: 0, max: 9999999999 }}
                  />
                  {errors.budget && (
                    <FormHelperText>{errors.budget.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <FormControl size="small">
              <InputLabel>Recorded expense</InputLabel>
              <OutlinedInput
                disabled
                value={selectedBudget?.recordedExpense || 0}
                label="Recorded expense"
                type="number"
              />
            </FormControl>
            <Controller
              name="otherExpense"
              control={control}
              render={({ field }) => (
                <FormControl error={Boolean(errors.otherExpense)} size="small">
                  <InputLabel>Other expense</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Other expense"
                    type="number"
                    inputProps={{ min: 0, max: 9999999999 }}
                  />
                  {errors.otherExpense && (
                    <FormHelperText>
                      {errors.otherExpense.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <FormControl size="small">
              <InputLabel>Surplus</InputLabel>
              <OutlinedInput
                disabled
                value={
                  updatedBudget[0] -
                  updatedBudget[1] -
                  (selectedBudget?.recordedExpense || 0)
                }
                label="Surplus"
                type="number"
              />
            </FormControl>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <FormControl error={Boolean(errors.notes)} size="small">
                  <InputLabel>Notes</InputLabel>
                  <OutlinedInput {...field} label="Notes" type="text" />
                  {errors.notes && (
                    <FormHelperText>{errors.notes.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
