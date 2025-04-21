import { JobItem } from "../lib/types";
import JobListItem from "./JobListItem";

type JobListProps = {
  jobItems: JobItem[];
};

export function JobList({ jobItems }: JobListProps) {
  return (
    <ul className="job-list">
      {jobItems.map((jobItem) => (
        <JobListItem key={jobItem.id} jobItem={jobItem} />
      ))}
    </ul>
  );
}

export default JobList;
