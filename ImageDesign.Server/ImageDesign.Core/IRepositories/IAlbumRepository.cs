using ImageDesign.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace ImageDesign.Core.IRepositories
{
    public interface IAlbumRepository
    {
        Task<IEnumerable<Album>> GetAllAlbumsAsync();
        Task<Album> GetAlbumByIdAsync(int id);
        Task<Album> AddAlbumAsync(Album album);
        Task<Album> UpdateAlbumAsync(int id,Album album);
        Task<bool> DeleteAlbumAsync(int id);
        Task<IEnumerable<Photo>> GetImagesByAlbumIdAsync(int albumId);
        Task<IEnumerable<Album>> GetAlbumsByUserIdAsync(int userId);

        //Task<ICollection<Album>> GetAlbumsByParentAsync(int parentId, int userId);
        //Task<IEnumerable<Album>> GetChildAlbumsAsync(int parentId);



        public Task<IEnumerable<Photo>> GetAllPhotosByUserIdAsync(int userId);

    }
}
