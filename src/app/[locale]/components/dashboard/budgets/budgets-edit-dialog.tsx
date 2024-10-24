'use client';
import {
  createBudget,
  CreateBudgetParams,
  updateBudget,
  UpdateBudgetParams,
} from '@/lib/dashboard/budgetClient';
import { Budget } from '@/types/budgets';
import { zodResolver } from '@hookform/resolvers/zod';
import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import * as React from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldPath,
  useForm,
  useWatch,
} from 'react-hook-form';
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
  recordedExpense: zod.coerce.number().nonnegative(),
  otherExpense: zod.coerce.number().nonnegative(),
  surplus: zod.coerce.number().nonnegative(),
  notes: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  date: dayjs().format('YYYY-MM'),
  budget: 0,
  recordedExpense: 0,
  otherExpense: 0,
  surplus: 0,
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
        ...selectedBudget,
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
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle className="p-4">Edit Budget</DialogTitle>
      <IconButton
        onClick={() => onClose(false)}
        className="absolute right-4 top-4"
      >
        <Close />
      </IconButton>
      <DialogContent className="p-4" dividers>
        <form>
          <Grid container spacing={2}>
            {Object.keys(defaultValues).map((key) => {
              const error = errors[key as keyof Values];
              return (
                <GridRow
                  key={key}
                  control={control}
                  name={key as FieldPath<Values>}
                  error={error}
                  label={key}
                  editable={key !== 'surplus' && key !== 'recordedExpense'}
                  value={
                    key === 'recordedExpense'
                      ? selectedBudget?.recordedExpense || 0
                      : key === 'surplus'
                        ? updatedBudget[0] -
                          updatedBudget[1] -
                          (selectedBudget?.recordedExpense || 0)
                        : undefined
                  }
                  type={key === 'date' || key === 'notes' ? 'text' : 'number'}
                />
              );
            })}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions className="px-4 py-2">
        <Button variant="outlined" size="small" onClick={() => onClose(false)}>
          Cancel
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// TODO: input length validation
const GridRow = ({
  control,
  name,
  error,
  label,
  value,
  editable,
  type,
  maxLength = 20,
}: {
  control: Control<Values>;
  name: FieldPath<Values>;
  error: FieldError | undefined;
  label: string;
  value?: number;
  editable: boolean;
  type: 'text' | 'number';
  maxLength?: number;
}) => {
  return (
    <>
      <Grid item xs={4} lg={4} md={4} className="self-center">
        <Typography variant="subtitle1">
          {label
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())}
        </Typography>
      </Grid>
      <Grid item xs={8} lg={8} md={8}>
        {editable ? (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <>
                {name === 'date' ? (
                  <FormControl error={!!error} size="small" fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        {...field}
                        slotProps={{
                          textField: { size: 'small' },
                        }}
                        views={['month', 'year']}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          field.onChange(newValue?.format('YYYY-MM') || '');
                        }}
                      />
                    </LocalizationProvider>
                    {error && <FormHelperText>{error?.message}</FormHelperText>}
                  </FormControl>
                ) : (
                  <TextField
                    {...field}
                    size="small"
                    hiddenLabel
                    fullWidth
                    type={type}
                    inputProps={{ maxLength }}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              </>
            )}
          />
        ) : (
          <TextField
            size="small"
            hiddenLabel
            fullWidth
            disabled
            type={type}
            value={value}
            inputProps={{ maxLength }}
          />
        )}
      </Grid>
    </>
  );
};
