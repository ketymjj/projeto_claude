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
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ProjectsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDTO>>> GetAll()
        {
            var projects = await _context.Projects
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<ProjectDTO>>(projects));
        }

        // GET: api/projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDTO>> GetById(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                return NotFound(new { message = $"Project with id {id} not found." });

            return Ok(_mapper.Map<ProjectDTO>(project));
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<ProjectDTO>> Create([FromBody] CreateProjectDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var project = _mapper.Map<Project>(dto);
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            var resultDto = _mapper.Map<ProjectDTO>(project);
            return CreatedAtAction(nameof(GetById), new { id = project.Id }, resultDto);
        }

        // PUT: api/projects/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ProjectDTO>> Update(int id, [FromBody] UpdateProjectDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                return NotFound(new { message = $"Project with id {id} not found." });

            _mapper.Map(dto, project);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<ProjectDTO>(project));
        }

        // DELETE: api/projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                return NotFound(new { message = $"Project with id {id} not found." });

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
