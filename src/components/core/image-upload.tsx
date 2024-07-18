import { ImageFile } from '@/types/imageFile';
import {
  AddCircleOutline,
  Close,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { Box, Card, CardMedia, Dialog, IconButton } from '@mui/material';
import * as React from 'react';

export default function ImageUpload({
  images,
  setImages,
  editable = true,
  multiple = false,
  maxFileSize = 5,
  maxFileLength = 1,
}: {
  images: ImageFile[];
  setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  editable?: boolean;
  multiple?: boolean;
  maxFileSize?: number;
  maxFileLength?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Create an array from the FileList object and filter files by size
      const maxFileSizeInBytes = maxFileSize * 1024 * 1024; // 5MB in bytes
      const files = [] as ImageFile[];

      let errorMsg = '';
      Array.from(e.target.files).forEach((file) => {
        // Update the state with new files if they meet the size requirement
        if (file.size <= maxFileSizeInBytes) {
          files.push(
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          );
        } else {
          errorMsg += 'Some files were not added. Maximum file size is 5MB. ';
        }
      });

      if (files.length > 0) {
        const newFiles = files.slice(0, maxFileLength - images.length);
        if (newFiles.length < files.length) {
          errorMsg += 'Maximum number of files reached.';
        }
        setImages((prevImages) => [...prevImages, ...newFiles]);
      }

      errorMsg && alert(errorMsg);
    }
  };

  const handleDelete = (file: ImageFile) => {
    setImages(images.filter((image) => image !== file));
    URL.revokeObjectURL(file.preview); // Free memory when image is removed
  };

  const handleClickOpen = (src: string) => {
    setOpen(true);
    setSelectedImage(src);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box className="py-4">
      <Box className="flex flex-wrap gap-2.5">
        {images.map((file, index) => (
          <Card key={index} className="relative w-48">
            <CardMedia
              component="img"
              image={file.preview}
              alt={file.name}
              className="h-48 w-full object-cover"
              onClick={() => handleClickOpen(file.preview)}
            />
            <Box className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <IconButton
                color="primary"
                onClick={() => handleClickOpen(file.preview)}
              >
                <Visibility />
              </IconButton>
              {editable && (
                <IconButton color="error" onClick={() => handleDelete(file)}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          </Card>
        ))}
        {editable && images.length < maxFileLength && (
          <label
            htmlFor="image-upload-input"
            className="flex h-48 w-48 cursor-pointer items-center justify-center border-2 border-dashed border-gray-300 bg-gray-100"
          >
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              multiple={multiple}
              id="image-upload-input"
              className="hidden"
            />
            <AddCircleOutline fontSize="large" />
          </label>
        )}
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <IconButton onClick={handleClose} className="absolute right-2 top-2">
          <Close />
        </IconButton>
        {selectedImage && (
          <img src={selectedImage} alt="Zoomed" style={{ width: '100%' }} />
        )}
      </Dialog>
    </Box>
  );
}
