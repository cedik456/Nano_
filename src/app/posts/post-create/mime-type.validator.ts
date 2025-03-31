import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimetype = (
  control: AbstractControl
): Observable<{ [key: string]: any } | null> => {
  // Check if the value is a string (e.g., existing imagePath)
  if (typeof control.value === 'string') {
    return of(null); // Return null if it's a string (no validation error)
  }

  const file = control.value as File;
  const filereader = new FileReader();

  const FRObs = new Observable<{ [key: string]: any } | null>(
    (observer: Observer<{ [key: string]: any } | null>) => {
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
          observer.next(null); // Emit null for valid cases (no error)
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
