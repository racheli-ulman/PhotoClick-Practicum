import { Component } from '@angular/core';
import { Photo } from '../../models/photo';
import { PhotosService } from '../../services/photos.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; // הוספת ייבוא של MatCardModule
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts'; // ייבוא המודול


@Component({
  selector: 'app-photos',
  imports: [MatCardModule, NgChartsModule],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.css'
})
export class PhotosComponent {
  // photos: Photo[] = [];
  // deletedPhotos: Photo[] = []; // משתנה חדש לתמונות מחוקות
  // errorMessage: string = '';
  //   constructor(private photoService: PhotosService, private router: Router) {
  //   }

  //   ngOnInit(): void {
  //     this.loadPhotos();
  //     this.loadDeletedPhotos(); // קריאה לתמונות מחוקות
  //   }

  //   loadPhotos(): void {
  //     this.photoService.getAllPhotos().subscribe({
  //       next: (data) => {
  //         this.photos = data;
  //         console.log("photos", this.photos.length);
  //       },
  //       error: (error) => {
  //         this.errorMessage = 'Failed to load photos';
  //         console.error(error);
  //       }
  //     });
  //   }

  //   loadDeletedPhotos(): void {
  //     this.photoService.getDeletedPhotos().subscribe({
  //       next: (data) => {
  //         this.deletedPhotos = data; // שמירת התמונות המחוקות
  //       },
  //       error: (error) => {
  //         this.errorMessage = 'Failed to load deleted photos';
  //         console.error(error);
  //       }
  //     });
  //   }

  //   getAbsoluteDifference(): number {
  //     return Math.abs(this.deletedPhotos.length - this.photos.length);
  //   }
  // }
  
  photos: Photo[] = [];
  deletedPhotos: Photo[] = [];
  errorMessage: string = '';
  
  // נתוני גרף עוגה
  pieChartData: ChartData<'pie'> = {
    labels: ['סה"כ תמונות ', 'תמונות מחוקות', 'תמוות פעילות'],
    datasets: [
      {
        data: [0, 0, 0], // ערכים ראשוניים - יעודכנו בהמשך
        backgroundColor: ['#FFFFFF', '#000000', '#FF0000'], // לבן, שחור, אדום
        borderColor: ['#d1d1d1', '#333333', '#cc0000'], // גבולות עם צבע מעט כהה יותר
      },
    ],
  };

  // הגדרת אפשרויות לגרף
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            return `${label}: ${value} תמונות`;
          }
        }
      }
    },
  };

  constructor(private photoService: PhotosService, private router: Router) {}

  ngOnInit(): void {
    this.loadPhotos();
    this.loadDeletedPhotos();
  }

  loadPhotos(): void {
    this.photoService.getAllPhotos().subscribe({
      next: (data) => {
        this.photos = data;
        this.updateChartData();
      },
      error: (error) => {
        this.errorMessage = 'שגיאה בטעינת התמונות הפעילות';
        console.error(error);
      }
    });
  }

  loadDeletedPhotos(): void {
    this.photoService.getDeletedPhotos().subscribe({
      next: (data) => {
        this.deletedPhotos = data;
        this.updateChartData();
      },
      error: (error) => {
        this.errorMessage = 'שגיאה בטעינת התמונות המחוקות';
        console.error(error);
      }
    });
  }

  getAbsoluteDifference(): number {
    return Math.abs(this.photos.length - this.deletedPhotos.length);
  }

  updateChartData(): void {
    const activeCount = this.photos.length;
    const deletedCount = this.deletedPhotos.length;
    const difference = this.getAbsoluteDifference();
    
    this.pieChartData = {
      labels: ['סה"כ תמונות ', 'תמונות מחוקות', 'תמונות פעילות'],
      datasets: [
        {
          data: [activeCount, deletedCount, difference],
          backgroundColor: ['#FFFFFF', '#000000', '#FF0000'], // לבן, שחור, אדום
          borderColor: ['#d1d1d1', '#333333', '#cc0000'], // גבולות עם צבע מעט כהה יותר
          borderWidth: 1
        },
      ],
    };
  }
}