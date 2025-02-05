import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Project {
  id: string;
  name: string;
  createdOn: string;
  modifiedOn: string;
  deletedOn: string | null;
}

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Modern Villa",
      createdOn: "2024-02-20",
      modifiedOn: "2024-02-21",
      deletedOn: null,
    },
    // Add more sample projects as needed
  ]);

  return (
    <div className="min-h-screen bg-mane-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-mane-primary">My Projects</h1>
          <Button
            onClick={() => navigate("/playground/new")}
            className="bg-mane-secondary hover:bg-mane-primary"
          >
            Create New Project
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Modified On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.createdOn}</TableCell>
                  <TableCell>{project.modifiedOn}</TableCell>
                  <TableCell>
                    {project.deletedOn ? "Deleted" : "Active"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/playground/${project.id}`)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        // Implement delete logic
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Projects;