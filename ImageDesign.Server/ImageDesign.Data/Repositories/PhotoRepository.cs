using ImageDesign.Core.Entities;
using ImageDesign.Core.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Data.Repositories
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _dataContext;

        public PhotoRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IEnumerable<Photo>> GetAllPhotosAsync()
        {
            //return await _dataContext.Photos.Include(photo => photo.Tags).ToListAsync();

            return await _dataContext.Photos.ToListAsync();
        }
        public async Task<IEnumerable<Photo>> GetAllDeletedPhotosAsync()
        {
            //return await _dataContext.Photos.Include(photo => photo.Tags).ToListAsync();

            return await _dataContext.Photos.Where(photo => photo.IsDeleted == true).ToListAsync();
        }

        public async Task<Photo> GetPhotoByIdAsync(int id)
        {
            return await _dataContext.Photos.FindAsync(id);
        }



        public async Task<Photo> AddPhotoAsync(Photo photo)
        {
            await _dataContext.Photos.AddAsync(photo);
            //await _dataContext.SaveChangesAsync();

            return photo;
        }

        public async Task<Photo> UpdatePhotoAsync(int id, Photo photo)
        {
            var existingFile = await GetPhotoByIdAsync(id);
            if (existingFile == null) return null;
            existingFile.PhotoName = photo.PhotoName;
            existingFile.UserId = photo.UserId;
            existingFile.AlbumId = photo.AlbumId;
            existingFile.PhotoPath = photo.PhotoPath;
            existingFile.PhotoSize = photo.PhotoSize;
            //existingFile.Tags = photo.Tags;
            //existingFile.ta
            return photo;
        }

        public async Task<bool> DeletePhotoAsync(int id)
        {
            var photo = await GetPhotoByIdAsync(id);
            if (photo == null) return false;
            if (!photo.IsDeleted)
            {
                photo.IsDeleted = true; // עדכון השדה במקום מחיקה
                _dataContext.Photos.Update(photo);
                return await _dataContext.SaveChangesAsync() > 0;
            }
            else
            {
                var file = await GetPhotoByIdAsync(id);
                if (file == null) return false;

                _dataContext.Photos.Remove(file);
                return await _dataContext.SaveChangesAsync() > 0;
            }
            //היום  
            //var file = await GetPhotoByIdAsync(id);
            //if (file == null) return false;

            //_dataContext.Photos.Remove(file);
            //return await _dataContext.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Photo>> GetPhotosByAlbumIdAsync(int albumId)
        {

            return await _dataContext.Photos.Where(photo => photo.AlbumId == albumId).ToListAsync();
        }

        public async Task<IEnumerable<Photo>> GetDeletedPhotosByUserIdAsync(int userId)
        {

            return await _dataContext.Photos
                    .Where(photo => photo.UserId == userId && photo.IsDeleted) // הוספת הסינון
                    .ToListAsync();
        }

        public async Task<IEnumerable<Photo>> GetNotPhotosByAlbumIdAsync(int albumId)
        {

            return await _dataContext.Photos
                    .Where(photo => photo.AlbumId == albumId && !photo.IsDeleted) // הוספת הסינון
                    .ToListAsync();
        }

        public async Task<bool> RestorePhoto(int photoId)
        {
            var photo = await GetPhotoByIdAsync(photoId);
            photo.IsDeleted = false;
            _dataContext.Photos.Update(photo);
            return await _dataContext.SaveChangesAsync() > 0;

        }
        public async Task<Photo> CopyPhotoToAlbumAsync(int photoId, int targetAlbumId)
        {
            var photo = await GetPhotoByIdAsync(photoId);
            if (photo == null) return null;

            // Create a new photo object with the same properties but new ID
            var newPhoto = new Photo
            {
                UserId = photo.UserId,
                PhotoName = photo.PhotoName,
                AlbumId = targetAlbumId,
                PhotoPath = photo.PhotoPath,
                PhotoSize = photo.PhotoSize,
                UploadedAt = photo.UploadedAt,
                UpdatedAt = DateTime.Now,
                TagId = photo.TagId,
                IsDeleted = false
            };

            await _dataContext.Photos.AddAsync(newPhoto);
            // SaveChanges is handled by the service

            return newPhoto;
        }

        public async Task<Photo> MovePhotoToAlbumAsync(int photoId, int sourceAlbumId, int targetAlbumId)
        {
            var photo = await GetPhotoByIdAsync(photoId);
            if (photo == null || photo.AlbumId != sourceAlbumId) return null;

            photo.AlbumId = targetAlbumId;
            photo.UpdatedAt = DateTime.Now;

            _dataContext.Photos.Update(photo);
            // SaveChanges is handled by the service

            return photo;
        }
    }
}
