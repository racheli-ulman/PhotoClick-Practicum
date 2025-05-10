using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.IRepositories
{
    public interface IRepositoryManager
    {
        IUserRepository UserM { get; }
        IAlbumRepository AlbumM { get; }
        ITagRepository TagM { get; }   
        IPhotoRepository PhotoM { get; }
        Task  saveAsync();
    }
}
