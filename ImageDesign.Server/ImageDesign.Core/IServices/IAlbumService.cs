using ImageDesign.Core.DTOs;
using ImageDesign.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace ImageDesign.Core.IServices
{
    public interface IAlbumService
    {
        Task<IEnumerable<AlbumsDto>> GetAllAlbumsAsync();
        Task<AlbumsDto> GetAlbumByIdAsync(int id);
        Task<AlbumsDto> AddAlbumAsync(AlbumsDto album);
        Task<AlbumsDto> UpdateAlbumAsync(int id, AlbumsDto album);
        Task<bool> DeleteAlbumAsync(int id);
        Task<IEnumerable<PhotoDto>> GetImagesByAlbumIdAsync(int albumId);
        Task<IEnumerable<AlbumsDto>> GetAlbumsByUserIdAsync(int userId);
        //Task<ICollection<Album>> GetAlbumsByParentAsync(int parentId, int userId);
        //Task<IEnumerable<AlbumsDto>> GetChildAlbumsAsync(int parentId);



        Task<IEnumerable<PhotoDto>> GetAllPhotosByUserIdAsync(int userId);



    }
}
