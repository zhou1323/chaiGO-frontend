'use client';

import ImageUpload from '@/app/[locale]/components/core/image-upload';
import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { generatePresignedUrl } from '@/lib/auth/client';
import {
  CreateReceiptParams,
  UpdateReceiptParams,
  createReceipt,
  getReceiptById,
  updateReceipt,
} from '@/lib/dashboard/receiptClient';
import useCustomizationStore from '@/store/customization';
import { ImageFile } from '@/types/imageFile';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Delete, KeyboardReturn } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs';
import * as React from 'react';
import {
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

const createSchema = (t: (key: string) => string) => {
  return zod.object({
    date: zod.string().date(),
    description: zod
      .string()
      .min(1, { message: t('common.descriptionRequired') }),
    category: zod.enum(categoryValues),
    notes: zod.string(),
    fileName: zod.string().nullable().optional(),
    items: zod.array(
      zod.object({
        item: zod.string().min(1, { message: t('common.itemRequired') }),
        quantity: zod.coerce
          .number()
          .min(0, { message: t('common.quantityRequired') }),
        unit: zod.string().min(1, { message: t('common.unitRequired') }),
        unitPrice: zod.coerce
          .number()
          .min(0.01, { message: t('common.unitPriceRequired') }),
        discountPrice: zod.coerce
          .number()
          .min(0, { message: t('common.discountPriceRequired') }),
        notes: zod.string(),
      })
    ),
  });
};

const defaultValues = {
  date: dayjs().format('YYYY-MM-DD'),
  description: '',
  category: categories[0].value,
  notes: '',
  fileName: '',
  items: [],
} as const;

const defaultItemValues = {
  item: '',
  quantity: 1,
  unit: '',
  unitPrice: 0.01,
  discountPrice: 0,
  amount: 0,
  notes: '',
} as const;

export default function ReceiptsItemPage({
  returnReceiptsList,
  receiptId = '',
  toAdd = false,
  toEdit = false,
  locale,
}: {
  returnReceiptsList: () => void;
  receiptId?: string;
  toAdd: boolean;
  toEdit: boolean;
  locale: string;
}): React.JSX.Element {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  const schema = createSchema(t);
  type Values = zod.infer<typeof schema>;

  // Current receipt detail
  const [receiptDetail, setReceiptDetail] = React.useState<Values>({
    ...defaultValues,
    items: [],
  });
  const [isPending, setIsPending] = React.useState<boolean>(false);

  // Control the editable state
  const [editable, setEditable] = React.useState<boolean>(toAdd);
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
    defaultValues: { ...defaultValues, items: [] },
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

  const getCurrencyString = useCustomizationStore(
    (state) => state.getCurrencyString
  );

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={0} alignItems="center">
        <IconButton onClick={returnReceiptsList}>
          <KeyboardReturn></KeyboardReturn>
        </IconButton>
        <Typography variant="h6">{t('receipts.title')}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" className="font-bold">
          {t('receipts.details')}
        </Typography>
        {toEdit && (
          <Button variant="contained" onClick={() => setEditable(true)}>
            {t('common.edit')}
          </Button>
        )}
      </Stack>
      <Card className="rounded-lg p-4 shadow">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction={'row'} spacing={6} justifyContent="space-between">
            <Stack spacing={3} className="flex-1">
              <Stack direction="row" spacing={3}>
                {/* Date */}
                <Stack
                  className="basis-1/2"
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography
                    variant="subtitle1"
                    className="min-w-24 font-semibold"
                  >
                    {t('common.date')}
                  </Typography>
                  {editable ? (
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          error={Boolean(errors.date)}
                          size="small"
                          className="flex-auto"
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...field}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                },
                              }}
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
                    <Typography variant="body1">
                      {dayjs(receiptDetail.date).format('YYYY-MM-DD')}
                    </Typography>
                  )}
                </Stack>

                {/* Category */}
                <Stack
                  className="basis-1/2"
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography
                    variant="subtitle1"
                    className="min-w-24 font-semibold"
                  >
                    {t('common.category')}
                  </Typography>
                  {editable ? (
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          error={Boolean(errors.category)}
                          size="small"
                          className="flex-auto"
                        >
                          <Select {...field} variant="outlined">
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
                    <Chip label={receiptDetail.category} variant="outlined" />
                  )}
                </Stack>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="start">
                {/* Description */}
                <Stack
                  className="basis-1/2"
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography
                    variant="subtitle1"
                    className="min-w-24 font-semibold"
                  >
                    {t('common.description')}
                  </Typography>
                  {editable ? (
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          hiddenLabel
                          size="small"
                          className="flex-auto"
                          error={!!errors.description}
                          helperText={errors.description?.message}
                        />
                      )}
                    ></Controller>
                  ) : (
                    <>
                      <Typography variant="body1">
                        {receiptDetail.description}
                      </Typography>
                    </>
                  )}
                </Stack>

                {/* Notes */}
                <Stack className="basis-1/2" direction="row" spacing={1}>
                  <Typography
                    variant="subtitle1"
                    className="min-w-24 font-semibold"
                  >
                    {t('common.notes')}
                  </Typography>
                  {editable ? (
                    <Controller
                      name="notes"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          hiddenLabel
                          size="small"
                          multiline
                          maxRows={4}
                          className="flex-auto"
                          error={!!errors.notes}
                          helperText={errors.notes?.message}
                        />
                      )}
                    ></Controller>
                  ) : (
                    <Typography variant="body1">
                      {receiptDetail.notes}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Stack>
            {images.length === 0 && !editable ? (
              <Box component="img" className="invisible h-48 w-48" />
            ) : (
              <ImageUpload
                images={images}
                setImages={setImages}
                editable={editable}
              ></ImageUpload>
            )}
          </Stack>
          <Divider className="my-4" />
          <Stack spacing={2}>
            <Typography variant="h6" className="font-semibold">
              {t('receipts.items')}
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(defaultItemValues).map((column) => (
                    <TableCell key={column} className="font-bold">
                      {t(`receipts.${column}`)}
                    </TableCell>
                  ))}

                  {editable && <TableCell></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    {Object.keys(defaultItemValues).map((key) => {
                      const newKey = key as keyof typeof defaultItemValues;
                      return (
                        <TableCell key={field.id + key}>
                          {/* Add the amount column */}
                          {newKey == 'amount' ? (
                            <ReceiptAmountItem
                              control={control}
                              index={index}
                            ></ReceiptAmountItem>
                          ) : (
                            <ReceiptInputItem
                              control={control}
                              name={
                                `items.${index}.${key}` as FieldPath<Values>
                              }
                              label={t(`receipts.${key}`)}
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
                          )}
                        </TableCell>
                      );
                    })}
                    {editable && (
                      <TableCell>
                        <IconButton onClick={() => remove(index)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {editable && (
              <Button
                variant="contained"
                className="w-32"
                startIcon={<Add />}
                onClick={() => append(defaultItemValues)}
              >
                {t('receipts.addItem')}
              </Button>
            )}
          </Stack>
          <Stack alignItems="end" spacing={6} paddingTop={3}>
            <Stack direction="row" spacing={10}>
              <Typography variant="h6" className="font-semibold">
                {t('common.total')}
              </Typography>
              <Typography variant="h6">{getCurrencyString(amount)}</Typography>
            </Stack>

            <Stack direction="row" spacing={3}>
              {editable && (
                <>
                  {toEdit && (
                    <Button variant="outlined" onClick={cancelEdit}>
                      {t('common.cancel')}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isPending}
                  >
                    {t('common.save')}
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
  control: any;
  index: number;
}) => {
  const data = useWatch({
    control,
    name: `items.${index}`,
  });
  return (
    <Typography variant="body1">
      {(data.quantity * data.discountPrice).toFixed(2)}
    </Typography>
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
  control: any;
  name: any;
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
      render={({ field }) =>
        editable ? (
          <TextField
            {...field}
            inputProps={{ maxLength: maxLength }}
            hiddenLabel
            size="small"
            error={!!error}
            placeholder={label}
            type={type}
            helperText={error?.message}
          />
        ) : (
          <Typography variant="body1">{field.value?.toString()}</Typography>
        )
      }
    ></Controller>
  );
};
