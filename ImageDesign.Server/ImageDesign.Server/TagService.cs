using AutoMapper;
using ImageDesign.Core.DTOs;
using ImageDesign.Core.Entities;
using ImageDesign.Core.IRepositories;
using ImageDesign.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Service
{
    public class TagService:ITagService
    {
        private readonly IRepositoryManager _repositoryManager;
        readonly IMapper _mapper;


        public TagService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }



        public async Task<IEnumerable<TagDto>> GetAllTagsAsync()
        {
             var tags =await _repositoryManager.TagM.GetAllTagsAsync();
            return _mapper.Map<IEnumerable<TagDto>>(tags);
        }

        public async Task<TagDto> GetTagByIdAsync(int id)
        {
            var tag= await _repositoryManager.TagM.GetTagByIdAsync(id);
            return _mapper.Map<TagDto>(tag);
        }

        public async Task<TagDto> AddTagAsync(TagDto tag)
        {
            var addeTag = _mapper.Map<Tag>(tag);
            //if (_repositoryManager.TagM.GetTagByIdAsync(tag.Id) == null)
            //{
            addeTag.CreatedAt = DateTime.UtcNow;
                var createTag = await _repositoryManager.TagM.AddTagAsync(addeTag);
            await _repositoryManager.saveAsync();

            return _mapper.Map<TagDto>(createTag);
            //}
            return null;

        }

        public async Task<TagDto> UpdateTagAsync(int id, TagDto tag)
        {
            if (id < 0 || tag == null)
                return null;
            var updateTag = _mapper.Map<Tag>(tag);
            var result =await _repositoryManager.TagM.UpdateTagAsync(id, updateTag);
            await _repositoryManager.saveAsync();

            return _mapper.Map<TagDto>(result);
        }

        public async Task<bool> DeleteTagAsync(int id)
        {
            await _repositoryManager.saveAsync();

            return await _repositoryManager.TagM.DeleteTagAsync(id);
        }

        //public async Task<bool> GetTagIdByTagName(int id)
        //{
        //    await _repositoryManager.saveAsync();

        //    return await _repositoryManager.TagM.DeleteTagAsync(id);
        //}
        public async Task<TagDto> GetTagByNameAsync(string tagName)
        {
            var tag = await _repositoryManager.TagM.GetTagByNameAsync(tagName);
            return _mapper.Map<TagDto>(tag);
        }



    }
}
