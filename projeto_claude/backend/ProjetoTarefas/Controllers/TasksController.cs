using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoTarefas.Data;
using ProjetoTarefas.DTOs;
using ProjetoTarefas.Models;

namespace ProjetoTarefas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public TasksController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDTO>>> GetAll([FromQuery] int? projectId)
        {
            IQueryable<TaskItem> query = _context.Tasks.Include(t => t.Project);

            if (projectId.HasValue)
                query = query.Where(t => t.ProjectId == projectId.Value);

            var tasks = await query
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<TaskDTO>>(tasks));
        }

        // GET: api/tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDTO>> GetById(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
                return NotFound(new { message = $"Tarefa com id {id} não encontrada." });

            return Ok(_mapper.Map<TaskDTO>(task));
        }

        // GET: api/tasks/5/history
        [HttpGet("{id}/history")]
        public async Task<ActionResult<IEnumerable<TaskHistoryDTO>>> GetHistory(int id)
        {
            var exists = await _context.Tasks.AnyAsync(t => t.Id == id);
            if (!exists)
                return NotFound(new { message = $"Tarefa com id {id} não encontrada." });

            var history = await _context.TaskHistories
                .Where(h => h.TaskId == id)
                .OrderByDescending(h => h.ChangedAt)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<TaskHistoryDTO>>(history));
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskDTO>> Create([FromBody] CreateTaskDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var project = await _context.Projects.FindAsync(dto.ProjectId);
            if (project == null)
                return BadRequest(new { message = $"Projeto com id {dto.ProjectId} não encontrado." });

            var task = _mapper.Map<TaskItem>(dto);
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            // Registra evento de criação com resumo dos valores iniciais
            _context.TaskHistories.Add(new TaskHistory
            {
                TaskId     = task.Id,
                FieldChanged = "Criação",
                OldValue   = null,
                NewValue   = $"Status: {task.Status} | Prioridade: {task.Priority} | Projeto: {project.Name}",
                ChangedAt  = task.CreatedAt
            });
            await _context.SaveChangesAsync();

            var created = await _context.Tasks
                .Include(t => t.Project)
                .FirstAsync(t => t.Id == task.Id);

            return CreatedAtAction(nameof(GetById), new { id = task.Id }, _mapper.Map<TaskDTO>(created));
        }

        // PUT: api/tasks/5
        [HttpPut("{id}")]
        public async Task<ActionResult<TaskDTO>> Update(int id, [FromBody] UpdateTaskDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
                return NotFound(new { message = $"Tarefa com id {id} não encontrada." });

            var project = await _context.Projects.FindAsync(dto.ProjectId);
            if (project == null)
                return BadRequest(new { message = $"Projeto com id {dto.ProjectId} não encontrado." });

            var changes = DetectChanges(task, dto, project.Name);

            _mapper.Map(dto, task);
            await _context.SaveChangesAsync();

            if (changes.Count > 0)
            {
                _context.TaskHistories.AddRange(changes);
                await _context.SaveChangesAsync();
            }

            var updated = await _context.Tasks
                .Include(t => t.Project)
                .FirstAsync(t => t.Id == id);

            return Ok(_mapper.Map<TaskDTO>(updated));
        }

        // DELETE: api/tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound(new { message = $"Tarefa com id {id} não encontrada." });

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private List<TaskHistory> DetectChanges(TaskItem current, UpdateTaskDTO dto, string projectName)
        {
            var changes = new List<TaskHistory>();
            var now = DateTime.UtcNow;

            if (current.Title != dto.Title)
                changes.Add(History(current.Id, "Título", current.Title, dto.Title, now));

            if (current.Description != dto.Description)
                changes.Add(History(current.Id, "Descrição", current.Description, dto.Description, now));

            if (current.Status != dto.Status)
                changes.Add(History(current.Id, "Status", current.Status.ToString(), dto.Status.ToString(), now));

            if (current.Priority != dto.Priority)
                changes.Add(History(current.Id, "Prioridade", current.Priority.ToString(), dto.Priority.ToString(), now));

            if (current.ProjectId != dto.ProjectId)
                changes.Add(History(current.Id, "Projeto", current.Project?.Name ?? current.ProjectId.ToString(), projectName, now));

            if (current.DueDate != dto.DueDate)
                changes.Add(History(current.Id, "Vencimento",
                    current.DueDate?.ToString("dd/MM/yyyy"),
                    dto.DueDate?.ToString("dd/MM/yyyy"), now));

            return changes;
        }

        private static TaskHistory History(int taskId, string field, string? oldVal, string? newVal, DateTime at)
            => new() { TaskId = taskId, FieldChanged = field, OldValue = oldVal, NewValue = newVal, ChangedAt = at };
    }
}
