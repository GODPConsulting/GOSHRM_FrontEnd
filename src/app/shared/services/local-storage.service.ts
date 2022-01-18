import { Inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * Local storage service
 * used for persist application data in observable key value pair
 */
@Injectable()
export class LocalStorageService extends StorageService {
  /**
   * Constructor with service injection
   * @param window
   */
  constructor(@Inject('WINDOW') window: any) {
    super(window.localStorage);
  }
}
