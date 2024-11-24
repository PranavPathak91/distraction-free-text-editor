import { v4 as uuidv4 } from 'uuid';

class DocumentService {
  static STORAGE_KEY = 'text-editor-projects-v2';

  // Generate a unique ID
  static generateId() {
    return uuidv4();
  }

  // Save entire project structure
  static saveProjects(projects) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  }

  // Retrieve entire project structure
  static getProjects() {
    try {
      const projectsJson = localStorage.getItem(this.STORAGE_KEY);
      return projectsJson ? JSON.parse(projectsJson) : [];
    } catch (error) {
      console.error('Error retrieving projects:', error);
      return [];
    }
  }

  // Create a new project
  static createProject(projectName = 'New Project') {
    const newProject = {
      id: this.generateId(),
      name: projectName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: []
    };

    const projects = this.getProjects();
    projects.push(newProject);
    this.saveProjects(projects);

    return newProject;
  }

  // Create a new document within a project
  static createDocument(projectId, documentName = 'Chapter') {
    const projects = this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    // Determine the chapter number
    const existingDocuments = projects[projectIndex].documents || [];
    const chapterNumber = existingDocuments.length + 1;
    const finalDocumentName = `${documentName} ${chapterNumber}`;

    const newDocument = {
      id: this.generateId(),
      name: finalDocumentName,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add document to the project
    if (!projects[projectIndex].documents) {
      projects[projectIndex].documents = [];
    }
    projects[projectIndex].documents.push(newDocument);
    projects[projectIndex].updatedAt = new Date().toISOString();
    
    this.saveProjects(projects);

    return newDocument;
  }

  // Update a document
  static updateDocument(documentId, updates) {
    // Comprehensive logging
    console.group('DocumentService.updateDocument');
    console.log('Input documentId:', documentId);
    console.log('Input documentId type:', typeof documentId);
    console.log('Input documentId keys:', 
      documentId && typeof documentId === 'object' 
        ? Object.keys(documentId) 
        : 'N/A'
    );
    console.log('Updates:', updates);

    // More robust ID extraction with detailed logging
    let id;
    try {
      // Null/undefined check
      if (documentId === null || documentId === undefined) {
        console.error('Document ID is null or undefined');
        console.groupEnd();
        throw new Error('Document ID is null or undefined');
      }

      // String ID
      if (typeof documentId === 'string') {
        id = documentId;
        console.log('Using string ID directly:', id);
      } 
      // Object ID extraction
      else if (typeof documentId === 'object') {
        // Try multiple ID extraction methods
        const idFields = ['id', '_id', 'documentId', 'uuid'];
        
        for (let field of idFields) {
          if (documentId[field] && typeof documentId[field] === 'string') {
            id = documentId[field];
            console.log(`ID extracted using ${field}:`, id);
            break;
          }
        }

        // Fallback to toString if no ID field found
        if (!id && documentId.toString && typeof documentId.toString === 'function') {
          id = documentId.toString();
          console.log('ID extracted using toString():', id);
        }
      }

      // Final validation
      if (!id) {
        console.error('Could not extract document ID', documentId);
        console.groupEnd();
        throw new Error(`Invalid document ID: ${JSON.stringify(documentId)}`);
      }
    } catch (error) {
      console.error('ID extraction error:', error);
      console.error('Full documentId object:', JSON.stringify(documentId, null, 2));
      console.groupEnd();
      throw new Error(`Invalid document ID: ${error.message}`);
    }

    const projects = this.getProjects();

    // Find the project and document containing this documentId
    for (let project of projects) {
      const documentIndex = project.documents
        .findIndex(d => d.id === id);

      if (documentIndex !== -1) {
        // Update document
        project.documents[documentIndex] = {
          ...project.documents[documentIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        // Update project's updatedAt
        project.updatedAt = new Date().toISOString();

        // Save updated projects
        this.saveProjects(projects);

        console.log('Document successfully updated:', project.documents[documentIndex]);
        console.groupEnd();

        return project.documents[documentIndex];
      }
    }

    // If document is not found, log more detailed error
    console.error('Document not found. Searching for ID:', id);
    console.error('Current projects:', JSON.stringify(projects, null, 2));
    console.groupEnd();
    
    throw new Error(`Document with ID ${id} not found`);
  }

  // Utility method to find a document by ID across all projects
  static findDocumentById(documentId) {
    // Ensure documentId is a string
    const id = typeof documentId === 'object' 
      ? documentId.id 
      : documentId;

    if (!id) {
      console.error('Invalid document ID:', documentId);
      return null;
    }

    const projects = this.getProjects();

    for (let project of projects) {
      const document = project.documents
        .find(d => d.id === id);

      if (document) {
        return { project, document };
      }
    }

    return null;
  }

  // Delete a document
  static deleteDocument(projectId, documentId) {
    const projects = this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    // Remove document from project
    projects[projectIndex].documents = projects[projectIndex].documents
      .filter(d => d.id !== documentId);

    // Update project timestamp
    projects[projectIndex].updatedAt = new Date().toISOString();

    this.saveProjects(projects);
  }

  // List all projects
  static listProjects() {
    return this.getProjects();
  }

  // List documents in a project
  static listDocuments(projectId) {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === projectId);
    return project ? project.documents : [];
  }

  // Get a specific document
  static getDocument(projectId, documentId) {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }

    const document = project.documents.find(d => d.id === documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }

    return document;
  }

  // Update project details
  static updateProject(projectId, updates) {
    const projects = this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    // Merge updates
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Save updated projects
    this.saveProjects(projects);

    return projects[projectIndex];
  }
}

export default DocumentService;
