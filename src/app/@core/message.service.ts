import { Injectable } from '@angular/core';
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbToastrService,
} from '@nebular/theme';

@Injectable()
export class MessageService {

  constructor(private toastrService: NbToastrService) {}

  // status: NbComponentStatus = 'warning';

  public showToast(title: string, body: string, status: NbComponentStatus) {

    const config = {
      status: status,
      destroyByClick: true,
      duration: 2000,
      hasIcon: true,
      position: NbGlobalLogicalPosition.TOP_END,
      preventDuplicates: false,
    };
    const titleContent = title ? `. ${title}` : '';

    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }

  /*
    0 - primary
    1 - success
    2 - info
    3 - warning
    4 - danger
  */
  types: NbComponentStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
}
