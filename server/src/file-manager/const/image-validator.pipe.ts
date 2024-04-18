import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

export const ImageValidatorPipe = (maxSizeInMB: number) => {
  return new ParseFilePipe({
    fileIsRequired: false,
    validators: [
      new FileTypeValidator({
        fileType: /image\/[a-zA-Z]*$/,
      }),
      new MaxFileSizeValidator({
        maxSize: 1024 * 1024 * maxSizeInMB,
      }),
    ],
  });
};
