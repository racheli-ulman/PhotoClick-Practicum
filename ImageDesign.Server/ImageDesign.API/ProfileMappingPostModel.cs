using AutoMapper;
using ImageDesign.API.Models;
using ImageDesign.Core.DTOs;

namespace ImageDesign.API
{
    public class ProfileMappingPostModel:Profile
    {
        public ProfileMappingPostModel()
        {
            CreateMap<UserPostModel, UserDto>().ReverseMap();
            CreateMap<TagPostModel, TagDto>().ReverseMap();
            CreateMap<PhotoPostModel, PhotoDto>().ReverseMap();
            CreateMap<AlbumPostModel, AlbumsDto>().ReverseMap();
            CreateMap<RegisterModel, UserDto>().ReverseMap();

        }
    }
}
