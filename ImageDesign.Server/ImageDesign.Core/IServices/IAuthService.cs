using ImageDesign.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageDesign.Core.IServices
{
    public interface  IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);

    }
}
