import { Component, OnInit } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tesseract Test';

  readonly tesseract;

  ocr: string;
  processes: Array<{ status: string, progress: string }>;
  process: { status: string, progress: string };
  alert: { type: string, message: string };
  action = false;
  url = 'assets/poesia01.jpeg';
  // url = 'assets/textos.png';
  // url = 'assets/ponto.jpg';
  // url = 'assets/teste01.jpg';
  // url = 'https://tesseract.projectnaptha.com/img/eng_bw.png';

  constructor() {}

  ngOnInit(): void {

  }

  close(alert: Alert) {
    this.alert = null;
  }

  start(): void {
    const worker = new Tesseract.TesseractWorker({
      workerPath: 'https://unpkg.com/tesseract.js@v2.0.0-alpha.10/dist/worker.min.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0/por.traineddata.gz',
      corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0-beta.10/tesseract-core.wasm.js'});
    this.clear();
    this.action = true;
    // doc: https://github.com/naptha/tesseract.js/blob/master/docs/tesseract_parameters.md
    worker
      .recognize(this.url, 'por')
      .progress((p) => {
        this.process = p;
        this.ocr = null;
        this.process.progress = Math.round(p.progress * 100).toFixed(0);
        let position = -1;
        const value = this.processes.some((element, index, array) => {
          let equal = element.status === p.status;
          if (equal) {
            position = index;
          }
          return equal;
        });
        if (value) {
          this.processes[position].progress = p.progress;
        } else {
          this.processes.push(p);
        }
      })
      .catch((error) => {
        console.log(error);
        this.alert = { type: 'danger', message: error };
      })
      .finally(resultOrError => {
        // console.log(resultOrError);
        // this.alert = {type: 'success', message: resultOrError};
      })
      .then((result) => {
        this.ocr = result.text;
        this.alert = { type: 'success', message: 'Process completed successfully!' };
        this.action = false;
        worker.terminate();
        this.clear();
      });
  }

  private clear(): void {
    this.processes = new Array<{ status: string, progress: string }>();
    this.alert = null;
    this.process = null;
  }

  onmouseover($event: any, drop: any): void {
    // drop.open();
    // $event.stopPropagation();
    // $event.preventDefault();
  }

  onmouseout($event: any, drop: any): void {
    // drop.close();
    // $event.stopPropagation();
    // $event.preventDefault();
  }

}
