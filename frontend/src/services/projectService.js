import { v4 as uuidv4 } from 'uuid';

class ProjectService {
  // Advanced project creation with validation
  createProject(name, options = {}) {
    if (!name || name.trim().length === 0) {
      throw new Error('Project name cannot be empty');
    }

    const project = {
      id: uuidv4(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: options.color || this.generateProjectColor(),
      tags: options.tags || [],
      archived: false,
      ...options
    };

    return project;
  }

  // Generate a random project color
  generateProjectColor() {
    const colors = [
      '#5D3FD3', // Iris
      '#6F8FAF', // Air Force Blue
      '#C3B1E1', // Lavender Gray
      '#A7C7E7', // Serenity
      '#B0FC38'  // Lime
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Validate project before saving
  validateProject(project) {
    const errors = [];

    if (!project.name) errors.push('Project name is required');
    if (project.name.length > 50) errors.push('Project name too long');
    if (!project.id) errors.push('Project must have a unique identifier');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Advanced project search and filtering
  filterProjects(projects, criteria) {
    return projects.filter(project => {
      if (criteria.name && 
          !project.name.toLowerCase().includes(criteria.name.toLowerCase())) {
        return false;
      }

      if (criteria.tags && criteria.tags.length > 0) {
        const hasRequiredTags = criteria.tags.every(tag => 
          project.tags.includes(tag)
        );
        if (!hasRequiredTags) return false;
      }

      if (criteria.archived !== undefined) {
        if (project.archived !== criteria.archived) return false;
      }

      return true;
    });
  }

  // Project archiving mechanism
  archiveProject(project) {
    return {
      ...project,
      archived: true,
      archivedAt: new Date().toISOString()
    };
  }

  // Project restoration
  restoreProject(project) {
    const { archived, archivedAt, ...restProject } = project;
    return restProject;
  }

  // Bulk project operations
  bulkUpdateProjects(projects, updateFn) {
    return projects.map(updateFn);
  }
}

export default new ProjectService();
