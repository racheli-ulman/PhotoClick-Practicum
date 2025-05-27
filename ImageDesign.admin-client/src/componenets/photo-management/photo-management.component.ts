import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatTableModule } from "@angular/material/table"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatChipsModule } from "@angular/material/chips"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSortModule } from "@angular/material/sort"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { SelectionModel } from "@angular/cdk/collections"
import { Photo } from "../../models/photo"
import { Album } from "../../models/album"
import { User } from "../../models/user"
import { Tag } from "../../models/tag"
import { PhotosService } from "../../services/photos.service"
import { AlbumService } from "../../services/album.service"
import { UserService } from "../../services/user.service"
import { TagService } from "../../services/tag.service"

@Component({
  selector: "app-photo-management",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
  ],
  templateUrl: "./photo-management.component.html",
  styleUrls: ["./photo-management.component.css"],
})
export class PhotoManagementComponent implements OnInit {
  photos: Photo[] = []
  filteredPhotos: Photo[] = []
  albums: Album[] = []
  users: User[] = []
  tags: Tag[] = []

  // סטטיסטיקות
  totalPhotos = 0
  deletedPhotosCount = 0
  totalSize = 0

  // פילטרים
  searchTerm = ""
  selectedAlbumId = ""
  selectedUserId = ""
  selectedTagId = ""

  // בחירה מרובה
  selection = new SelectionModel<Photo>(true, [])

  displayedColumns: string[] = [
    "select",
    "thumbnail",
    "photoName",
    "albumName",
    "userName",
    "photoSize",
    "tagName",
    "actions",
  ]

  constructor(
    private photoService: PhotosService,
    private albumService: AlbumService,
    private userService: UserService,
    private tagService: TagService,
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    this.loadPhotos()
    this.loadAlbums()
    this.loadUsers()
    this.loadTags()
    this.loadDeletedPhotosCount()
  }

  loadPhotos(): void {
    this.photoService.getAllPhotos().subscribe({
      next: (data) => {
        this.photos = data
        this.filteredPhotos = [...data]
        this.calculateStatistics()
      },
      error: (error) => {
        console.error("שגיאה בטעינת התמונות:", error)
      },
    })
  }

  loadAlbums(): void {
    this.albumService.getAllAlbums().subscribe({
      next: (data) => {
        this.albums = data
      },
      error: (error) => {
        console.error("שגיאה בטעינת האלבומים:", error)
      },
    })
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data
      },
      error: (error) => {
        console.error("שגיאה בטעינת המשתמשים:", error)
      },
    })
  }

  loadTags(): void {
    this.tagService.getAllTags().subscribe({
      next: (data) => {
        this.tags = data
      },
      error: (error) => {
        console.error("שגיאה בטעינת התגיות:", error)
      },
    })
  }

  loadDeletedPhotosCount(): void {
    this.photoService.getDeletedPhotos().subscribe({
      next: (data) => {
        this.deletedPhotosCount = data.length
      },
      error: (error) => {
        console.error("שגיאה בטעינת התמונות המחוקות:", error)
      },
    })
  }

  calculateStatistics(): void {
    this.totalPhotos = this.photos.length
    this.totalSize = this.photos.reduce((sum, photo) => sum + Number(photo.photoSize || 0), 0) / (1024 * 1024) // המרה ל-MB
  }

  filterPhotos(): void {
    this.filteredPhotos = this.photos.filter((photo) => {
      const matchesSearch = !this.searchTerm || photo.PhotoName.toLowerCase().includes(this.searchTerm.toLowerCase())

      const matchesAlbum = !this.selectedAlbumId || photo.AlbumId?.toString() === this.selectedAlbumId
      const matchesUser = !this.selectedUserId || photo.UserId?.toString() === this.selectedUserId
      const matchesTag = !this.selectedTagId || photo.tagId === this.selectedTagId

      return matchesSearch && matchesAlbum && matchesUser && matchesTag
    })
  }

  getAlbumName(albumId: number | null): string {
    if (!albumId) return "לא ידוע"
    const album = this.albums.find((a) => a.id === albumId)
    return album ? album.albumName : "לא ידוע"
  }

  getUserName(userId: number | null): string {
    if (!userId) return "לא ידוע"
    const user = this.users.find((u) => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : "לא ידוע"
  }

  getTagName(tagId: string): string {
    const tag = this.tags.find((t) => t.id?.toString() === tagId)
    return tag ? tag.tagName || "לא ידוע" : "לא ידוע"
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  onImageError(event: any): void {
    event.target.src = "/placeholder.svg?height=50&width=50"
  }

  // פונקציות בחירה מרובה
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length
    const numRows = this.filteredPhotos.length
    return numSelected === numRows
  }

  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.filteredPhotos.forEach((row) => this.selection.select(row))
  }

  // פעולות על תמונות
  viewPhoto(photo: Photo): void {
    console.log("צפייה בתמונה:", photo)
  }

  movePhoto(photo: Photo): void {
    console.log("העברת תמונה:", photo)
  }

  // deletePhoto(photoId: number): void {
  //   if (confirm("האם אתה בטוח שברצונך למחוק תמונה זו?")) {
  //     this.photoService.deletePhoto(photoId).subscribe({
  //       next: () => {
  //         this.photos = this.photos.filter((p) => p.id !== photoId)
  //         this.filterPhotos()
  //         this.calculateStatistics()
  //         this.loadDeletedPhotosCount()
  //       },
  //       error: (error) => {
  //         console.error("שגיאה במחיקת התמונה:", error)
  //       },
  //     })
  //   }
  // }

  bulkMovePhotos(): void {
    console.log("העברה קבוצתית:", this.selection.selected)
  }

  bulkDeletePhotos(): void {
    if (confirm(`האם אתה בטוח שברצונך למחוק ${this.selection.selected.length} תמונות?`)) {
      // כאן תוכל להוסיף לוגיקה למחיקה קבוצתית
      console.log("מחיקה קבוצתית:", this.selection.selected)
    }
  }

  viewRecycleBin(): void {
    console.log("צפייה בסל המחזור")
  }

  refreshData(): void {
    this.loadData()
    this.selection.clear()
  }
}
