'use client';

import {
  CreateReceiptParams,
  UpdateReceiptParams,
  createReceipt,
  getReceiptById,
  updateReceipt,
} from '@/lib/dashboard/receiptClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Delete, KeyboardReturn } from '@mui/icons-material';
import {
  Button,
  Card,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
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
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { z as zod } from 'zod';
import { categories } from './config';
const categoryValues: [string, string] = categories.map((c) => c.value) as [
  string,
  string,
];

const schema = zod.object({
  id: zod.string(),
  date: zod.date(),
  description: zod.string().min(1, { message: 'Description is required' }),
  category: zod.enum(categoryValues),
  notes: zod.string(),
  items: zod.array(
    zod.object({
      id: zod.string(),
      item: zod.string().min(1, { message: 'Item is required' }),
      quantity: zod.number().min(1, { message: 'Quantity is required' }),
      unit: zod.string().min(1, { message: 'Unit is required' }),
      unitPrice: zod.number().min(0.01, { message: 'Unit price is required' }),
      discountPrice: zod
        .number()
        .min(0, { message: 'Discount price is required' }),
      notes: zod.string(),
    })
  ),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  id: '',
  date: new Date(),
  description: '',
  category: categories[0].value,
  notes: '',
  items: [],
} satisfies Values;

export default function ReceiptsItemPage({
  returnReceiptsList,
  receiptId = '',
  toAdd = false,
  toEdit = false,
}: {
  returnReceiptsList: () => void;
  receiptId?: string;
  toAdd: boolean;
  toEdit: boolean;
}): React.JSX.Element {
  const [receiptDetail, setReceiptDetail] =
    React.useState<Values>(defaultValues);
  const [editable, setEditable] = React.useState(toAdd);
  const [isPending, setIsPending] = React.useState(false);

  const getReceiptDetail = async (id: string) => {
    const { message, data } = await getReceiptById({ id });
    if (message) {
      console.log(message);
    } else {
      const formData = { ...data, date: new Date(data.date) } as Values;
      setReceiptDetail(formData);
    }
  };

  const addItem = () => {
    const newItems = [...receiptDetail.items];
    newItems.push({
      id: '',
      item: '',
      quantity: 1,
      unit: '',
      unitPrice: 0,
      discountPrice: 0,
      notes: '',
    });
    setReceiptDetail({ ...receiptDetail, items: newItems });
  };

  const removeItem = (index: number) => () => {
    const newItems = [...receiptDetail.items];
    newItems.splice(index, 1);
    setReceiptDetail({ ...receiptDetail, items: newItems });
  };

  const cancelEdit = () => {
    setEditable(false);
    getReceiptDetail(receiptId);
  };

  const onSubmit = async (values: Values) => {
    setIsPending(true);
    try {
      const params = {
        ...values,
        date: dayjs(values.date).format('YYYY-MM-DD'),
      };
      let response;

      if (toAdd) {
        response = await createReceipt(params as CreateReceiptParams);
      } else {
        response = await updateReceipt(params as UpdateReceiptParams);
      }

      const { message, data } = response;

      if (message) {
        console.log(message);
      } else {
        const formData = { ...data, date: new Date(data.date) } as Values;
        setReceiptDetail(formData);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error appropriately
    } finally {
      setIsPending(false);
    }
  };

  React.useEffect(() => {
    if (receiptId) {
      getReceiptDetail(receiptId);
    }
  }, [receiptId]);

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    values: receiptDetail,
    resolver: zodResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={returnReceiptsList}>
          <KeyboardReturn></KeyboardReturn>
        </IconButton>
        <Typography variant="h6">Receipts</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">Receipt detail</Typography>
        {toEdit && (
          <Button variant="contained" onClick={() => setEditable(true)}>
            Edit
          </Button>
        )}
      </Stack>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} p={3}>
            <Stack direction="row" spacing={3}>
              <Stack className="basis-1/2">
                {editable ? (
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
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(newValue) =>
                              field.onChange(
                                newValue?.format('YYYY-MM-DD') || ''
                              )
                            }
                          />
                        </LocalizationProvider>
                        {errors.date && (
                          <FormHelperText>{errors.date.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                ) : (
                  <>
                    <Typography variant="h6" className="font-semibold">
                      Date
                    </Typography>
                    <Typography variant="h6">
                      {dayjs(receiptDetail.date).format('YYYY-MM-DD')}
                    </Typography>
                  </>
                )}
              </Stack>

              <Stack className="basis-1/2">
                {editable ? (
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.description)}
                        size="small"
                      >
                        <InputLabel>Description</InputLabel>
                        <OutlinedInput
                          {...field}
                          label="Description"
                          inputProps={{ maxLength: 20 }}
                        />
                        {errors.description && (
                          <FormHelperText>
                            {errors.description.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  ></Controller>
                ) : (
                  <>
                    <Typography variant="h6" className="font-semibold">
                      Description
                    </Typography>
                    <Typography variant="h6">
                      {receiptDetail.description}
                    </Typography>
                  </>
                )}
              </Stack>
            </Stack>
            <Stack direction="row" spacing={3}>
              <Stack className="basis-1/2">
                {editable ? (
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(errors.category)}
                        size="small"
                      >
                        <InputLabel>Category</InputLabel>
                        <Select {...field} label="Category" variant="outlined">
                          {categories.map((category) => (
                            <MenuItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.category && (
                          <FormHelperText>
                            {errors.category.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  ></Controller>
                ) : (
                  <>
                    <Typography variant="h6" className="font-semibold">
                      Category
                    </Typography>
                    <Chip
                      label={receiptDetail.category}
                      variant="outlined"
                      className="mt-1 w-40"
                    />
                  </>
                )}
              </Stack>
              <Stack className="basis-1/2">
                {editable ? (
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.notes)} size="small">
                        <InputLabel>Notes</InputLabel>
                        <OutlinedInput
                          {...field}
                          label="Notes"
                          inputProps={{ maxLength: 40 }}
                        />
                        {errors.notes && (
                          <FormHelperText>
                            {errors.notes.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  ></Controller>
                ) : (
                  <>
                    <Typography variant="h6" className="font-semibold">
                      Notes
                    </Typography>
                    <Typography variant="h6">{receiptDetail.notes}</Typography>
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={3} p={3}>
            <Typography variant="h6" className="font-semibold">
              Items
            </Typography>

            {fields.map((field, index) => (
              <Stack key={field.id} spacing={3} direction="row">
                <ReceiptItem
                  control={control}
                  name={`items.${index}.item`}
                  label="Item"
                  editable={editable}
                  error={errors.items?.[index]?.item}
                ></ReceiptItem>
                <ReceiptItem
                  control={control}
                  name={`items.${index}.quantity`}
                  label="Quantity"
                  editable={editable}
                  error={errors.items?.[index]?.quantity}
                ></ReceiptItem>
                <ReceiptItem
                  control={control}
                  name={`items.${index}.unit`}
                  label="Unit"
                  editable={editable}
                  error={errors.items?.[index]?.unit}
                ></ReceiptItem>
                <ReceiptItem
                  control={control}
                  name={`items.${index}.unitPrice`}
                  label="Unit price"
                  editable={editable}
                  error={errors.items?.[index]?.unitPrice}
                ></ReceiptItem>
                <ReceiptItem
                  control={control}
                  name={`items.${index}.discountPrice`}
                  label="Discount price"
                  editable={editable}
                  error={errors.items?.[index]?.discountPrice}
                ></ReceiptItem>
                <FormControl
                  size="small"
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000000',
                    },
                  }}
                >
                  <InputLabel>Amount</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Amount"
                    value={
                      getValues().items[index].quantity *
                      getValues().items[index].unitPrice
                    }
                    inputProps={{ maxLength: 20 }}
                  />
                </FormControl>
                <ReceiptItem
                  control={control}
                  name={`items.${index}.notes`}
                  label="Notes"
                  editable={editable}
                  error={errors.items?.[index]?.notes}
                ></ReceiptItem>
                {editable && (
                  <IconButton onClick={removeItem(index)}>
                    <Delete />
                  </IconButton>
                )}
              </Stack>
            ))}

            {editable && (
              <Button
                variant="contained"
                className="w-32"
                startIcon={<Add />}
                onClick={addItem}
              >
                Add item
              </Button>
            )}
          </Stack>
          <Divider />
          <Stack>
            <Stack direction="row" spacing={3} p={3} justifyContent="right">
              <Typography variant="h6" className="font-semibold">
                Total
              </Typography>
              <Typography variant="h6">
                SEK &nbsp;
                {receiptDetail.items.reduce(
                  (acc, item) => acc + item.quantity * item.discountPrice,
                  0
                )}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3} p={3} justifyContent="right">
              {editable && (
                <>
                  {toEdit && (
                    <Button variant="contained" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isPending}
                  >
                    Save
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}

const ReceiptItem = ({
  control,
  name,
  error,
  label,
  editable,
}: {
  control: Control<Values>;
  name: FieldPath<Values>;
  error: FieldError | undefined;
  label: string;
  editable: boolean;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl
          error={Boolean(error)}
          size="small"
          disabled={!editable}
          sx={{
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#000000',
            },
          }}
        >
          <InputLabel>{label}</InputLabel>
          <OutlinedInput
            {...field}
            label={label}
            inputProps={{ maxLength: 20 }}
          />
          {error && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    ></Controller>
  );
};
