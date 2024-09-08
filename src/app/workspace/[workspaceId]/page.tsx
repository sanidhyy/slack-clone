interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdPage = ({ params }: WorkspaceIdPageProps) => {
  return <div>ID: {params.workspaceId}</div>;
};

export default WorkspaceIdPage;
