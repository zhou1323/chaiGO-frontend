import ImageUpload from '@/app/[locale]/components/core/image-upload';
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
}

export default function UploadDialog({
  uploadProps,
}: UploadDialogProps): React.JSX.Element {
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
      <DialogTitle className="p-4">Upload receipts</DialogTitle>
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
            Upload your receipts here. You can upload up to 5MB of files.
          </DialogContentText>

          <ImageUpload
            maxFileLength={1}
            maxFileSize={5}
            images={images}
            setImages={setImages}
          />

          <DialogContentText>
            *Current supported: credit card statements from China Construction
            Bank, and receipts from Lidl and Willys.
          </DialogContentText>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions className="px-4 py-2">
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button
          disabled={isUploading}
          onClick={handleUpload}
          variant="contained"
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
