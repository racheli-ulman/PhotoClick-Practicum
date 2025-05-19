using ImageDesign.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.IRepositories
{
    public interface IPhotoRepository
    {
        Task<IEnumerable<Photo>> GetAllPhotosAsync();
        Task<Photo> GetPhotoByIdAsync(int id);
        Task<Photo> AddPhotoAsync(Photo photo);
        Task<Photo> UpdatePhotoAsync(int id, Photo photo);
        Task<bool> DeletePhotoAsync(int id);
        Task<IEnumerable<Photo>> GetPhotosByAlbumIdAsync(int albumId);
        Task<Photo> CopyPhotoToAlbumAsync(int photoId, int targetAlbumId);
        Task<Photo> MovePhotoToAlbumAsync(int photoId, int sourceAlbumId, int targetAlbumId);
        Task<IEnumerable<Photo>> GetDeletedPhotosByUserIdAsync(int userId);
        Task<IEnumerable<Photo>> GetNotPhotosByAlbumIdAsync(int albumId);
        Task<bool> RestorePhoto(int photoId);
        Task<IEnumerable<Photo>> GetAllDeletedPhotosAsync();
        Task<IEnumerable<Photo>> GetPhotosByTagIdAsync(int tagId);



    }
}
