using ImageDesign.Core.Entities;
using ImageDesign.Core.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace ImageDesign.Data.Repositories
{
    public class AlbumRepository:IAlbumRepository
    {
        private readonly DataContext _dataContext;       

        public AlbumRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IEnumerable<Album>> GetAllAlbumsAsync()
        {
            return await _dataContext.Albums.ToListAsync();
        }

        public async Task<Album> GetAlbumByIdAsync(int id)
        {
            return await _dataContext.Albums.FindAsync(id);
        }

        public async Task<Album> AddAlbumAsync(Album album)
        {

            await _dataContext.Albums.AddAsync(album);
           
            return album;
        }

        public async Task<Album> UpdateAlbumAsync(int id, Album album)
        {
            var existingAlbum = await GetAlbumByIdAsync(id);
            if (existingAlbum == null)
                return null;
            existingAlbum.AlbumName = album.AlbumName;
            existingAlbum.UserId = album.UserId;
            existingAlbum.description = album.description;
            existingAlbum.IsDeleted = album.IsDeleted;
            return album;
        }
        
        public async Task<bool> DeleteAlbumAsync(int id)
        {
            try
            {
                var album = await GetAlbumByIdAsync(id);
                if (album == null)
                    return false;
                _dataContext.Albums.Remove(album);
                await _dataContext.SaveChangesAsync();
                
                return true;

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting painted drawing: {ex.Message}");
                return false;
            }
            
            
        }

        public Task saveAsync()
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<Photo>> GetImagesByAlbumIdAsync(int albumId)
        {
            return await _dataContext.Photos
                                 .Where(img => img.AlbumId == albumId)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Album>> GetAlbumsByUserIdAsync(int userId)
        {
            return await _dataContext.Albums
                                 .Where(album => album.UserId == userId)
                                 .ToListAsync();
        }
        //public async Task<ICollection<Album>> GetAlbumsByParentAsync(int parentId, int userId)
        //{
        //    return await _dataContext.Albums.Where(a => a.ParentId == parentId&&a.UserId==userId).ToListAsync();
        //}
        //public async Task<IEnumerable<Album>> GetChildAlbumsAsync(int parentId)
        //{
        //    return await _dataContext.Albums
        //                         .Where(album => album.ParentId == parentId)
        //                         .ToListAsync();
        //}


        public async Task<IEnumerable<Photo>> GetAllPhotosByUserIdAsync(int userId)
        {
            // Join Albums and Photos to get all photos for a specific user
            return await _dataContext.Photos
                .Where(photo => _dataContext.Albums
                    .Any(album => album.UserId == userId && album.Id == photo.AlbumId))
                .ToListAsync();
        }


    }
}
