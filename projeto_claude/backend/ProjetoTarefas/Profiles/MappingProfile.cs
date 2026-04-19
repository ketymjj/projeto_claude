using AutoMapper;
using ProjetoTarefas.DTOs;
using ProjetoTarefas.Models;

namespace ProjetoTarefas.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Project mappings
            CreateMap<Project, ProjectDTO>();
            CreateMap<CreateProjectDTO, Project>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Tasks, opt => opt.Ignore());
            CreateMap<UpdateProjectDTO, Project>()
                .ForMember(dest => dest.Tasks, opt => opt.Ignore());

            // TaskHistory mappings
            CreateMap<TaskHistory, TaskHistoryDTO>();

            // Task mappings
            CreateMap<TaskItem, TaskDTO>()
                .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.Project != null ? src.Project.Name : null));
            CreateMap<CreateTaskDTO, TaskItem>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Project, opt => opt.Ignore())
                .ForMember(dest => dest.History, opt => opt.Ignore());
            CreateMap<UpdateTaskDTO, TaskItem>()
                .ForMember(dest => dest.Project, opt => opt.Ignore())
                .ForMember(dest => dest.History, opt => opt.Ignore());
        }
    }
}
