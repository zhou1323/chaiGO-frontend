import ImageUpload from '@/app/[locale]/components/core/image-upload';
import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { ImageFile } from '@/types/imageFile';
import { Close } from '@mui/icons-material';
import { Divider, IconButton, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

interface UploadDialogProps {
  uploadProps: {
    openUploadDialog: boolean;
    handleUploadClose: () => void;
    handleUpload: (files: ImageFile[]) => Promise<void>;
  };
  locale: string;
}

export default function UploadDialog({
  uploadProps,
  locale,
}: UploadDialogProps): React.JSX.Element {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  const [images, setImages] = React.useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleDialogClose = () => {
    setImages([]);
    uploadProps.handleUploadClose();
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      await uploadProps.handleUpload(images);
      setImages([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={uploadProps.openUploadDialog}
      onClose={handleDialogClose}
      maxWidth="md"
      PaperProps={{
        className: 'w-full',
      }}
    >
      <DialogTitle className="p-4">{t('receipts.uploadReceipts')}</DialogTitle>
      <IconButton
        onClick={handleDialogClose}
        className="absolute right-2 top-2"
      >
        <Close />
      </IconButton>
      <Divider />
      <DialogContent className="p-4">
        <Stack spacing={1}>
          <DialogContentText>
            {t('receipts.uploadDescription')}
          </DialogContentText>

          <ImageUpload
            maxFileLength={1}
            maxFileSize={5}
            images={images}
            setImages={setImages}
          />

          <DialogContentText>
            {t('receipts.supportedReceipts')}
          </DialogContentText>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions className="px-4 py-2">
        <Button onClick={handleDialogClose}>{t('common.cancel')}</Button>
        <Button
          disabled={isUploading}
          onClick={handleUpload}
          variant="contained"
        >
          {t('common.upload')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
