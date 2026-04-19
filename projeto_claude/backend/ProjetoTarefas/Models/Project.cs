using System.ComponentModel.DataAnnotations;

namespace ProjetoTarefas.Models
{
    public enum ProjectStatus
    {
        Active,
        Inactive,
        Completed
    }

    public class Project
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public ProjectStatus Status { get; set; } = ProjectStatus.Active;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
