using ImageDesign.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {

        private readonly DataContext _dataContext;

        public IAlbumRepository AlbumM { get; }

        public IPhotoRepository PhotoM { get; }

        public IUserRepository UserM { get; }

        public ITagRepository TagM { get; }
        public IRoleRepository RoleM { get; }
        public IUserRepository UserRoleM { get; }



        public RepositoryManager(DataContext dataContext, IAlbumRepository album, IPhotoRepository photo, IUserRepository user, ITagRepository tag, IRoleRepository role, IUserRepository userRole)
        {
            _dataContext = dataContext;
            AlbumM = album;
            PhotoM = photo;
            UserM = user;
            TagM = tag;
            RoleM = role;
            UserRoleM = userRole;
        }


        public async Task saveAsync()
        {
           await _dataContext.SaveChangesAsync();
        }
    }
}
