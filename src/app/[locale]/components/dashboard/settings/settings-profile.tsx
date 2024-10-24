import { updateUserMe } from '@/lib/dashboard/userClient';
import useUserStore from '@/store/user';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const schema = zod.object({
  username: zod
    .string()
    .min(1, { message: 'Username should be at least 1 character' })
    .max(30, { message: 'Username should be at most 30 characters' }),
  email: zod.string().email({ message: 'Invalid email address' }),
});

type Values = zod.infer<typeof schema>;

export default function SettingsProfile() {
  const [toSet, setToSet] = React.useState(false);

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const defaultValues: Values = {
    username: user?.username || '',
    email: user?.email || '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({
    defaultValues,
    values: { username: user?.username || '', email: user?.email || '' },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: Values) => {
    try {
      const { message, data } = await updateUserMe(values);
      if (message) {
        throw new Error(message);
      }
      data && updateUser(data);
      setToSet(false);
    } catch (error: any) {
      console.log(error.response?.data.detail || error.message);
    }
  };

  const onCancel = () => {
    setToSet(false);
    reset({ ...defaultValues });
  };

  return (
    <Card className="w-1/2">
      <CardHeader title="User Information" />
      <Divider />
      <CardContent>
        <form>
          <Stack spacing={2}>
            <Box>
              <Typography className="font-bold">Username</Typography>
              <Controller
                control={control}
                name="username"
                render={({ field }) =>
                  toSet ? (
                    <TextField
                      {...field}
                      hiddenLabel
                      className="w-72"
                      size="small"
                      variant="outlined"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                    />
                  ) : (
                    <>
                      <Typography className="h-10 leading-10">
                        {user?.username}
                      </Typography>
                    </>
                  )
                }
              />
            </Box>
            <Box>
              <Typography className="font-bold">Email address</Typography>
              <Controller
                control={control}
                name="email"
                render={({ field }) =>
                  toSet ? (
                    <TextField
                      {...field}
                      hiddenLabel
                      className="w-72"
                      size="small"
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  ) : (
                    <>
                      <Typography className="h-10 leading-10">
                        {user?.email}
                      </Typography>
                    </>
                  )
                }
              />
            </Box>
          </Stack>
        </form>
      </CardContent>
      <Divider />
      <CardActions className="justify-end px-4 py-2">
        {toSet ? (
          <Stack direction="row" spacing={2}>
            <Button
              className="w-20"
              type="button"
              size="small"
              variant="outlined"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="w-20"
              size="small"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </Stack>
        ) : (
          <Button
            className="inline w-20"
            variant="contained"
            size="small"
            onClick={() => setToSet(true)}
          >
            Edit
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
