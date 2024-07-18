import ImageUpload from '@/components/core/image-upload';
import { ImageFile } from '@/types/imageFile';
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

  return (
    <Dialog
      open={uploadProps.openUploadDialog}
      onClose={uploadProps.handleUploadClose}
      maxWidth="md"
      PaperProps={{
        className: 'w-full',
      }}
    >
      <DialogTitle>Upload receipts</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={uploadProps.handleUploadClose}>Cancel</Button>
        <Button onClick={() => uploadProps.handleUpload(images)}>
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  );
}
