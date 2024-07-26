'use client';

import ImageUpload from '@/components/core/image-upload';
import { generatePresignedUrl } from '@/lib/auth/client';
import {
  CreateReceiptParams,
  UpdateReceiptParams,
  createReceipt,
  getReceiptById,
  updateReceipt,
} from '@/lib/dashboard/receiptClient';
import { ImageFile } from '@/types/imageFile';
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
import axios from 'axios';
import dayjs from 'dayjs';
import * as React from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldPath,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { z as zod } from 'zod';
import { categories } from './config';
const categoryValues: [string, string] = categories.map((c) => c.value) as [
  string,
  string,
];

const schema = zod.object({
  date: zod.string().date(),
  description: zod.string().min(1, { message: 'Description is required' }),
  category: zod.enum(categoryValues),
  notes: zod.string(),
  fileName: zod.string().optional(),
  items: zod.array(
    zod.object({
      item: zod.string().min(1, { message: 'Item is required' }),
      quantity: zod.coerce.number().min(0, { message: 'Quantity is required' }),
      unit: zod.string().min(1, { message: 'Unit is required' }),
      unitPrice: zod.coerce
        .number()
        .min(0.01, { message: 'Unit price is required' }),
      discountPrice: zod.coerce
        .number()
        .min(0, { message: 'Discount price is required' }),
      notes: zod.string(),
    })
  ),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  date: dayjs().format('YYYY-MM-DD'),
  description: '',
  category: categories[0].value,
  notes: '',
  fileName: '',
  items: [],
} satisfies Values;

const defaultItemValues = {
  item: '',
  quantity: 1,
  unit: '',
  unitPrice: 0.01,
  discountPrice: 0,
  notes: '',
} as const;

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
  // Current receipt detail
  const [receiptDetail, setReceiptDetail] =
    React.useState<Values>(defaultValues);
  const [isPending, setIsPending] = React.useState(false);

  // Control the editable state
  const [editable, setEditable] = React.useState(toAdd);
  const cancelEdit = () => {
    setEditable(false);
    getReceiptDetail(receiptId);
  };

  const [images, setImages] = React.useState<ImageFile[]>([]);
  // Get receipt detail
  const getReceiptDetail = async (id: string) => {
    setIsPending(true);
    try {
      const { message, data } = await getReceiptById({ id });
      if (message) {
        console.log(message);
      } else {
        const formData = {
          ...data,
          date: dayjs(data?.date).format('YYYY-MM-DD'),
          fileName: data?.fileName,
        } as Values;
        setReceiptDetail(formData);
        if (data?.fileName && data?.fileUrl) {
          const file = {
            name: data.fileName,
            preview: data.fileUrl,
          } as ImageFile;
          setImages([file]);
        }
      }
    } catch (error: any) {
      console.error(
        'An error occurred:',
        error.response?.data.detail || error.message
      );
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

  const uploadImage = async () => {
    try {
      // TODO: CHECK FILE MD5
      if (images.length === 0 || images[0].name === receiptDetail.fileName) {
        return Promise.resolve();
      }
      const { message, data } = await generatePresignedUrl({
        fileName: images[0].name,
      });
      if (message) {
        throw new Error(message);
      }
      if (data) {
        return axios.put(data?.url, images[0], {
          headers: {
            'Content-Type': images[0].type,
          },
        });
      }
      return Promise.reject('No URL');
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
      return Promise.reject('No URL');
    }
  };

  // Submit receipt
  const onSubmit = async (values: Values) => {
    setIsPending(true);
    try {
      await uploadImage();
      const params = {
        ...values,
        date: dayjs(values.date).format('YYYY-MM-DD'), // Format date
        amount: amount,
        fileName: images[0]?.name,
      };
      let response;

      if (toAdd) {
        response = await createReceipt(params as CreateReceiptParams);
      } else {
        response = await updateReceipt({
          id: receiptId,
          ...params,
        } as UpdateReceiptParams);
      }

      const { message, data } = response;

      if (message) {
        console.log(message);
      } else {
        const formData = {
          ...data,
          date: dayjs(data?.date).format('YYYY-MM-DD'), // Format date
        } as Values;
        setReceiptDetail(formData);
        setEditable(false);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error appropriately
    } finally {
      setIsPending(false);
    }
  };

  // table-related functions
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    values: receiptDetail,
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const results = useWatch({
    control,
    name: 'items',
  });

  let amount = results.reduce(
    (acc, item) => acc + item.quantity * item.discountPrice,
    0
  );

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
          <Stack
            direction={'row'}
            spacing={3}
            p={3}
            justifyContent="space-between"
          >
            <Stack spacing={3} p={3} className="flex-1">
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
                            <FormHelperText>
                              {errors.date.message}
                            </FormHelperText>
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
                            inputProps={{ maxLength: 100 }}
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
                          <Select
                            {...field}
                            label="Category"
                            variant="outlined"
                          >
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
                            inputProps={{ maxLength: 100 }}
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
                      <Typography variant="h6">
                        {receiptDetail.notes}
                      </Typography>
                    </>
                  )}
                </Stack>
              </Stack>
            </Stack>
            <ImageUpload
              images={images}
              setImages={setImages}
              editable={editable}
            ></ImageUpload>
          </Stack>
          <Divider />
          <Stack spacing={3} p={3}>
            <Typography variant="h6" className="font-semibold">
              Items
            </Typography>

            {fields.map((field, index) => (
              <Stack key={field.id} spacing={3} direction="row">
                {Object.keys(defaultItemValues).map((key) => {
                  const newKey = key as keyof typeof defaultItemValues;
                  return (
                    <>
                      {/* Add the amount column */}
                      {key == 'notes' && (
                        <ReceiptAmountItem
                          key={field.id + 'amount'}
                          control={control}
                          index={index}
                        ></ReceiptAmountItem>
                      )}
                      <ReceiptInputItem
                        key={field.id + key}
                        control={control}
                        name={`items.${index}.${key}` as FieldPath<Values>}
                        label={key}
                        type={
                          key === 'quantity' ||
                          key === 'unitPrice' ||
                          key === 'discountPrice'
                            ? 'number'
                            : 'text'
                        }
                        editable={editable}
                        error={errors.items?.[index]?.[newKey]}
                        maxLength={
                          key === 'item' ? 50 : key === 'notes' ? 100 : 20
                        }
                      ></ReceiptInputItem>
                    </>
                  );
                })}
                {editable && (
                  <IconButton onClick={() => remove(index)}>
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
                onClick={() => append(defaultItemValues)}
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
                {amount.toFixed(2)}
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

const ReceiptAmountItem = ({
  control,
  index,
}: {
  control: Control<Values>;
  index: number;
}) => {
  const data = useWatch({
    control,
    name: `items.${index}`,
  });
  return (
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
        label="Amount"
        value={(data.quantity * data.discountPrice).toFixed(2)}
      />
    </FormControl>
  );
};

const ReceiptInputItem = ({
  control,
  name,
  error,
  label,
  editable,
  type,
  maxLength = 20,
}: {
  control: Control<Values>;
  name: FieldPath<Values>;
  error: FieldError | undefined;
  label: string;
  editable: boolean;
  type: 'text' | 'number';
  maxLength?: number;
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
            type={type}
            inputProps={{ maxLength: maxLength }}
          />
          {error && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    ></Controller>
  );
};
