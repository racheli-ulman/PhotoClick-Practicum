import { Component, OnInit } from '@angular/core';
import { MonthlyRegistrationsDto } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts'; // ייבוא המודול


@Component({
  selector: 'app-statistics',
  imports: [CommonModule, NgChartsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {
  monthlyRegistrations: MonthlyRegistrationsDto[] = [];
  totalRegistrations: number = 0;
  averageRegistrations: number = 0;
  maxRegistrations: number = 0;
  maxRegistrationMonth: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  
  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'נרשמים חודשיים',
        data: [],
        fill: true,
        backgroundColor: 'rgba(255, 0, 0, 0.1)', // אדום בשקיפות נמוכה למילוי
        borderColor: '#FF0000', // אדום לקו הגרף
        tension: 0.3, // קו חלק יותר
        pointBackgroundColor: '#000000', // נקודות שחורות
        pointBorderColor: '#FFFFFF', // גבול לבן לנקודות
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#FF0000', // אדום בעת hover
      },
      {
        label: 'ממוצע נרשמים',
        data: [],
        fill: false,
        borderColor: '#000000', // קו שחור לממוצע
        borderDash: [5, 5], // קו מקווקו
        pointRadius: 0, // ללא נקודות
        borderWidth: 2,
        tension: 0.1
      }
    ]
  };

  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 3
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#000000'
        },
        title: {
          display: true,
          text: 'מקרא',
          color: '#000000',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#000000',
        bodyColor: '#000000',
        borderColor: '#000000',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          weight: 'bold',
          size: 14
        },
        callbacks: {
          title: function(tooltipItems) {
            return 'חודש: ' + tooltipItems[0].label;
          },
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' נרשמים';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'חודש ושנה',
          color: '#000000',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#000000'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'מספר נרשמים',
          color: '#000000',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#000000'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getMonthlyRegistrations();
  }

  getMonthlyRegistrations(): void {
    this.isLoading = true;
    this.userService.getMonthlyRegistrations().subscribe({
      next: data => {
        this.monthlyRegistrations = data;
        this.prepareChartData();
        this.calculateStatistics();
        this.isLoading = false;
      }, 
      error: error => {
        console.error('שגיאה בטעינת נתוני הרישום:', error);
        this.errorMessage = 'אירעה שגיאה בטעינת נתוני הרישום החודשיים';
        this.isLoading = false;
      }
    });
  }

  prepareChartData(): void {
    const labels: string[] = [];
    const registrationCounts: number[] = [];
    
    this.monthlyRegistrations.forEach(item => {
      const label = `${item.month}/${item.year}`;
      labels.push(label);
      registrationCounts.push(item.count);
    });

    // חישוב הממוצע
    const average = this.calculateAverage(registrationCounts);
    const averageLine = Array(registrationCounts.length).fill(average);

    this.chartData.labels = labels;
    this.chartData.datasets[0].data = registrationCounts;
    this.chartData.datasets[1].data = averageLine;
  }

  calculateStatistics(): void {
    if (this.monthlyRegistrations.length === 0) return;

    const counts = this.monthlyRegistrations.map(item => item.count);
    
    // סה"כ נרשמים
    this.totalRegistrations = counts.reduce((sum, current) => sum + current, 0);
    
    // ממוצע נרשמים
    this.averageRegistrations = Math.round(this.totalRegistrations / counts.length);
    
    // מציאת השיא
    this.maxRegistrations = Math.max(...counts);
    const maxIndex = counts.indexOf(this.maxRegistrations);
    const maxMonth = this.monthlyRegistrations[maxIndex];
    this.maxRegistrationMonth = `${maxMonth.month}/${maxMonth.year}`;
  }

  calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((total, num) => total + num, 0);
    return Math.round(sum / numbers.length);
  }
}