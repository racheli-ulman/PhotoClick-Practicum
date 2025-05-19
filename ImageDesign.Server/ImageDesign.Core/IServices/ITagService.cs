using ImageDesign.Core.DTOs;
using ImageDesign.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.IServices
{
    public interface ITagService
    {
        Task<IEnumerable<TagDto>> GetAllTagsAsync();
        Task<TagDto> GetTagByIdAsync(int id);
        Task<TagDto> AddTagAsync(TagDto tag);
        Task<TagDto> UpdateTagAsync(int id, TagDto tag);
        Task<bool> DeleteTagAsync(int id);
        Task<TagDto> GetTagByNameAsync(string tagName);

    }
}
