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
    public class TagRepository:ITagRepository
    {
        private readonly DataContext _dataContext;

        public TagRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IEnumerable<Tag>> GetAllTagsAsync()
        {
            return await _dataContext.Tags.ToListAsync();
        }

        public async Task<Tag> GetTagByIdAsync(int id)
        {
            return await _dataContext.Tags.FindAsync(id);
        }

        public async Task<Tag> AddTagAsync(Tag tag)
        {
            await _dataContext.Tags.AddAsync(tag);
            return tag;
        }

        public async Task<Tag> UpdateTagAsync(int id, Tag tag)
        {
            var existingTag = await GetTagByIdAsync(id);
            if (existingTag == null) return null;

            existingTag.TagName = tag.TagName;
            existingTag.CreatedAt = tag.CreatedAt;

            existingTag.UpdatedAt = tag.UpdatedAt;

            return tag;
        }

        public async Task<bool> DeleteTagAsync(int id)
        {
            var tag = await GetTagByIdAsync(id);
            if (tag == null) return false;

            _dataContext.Tags.Remove(tag);
            return await _dataContext.SaveChangesAsync() > 0;
        }
    }
}
