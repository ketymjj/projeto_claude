using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoTarefas.Models
{
    public class TaskHistory
    {
        public int Id { get; set; }

        public int TaskId { get; set; }

        [ForeignKey("TaskId")]
        public TaskItem? Task { get; set; }

        [Required]
        [MaxLength(100)]
        public string FieldChanged { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? OldValue { get; set; }

        [MaxLength(500)]
        public string? NewValue { get; set; }

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    }
}
