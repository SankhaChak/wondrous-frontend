import { CreateEntity } from 'components/CreateEntity';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import {
  MilestonesTaskCreateButtonLabel,
  MilestonesTasksCreateButton,
  MilestonesTasksCreateButtonIcon,
  MilestonesTasksCreateButtonIconWrapper,
  MilestoneTasksCreateWrapper,
} from './styles';

const MilestoneTasksCreate = ({ canCreate, milestone }) => {
  const { id, orgId, podId } = milestone;
  const [open, setOpen] = useState(false);
  const handleModalStatus = () => setOpen(!open);
  if (!canCreate) return null;
  return (
    <>
      <CreateEntity
        entityType={ENTITIES_TYPES.TASK}
        cancel={handleModalStatus}
        handleClose={handleModalStatus}
        open={open}
        handleCloseModal={handleModalStatus}
        formValues={{
          orgId,
          podId,
          milestoneId: id,
        }}
      />
      <MilestoneTasksCreateWrapper>
        <MilestonesTasksCreateButton onClick={handleModalStatus}>
          <MilestonesTasksCreateButtonIconWrapper>
            <MilestonesTasksCreateButtonIcon />
          </MilestonesTasksCreateButtonIconWrapper>
          <MilestonesTaskCreateButtonLabel>Add task</MilestonesTaskCreateButtonLabel>
        </MilestonesTasksCreateButton>
      </MilestoneTasksCreateWrapper>
    </>
  );
};

export default MilestoneTasksCreate;
