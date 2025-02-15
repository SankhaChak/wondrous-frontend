export type TaskFilter = { statuses?: any[]; podIds?: any[]; labelId?: string; date?: string; privacyLevel?: string };

export interface IUser {
  avatar: {
    id: string;
    isOwnerOfPod: boolean;
  };
  id: string;
  initials: string;
  name: string;
}

export interface ITask {
  actions: {
    comments: number;
    likes: number;
    shares: number;
  };
  compensation?: {
    amount: number | string;
    currency: string;
  };
  description: string;
  id: number | string;
  media: {
    id: string;
    type: string;
    url: string;
  };
  priority: number;
  status: string;
  title: string;
  users?: Array<IUser>;
}

export interface TaskFragment {
  __typename: string;
  assigneeId: string;
  assigneeOrder: string;
  assigneeProfilePicture?: any;
  assigneeUsername: string;
  commentCount?: any;
  completedAt: Date;
  createdAt: Date;
  createdBy: string;
  description: string;
  dueDate?: any;
  id: string;
  links?: any;
  media?: any;
  milestoneId?: any;
  milestoneTitle?: any;
  orgId: string;
  orgName: string;
  orgOrder: string;
  orgProfilePicture?: any;
  podColor?: any;
  podId?: any;
  podName?: any;
  podOrder?: any;
  podProfilePicture?: any;
  priority?: any;
  reactionCount?: any;
  rewards?: any;
  shareCount?: any;
  status: string;
  title: string;
  type: string;
}
