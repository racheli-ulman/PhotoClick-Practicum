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
import  { MatDialog } from "@angular/material/dialog"
import  { Album } from "../../models/album"
import  { User } from "../../models/user"
import  { AlbumService } from "../../services/album.service"
import  { UserService } from "../../services/user.service"

@Component({
  selector: "app-album-management",
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
  ],
  templateUrl: "./album-management.component.html",
  styleUrls: ["./album-management.component.css"],
})
export class AlbumManagementComponent implements OnInit {
  albums: Album[] = []
  filteredAlbums: Album[] = []
  users: User[] = []

  // סטטיסטיקות
  totalAlbums = 0
  albumsWithPhotos = 0
  emptyAlbums = 0

  // פילטרים
  searchTerm = ""
  selectedUserId = ""
  selectedStatus = ""

  displayedColumns: string[] = ["id", "albumName", "description", "userId", "photosCount", "actions"]

  constructor(
    private albumService: AlbumService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadAlbums()
    this.loadUsers()
  }

  loadAlbums(): void {
    this.albumService.getAllAlbums().subscribe({
      next: (data) => {
        this.albums = data
        this.filteredAlbums = [...data]
        this.calculateStatistics()
        this.loadPhotoCounts()
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

  loadPhotoCounts(): void {
    this.albums.forEach((album) => {
      this.albumService.getImagesByAlbumId(album.id!).subscribe({
        next: (photos) => {
          album.photosCount= photos.length
          this.calculateStatistics()
        },
        error: (error) => {
          album.photosCount = 0
        },
      })
    })
  }

  calculateStatistics(): void {
    this.totalAlbums = this.albums.length
    this.albumsWithPhotos = this.albums.filter((album) => (album.photosCount || 0) > 0).length
    this.emptyAlbums = this.albums.filter((album) => (album.photosCount || 0) === 0).length
  }

  filterAlbums(): void {
    this.filteredAlbums = this.albums.filter((album) => {
      const matchesSearch =
        !this.searchTerm ||
        album.albumName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (album.description && album.description.toLowerCase().includes(this.searchTerm.toLowerCase()))

      const matchesUser = !this.selectedUserId || album.userId?.toString() === this.selectedUserId

      const matchesStatus =
        !this.selectedStatus ||
        (this.selectedStatus === "with-photos" && (album.photosCount || 0) > 0) ||
        (this.selectedStatus === "empty" && (album.photosCount || 0) === 0)

      return matchesSearch && matchesUser && matchesStatus
    })
  }

  getUserName(userId: number | null): string {
    if (!userId) return "לא ידוע"
    const user = this.users.find((u) => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : "לא ידוע"
  }

  openAddAlbumDialog(): void {
    // כאן תוכל לפתוח דיאלוג להוספת אלבום חדש
    console.log("פתיחת דיאלוג הוספת אלבום")
  }

  viewAlbumPhotos(albumId: number): void {
    // ניווט לדף תמונות האלבום
    console.log("צפייה בתמונות אלבום:", albumId)
  }

  editAlbum(album: Album): void {
    // פתיחת דיאלוג עריכת אלבום
    console.log("עריכת אלבום:", album)
  }

  deleteAlbum(albumId: number): void {
    if (confirm("האם אתה בטוח שברצונך למחוק אלבום זה?")) {
      this.albumService.deleteAlbum(albumId).subscribe({
        next: () => {
          this.albums = this.albums.filter((a) => a.id !== albumId)
          this.filterAlbums()
          this.calculateStatistics()
        },
        error: (error) => {
          console.error("שגיאה במחיקת האלבום:", error)
        },
      })
    }
  }
}
