using AutoMapper;
using ImageDesign.Core.DTOs;
using ImageDesign.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core
{
    public class ProfileMapping:Profile
    {
        public ProfileMapping()
        {
            CreateMap<Tag, TagDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Photo, PhotoDto>().ReverseMap();
            CreateMap<Album, AlbumsDto>().ReverseMap();
        }
    }
}
