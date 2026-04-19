using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using ProjetoTarefas.Data;

#nullable disable

namespace ProjetoTarefas.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.11");

            modelBuilder.Entity("ProjetoTarefas.Models.Project", b =>
            {
                b.Property<int>("Id")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("INTEGER");

                b.Property<DateTime>("CreatedAt")
                    .HasColumnType("TEXT");

                b.Property<string>("Description")
                    .IsRequired()
                    .HasMaxLength(1000)
                    .HasColumnType("TEXT");

                b.Property<string>("Name")
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnType("TEXT");

                b.Property<DateTime>("StartDate")
                    .HasColumnType("TEXT");

                b.Property<string>("Status")
                    .IsRequired()
                    .HasColumnType("TEXT");

                b.HasKey("Id");

                b.ToTable("Projects");
            });

            modelBuilder.Entity("ProjetoTarefas.Models.TaskHistory", b =>
            {
                b.Property<int>("Id")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("INTEGER");

                b.Property<DateTime>("ChangedAt")
                    .HasColumnType("TEXT");

                b.Property<string>("FieldChanged")
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnType("TEXT");

                b.Property<string>("NewValue")
                    .HasMaxLength(500)
                    .HasColumnType("TEXT");

                b.Property<string>("OldValue")
                    .HasMaxLength(500)
                    .HasColumnType("TEXT");

                b.Property<int>("TaskId")
                    .HasColumnType("INTEGER");

                b.HasKey("Id");

                b.HasIndex("TaskId");

                b.ToTable("TaskHistories");
            });

            modelBuilder.Entity("ProjetoTarefas.Models.TaskItem", b =>
            {
                b.Property<int>("Id")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("INTEGER");

                b.Property<DateTime>("CreatedAt")
                    .HasColumnType("TEXT");

                b.Property<string>("Description")
                    .IsRequired()
                    .HasMaxLength(1000)
                    .HasColumnType("TEXT");

                b.Property<DateTime?>("DueDate")
                    .HasColumnType("TEXT");

                b.Property<string>("Priority")
                    .IsRequired()
                    .HasColumnType("TEXT");

                b.Property<int>("ProjectId")
                    .HasColumnType("INTEGER");

                b.Property<string>("Status")
                    .IsRequired()
                    .HasColumnType("TEXT");

                b.Property<string>("Title")
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnType("TEXT");

                b.HasKey("Id");

                b.HasIndex("ProjectId");

                b.ToTable("Tasks");
            });

            modelBuilder.Entity("ProjetoTarefas.Models.TaskHistory", b =>
            {
                b.HasOne("ProjetoTarefas.Models.TaskItem", "Task")
                    .WithMany("History")
                    .HasForeignKey("TaskId")
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();

                b.Navigation("Task");
            });

            modelBuilder.Entity("ProjetoTarefas.Models.TaskItem", b =>
            {
                b.HasOne("ProjetoTarefas.Models.Project", "Project")
                    .WithMany("Tasks")
                    .HasForeignKey("ProjectId")
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();

                b.Navigation("Project");
                b.Navigation("History");
            });

            modelBuilder.Entity("ProjetoTarefas.Models.Project", b =>
            {
                b.Navigation("Tasks");
            });
#pragma warning restore 612, 618
        }
    }
}
