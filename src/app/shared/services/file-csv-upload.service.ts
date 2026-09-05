import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class FileCsvUploadService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {}

  public upload(formData: FormData, fileType: string) {
    const headers = new HttpHeaders();

    if (!/image\//.exec(fileType)) {
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
    } else {
      headers.append('Content-Type', fileType);
    }

    const httpOptions = { headers };

    return this.httpClient.post(
      `${this.configService.getProperty(
        'apiUrl'
      )}/client/client-consumption-data`,
      formData,
      httpOptions
    );
  }
}
