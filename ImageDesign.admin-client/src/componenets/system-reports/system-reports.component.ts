import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatTableModule } from "@angular/material/table"
import { MatChipsModule } from "@angular/material/chips"
import { MatSortModule } from "@angular/material/sort"
import { NgChartsModule } from "ng2-charts"
import { ChartData, ChartOptions } from "chart.js"
import { UserService } from "../../services/user.service"
import { AlbumService } from "../../services/album.service"
import { PhotosService } from "../../services/photos.service"
import { TagService } from "../../services/tag.service"

interface SystemSummary {
  totalUsers: number
  totalAlbums: number
  totalPhotos: number
  totalStorage: number
  totalTags: number
  deletedPhotos: number
}

interface UserActivity {
  id: number
  firstName: string
  lastName: string
  email: string
  albumsCount: number
  photosCount: number
  storageUsed: number
  lastActivity: Date
}

interface PopularAlbum {
  id: number
  albumName: string
  ownerName: string
  photosCount: number
}

interface StorageBreakdown {
  activePhotos: number
  deletedPhotos: number
  total: number
}

@Component({
  selector: "app-system-reports",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatSortModule,
    NgChartsModule,
  ],
  templateUrl: "./system-reports.component.html",
  styleUrls: ["./system-reports.component.css"],
})
export class SystemReportsComponent implements OnInit {
  systemSummary: SystemSummary = {
    totalUsers: 0,
    totalAlbums: 0,
    totalPhotos: 0,
    totalStorage: 0,
    totalTags: 0,
    deletedPhotos: 0,
  }

  userActivityReport: UserActivity[] = []
  popularAlbums: PopularAlbum[] = []
  storageBreakdown: StorageBreakdown = {
    activePhotos: 0,
    deletedPhotos: 0,
    total: 0,
  }

  userActivityColumns: string[] = ["userName", "email", "albumsCount", "photosCount", "storageUsed", "lastActivity"]

  // נתוני גרפים
  tagsChartData: ChartData<"doughnut"> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  }

  tagsChartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  }

  registrationsChartData: ChartData<"line"> = {
    labels: [],
    datasets: [
      {
        label: "רישומים חודשיים",
        data: [],
        borderColor: "#FF0000",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        tension: 0.3,
      },
    ],
  }

  registrationsChartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  constructor(
    private userService: UserService,
    private albumService: AlbumService,
    private photoService: PhotosService,
    private tagService: TagService,
  ) {}

  ngOnInit(): void {
    this.loadAllReports()
  }

  loadAllReports(): void {
    this.loadSystemSummary()
    this.loadUserActivityReport()
    this.loadPopularAlbums()
    this.loadTagsChart()
    this.loadRegistrationsChart()
    this.loadStorageBreakdown()
  }

  loadSystemSummary(): void {
    // טעינת סיכום המערכת
    this.userService.getAllUsers().subscribe((users) => {
      this.systemSummary.totalUsers = users.length
    })

    this.albumService.getAllAlbums().subscribe((albums) => {
      this.systemSummary.totalAlbums = albums.length
    })

    this.photoService.getAllPhotos().subscribe((photos) => {

      this.systemSummary.totalPhotos = photos.length
      this.systemSummary.totalStorage = photos.reduce((sum, photo) => sum + (photo.photoSize || 0), 0)
    })

    this.photoService.getDeletedPhotos().subscribe((deletedPhotos) => {
      this.systemSummary.deletedPhotos = deletedPhotos.length
    })

    this.tagService.getAllTags().subscribe((tags) => {
      this.systemSummary.totalTags = tags.length
    })
  }

  loadUserActivityReport(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.userActivityReport = users.map((user) => ({
        id: user.id!,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        albumsCount: 0,
        photosCount: 0,
        storageUsed: 0,
        lastActivity: new Date(),
      }))

      // טעינת נתונים נוספים לכל משתמש
      this.userActivityReport.forEach((userActivity) => {
        this.albumService.getAlbumsByUserId(userActivity.id).subscribe((albums) => {
          userActivity.albumsCount = albums.length
        })

        this.albumService.getAllPhotosByUserId(userActivity.id).subscribe((photos) => {
          userActivity.photosCount = photos.length
          userActivity.storageUsed = photos.reduce((sum, photo) => sum + (photo.photoSize || 0), 0)
        })
      })
    })
  }

  loadPopularAlbums(): void {
    this.albumService.getAllAlbums().subscribe((albums) => {
      const albumsWithPhotos = albums.map((album) => ({
        id: album.id!,
        albumName: album.albumName,
        ownerName: "לא ידוע",
        photosCount: 0,
      }))

      albumsWithPhotos.forEach((album) => {
        this.albumService.getImagesByAlbumId(album.id).subscribe((photos) => {
          album.photosCount = photos.length
        })
      })

      this.popularAlbums = albumsWithPhotos.sort((a, b) => b.photosCount - a.photosCount).slice(0, 10)
    })
  }

  loadTagsChart(): void {
    this.tagService.getAllTags().subscribe((tags) => {
      const tagData = tags.map((tag) => ({
        name: tag.tagName || "לא ידוע",
        count: 0,
      }))

      tagData.forEach((tag) => {
        const tagEntity = tags.find((t) => t.tagName === tag.name)
        if (tagEntity?.id) {
          this.photoService.getPhotosByTagId(tagEntity.id).subscribe((photos) => {
            tag.count = photos.length
            this.updateTagsChart(tagData)
          })
        }
      })
    })
  }

  updateTagsChart(tagData: any[]): void {
    const sortedTags = tagData
      .filter((tag) => tag.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    this.tagsChartData = {
      labels: sortedTags.map((tag) => tag.name),
      datasets: [
        {
          data: sortedTags.map((tag) => tag.count),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
        },
      ],
    }
  }

  loadRegistrationsChart(): void {
    this.userService.getMonthlyRegistrations().subscribe((registrations) => {
      this.registrationsChartData = {
        labels: registrations.map((r) => `${r.month}/${r.year}`),
        datasets: [
          {
            label: "רישומים חודשיים",
            data: registrations.map((r) => r.count),
            borderColor: "#FF0000",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            tension: 0.3,
          },
        ],
      }
    })
  }

  loadStorageBreakdown(): void {
    this.photoService.getAllPhotos().subscribe((activePhotos) => {
      this.storageBreakdown.activePhotos = activePhotos.reduce((sum, photo) => sum + (photo.photoSize || 0), 0)

      this.photoService.getDeletedPhotos().subscribe((deletedPhotos) => {
        this.storageBreakdown.deletedPhotos = deletedPhotos.reduce((sum, photo) => sum + (photo.photoSize || 0), 0)
        this.storageBreakdown.total = this.storageBreakdown.activePhotos + this.storageBreakdown.deletedPhotos
      })
    })
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  getStoragePercentage(type: "active" | "deleted"): number {
    if (this.storageBreakdown.total === 0) return 0

    if (type === "active") {
      return (this.storageBreakdown.activePhotos / this.storageBreakdown.total) * 100
    } else {
      return (this.storageBreakdown.deletedPhotos / this.storageBreakdown.total) * 100
    }
  }

  refreshAllReports(): void {
    this.loadAllReports()
  }

  exportReports(): void {
    // כאן תוכל להוסיף לוגיקה לייצוא הדוחות
    console.log("ייצוא דוחות")
  }
}
