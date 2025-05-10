using ImageDesign.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.IRepositories
{
    public interface ITagRepository
    {
        Task<IEnumerable<Tag>> GetAllTagsAsync();
        Task<Tag> GetTagByIdAsync(int id);
        Task<Tag> AddTagAsync(Tag tag);
        Task<Tag> UpdateTagAsync(int id, Tag tag);
        Task<bool> DeleteTagAsync(int id);
        //Task<Tag> GetTagByStringAsync(string tag);
    }
}
