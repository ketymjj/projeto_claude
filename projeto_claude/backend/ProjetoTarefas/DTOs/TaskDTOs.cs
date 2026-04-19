using System.ComponentModel.DataAnnotations;
using ProjetoTarefas.Models;
using TaskStatus = ProjetoTarefas.Models.TaskStatus;

namespace ProjetoTarefas.DTOs
{
    public class TaskHistoryDTO
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public string FieldChanged { get; set; } = string.Empty;
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public DateTime ChangedAt { get; set; }
    }

    public class TaskDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; }
        public int ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateTaskDTO
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public TaskStatus Status { get; set; } = TaskStatus.Pending;

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        [Required]
        public int ProjectId { get; set; }

        public DateTime? DueDate { get; set; }
    }

    public class UpdateTaskDTO
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public TaskStatus Status { get; set; }

        public TaskPriority Priority { get; set; }

        [Required]
        public int ProjectId { get; set; }

        public DateTime? DueDate { get; set; }
    }
}
