import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatTableModule } from "@angular/material/table"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatChipsModule } from "@angular/material/chips"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSortModule } from "@angular/material/sort"
import { MatDialog } from "@angular/material/dialog"
import { Tag } from "../../models/tag"
import { TagService } from "../../services/tag.service"
import { PhotosService } from "../../services/photos.service"

interface TagWithCount extends Tag {
  photosCount: number
}

@Component({
  selector: "app-tag-management",
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
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: "./tag-management.component.html",
  styleUrls: ["./tag-management.component.css"],
})
export class TagManagementComponent implements OnInit {
  tags: TagWithCount[] = []
  filteredTags: TagWithCount[] = []

  // סטטיסטיקות
  totalTags = 0
  usedTags = 0
  unusedTags = 0

  // פילטרים
  searchTerm = ""

  displayedColumns: string[] = ["id", "tagName", "photosCount", "status", "actions"]

  constructor(
    private tagService: TagService,
    private photoService: PhotosService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadTags()
  }

  loadTags(): void {
    this.tagService.getAllTags().subscribe({
      next: (data) => {
        this.tags = data.map((tag) => ({ ...tag, photosCount: 0 }))
        this.filteredTags = [...this.tags]
        console.log("תגיות נטענו:", this.tags);
        
        // this.loadPhotoCounts()
        this.calculateStatistics()
      },
      error: (error) => {
        console.error("שגיאה בטעינת התגיות:", error)
      },
    })
  }

  loadPhotoCounts(): void {
    this.tags.forEach((tag) => {
      if (tag.id) {
        this.photoService.getPhotosByTagId(tag.id).subscribe({
          
          next: (photos) => {
            tag.photosCount = photos.length
            this.calculateStatistics()
          },
          error: (error) => {
            tag.photosCount = 0
          },
        })
      }
    })
  }

  calculateStatistics(): void {
    this.totalTags = this.tags.length
    this.usedTags = this.tags.filter((tag) => tag.photosCount > 0).length
    this.unusedTags = this.tags.filter((tag) => tag.photosCount === 0).length
  }

  filterTags(): void {
    this.filteredTags = this.tags.filter((tag) => {
      const matchesSearch =
        !this.searchTerm || (tag.tagName && tag.tagName.toLowerCase().includes(this.searchTerm.toLowerCase()))

      return matchesSearch
    })
  }

  openAddTagDialog(): void {
    // כאן תוכל לפתוח דיאלוג להוספת תגית חדשה
    console.log("פתיחת דיאלוג הוספת תגית")
  }

  viewTagPhotos(tagId: number): void {
    // ניווט לדף תמונות התגית
    console.log("צפייה בתמונות תגית:", tagId)
  }

  editTag(tag: TagWithCount): void {
    // פתיחת דיאלוג עריכת תגית
    console.log("עריכת תגית:", tag)
  }

  deleteTag(tagId: number): void {
    const tag = this.tags.find((t) => t.id === tagId)
    if (tag && tag.photosCount > 0) {
      alert("לא ניתן למחוק תגית שיש לה תמונות משויכות")
      return
    }

    if (confirm("האם אתה בטוח שברצונך למחוק תגית זו?")) {
      this.tagService.deleteTag(tagId).subscribe({
        next: () => {
          this.tags = this.tags.filter((t) => t.id !== tagId)
          this.filterTags()
          this.calculateStatistics()
        },
        error: (error) => {
          console.error("שגיאה במחיקת התגית:", error)
        },
      })
    }
  }
}
