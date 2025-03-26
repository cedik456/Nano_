import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

export const mimetype = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const filereader = new FileReader();

  const FRObs = new Observable<{ [key: string]: any }>(
    (observer: Observer<{ [key: string]: any }>) => {
      filereader.addEventListener('loadend', () => {
        const arr = new Uint8Array(filereader.result as ArrayBuffer).subarray(
          0,
          4
        );
        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        // Validate the file header against known MIME types
        let isValid = false;
        switch (header) {
          case '89504e47': // PNG
          case 'ffd8ffe0': // JPG
          case 'ffd8ffe1': // JPG
          case 'ffd8ffe2': // JPG
          case 'ffd8ffe3': // JPG
          case 'ffd8ffe8': // JPG
          case '47494638': // GIF
            isValid = true;
            break;
          default:
            isValid = false; // Invalid MIME type
            break;
        }

        if (isValid) {
          observer.next({}); // Emit an empty object for valid cases
        } else {
          observer.next({ invalidMimeType: true }); // Emit an error object for invalid cases
        }
        observer.complete(); // Signal that the observable is complete
      });

      filereader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    }
  );

  return FRObs;
};
