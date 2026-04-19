using System.ComponentModel.DataAnnotations;
using ProjetoTarefas.Models;

namespace ProjetoTarefas.DTOs
{
    public class ProjectDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public ProjectStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateProjectDTO
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public DateTime StartDate { get; set; } = DateTime.UtcNow;

        public ProjectStatus Status { get; set; } = ProjectStatus.Active;
    }

    public class UpdateProjectDTO
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public ProjectStatus Status { get; set; }
    }
}
