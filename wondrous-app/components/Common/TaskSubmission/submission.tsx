import { useMutation, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import MediaLink from 'components/Common/MediaLink';
import FileIcon from 'components/Icons/files.svg';
import { formatDistance } from 'date-fns';
import {
  APPROVE_BOUNTY_SUBMISSION,
  APPROVE_SUBMISSION,
  ATTACH_SUBMISSION_MEDIA,
  CREATE_TASK_SUBMISSION,
  REMOVE_SUBMISSION_MEDIA,
  REQUEST_CHANGE_SUBMISSION,
  UPDATE_TASK_SUBMISSION,
} from 'graphql/mutations/taskSubmission';
import { GET_TASK_BY_ID } from 'graphql/queries';
import { GET_ORG_USERS } from 'graphql/queries/org';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import palette from 'theme/palette';
import { delQuery } from 'utils';
import { addInReviewItem, removeInProgressTask } from 'utils/board';
import { renderMentionString } from 'utils/common';
import {
  BOUNTY_TYPE,
  ENTITIES_TYPES,
  PAYMENT_STATUS,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
  TASK_TYPE,
} from 'utils/constants';
import { TextInputContext } from 'utils/contexts';
import {
  transformMediaFormat,
  transformTaskSubmissionToTaskSubmissionCard,
  transformTaskToTaskCard,
} from 'utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { handleAddFile } from 'utils/media';
import { useMe } from '../../Auth/withAuth';
import { filterOrgUsersForAutocomplete } from '../../CreateEntity/createEntityModal';
import { MediaItem } from '../../CreateEntity/MediaItem';
import {
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormPreviewButton,
  MediaUploadDiv,
  MultiMediaUploadButton,
  MultiMediaUploadButtonText,
} from '../../CreateEntity/styles';
import { AddFileUpload } from '../../Icons/addFileUpload';
import { RejectIcon } from '../../Icons/decisionIcons';
import { CompletedIcon, InReviewIcon } from '../../Icons/statusIcons';
import { LinkIcon, NotesIcon } from '../../Icons/taskModalIcons';
import UploadImageIcon from '../../Icons/uploadImage';
import { TextInput } from '../../TextInput';
import { FileLoading } from '../FileUpload/FileUpload';
import { SafeImage } from '../Image';
import DefaultUserImage from '../Image/DefaultUserImage';
import { KudosForm } from '../KudosForm';
import { MakePaymentBlock } from '../Task/payment';
import { PaymentButton } from '../Task/paymentButton';
import {
  SubmissionButtonCreate,
  SubmissionButtonTextHelper,
  SubmissionButtonWrapperBackground,
  SubmissionButtonWrapperGradient,
  SubmissionDisplayText,
  SubmissionFormBackButton,
  SubmissionFormBackIcon,
  SubmissionFormBackText,
  SubmissionFormBorder,
  SubmissionFormButtonWrapper,
  SubmissionFormCancel,
  SubmissionFormDescription,
  SubmissionFormField,
  SubmissionFormLink,
  SubmissionFormSubmit,
  SubmissionFormTitle,
  SubmissionFormWrapper,
  SubmissionSection,
  TaskDescriptionText,
  TaskSectionDisplayDiv,
  TaskSectionDisplayLabel,
  TaskStatusHeaderText,
  TaskSubmissionHeader,
  TaskSubmissionHeaderCreatorText,
  TaskSubmissionHeaderTextDiv,
  TaskSubmissionHeaderTimeText,
  TaskSubmissionItemDiv,
  TaskSubmissionLink,
} from './styles';

const SubmissionStatusIcon = (props) => {
  const { submission } = props;
  const iconStyle = {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  };
  if (!submission?.approvedAt && !submission?.changeRequestedAt && !submission.rejectedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <InReviewIcon style={iconStyle} />
        <TaskStatusHeaderText>Awaiting review</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.changeRequestedAt || submission?.rejectedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <RejectIcon
          style={{
            width: '16px',
            height: '16px',
            marginRight: '8px',
          }}
        />
        <TaskStatusHeaderText>Changes requested</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PAID) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CompletedIcon style={iconStyle} />
        <TaskStatusHeaderText>Approved and Paid</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PROCESSING) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CompletedIcon style={iconStyle} />
        <TaskStatusHeaderText>Approved and Processing Payment</TaskStatusHeaderText>
      </div>
    );
  } else if (submission?.approvedAt) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CompletedIcon style={iconStyle} />
        <TaskStatusHeaderText>Approved</TaskStatusHeaderText>
      </div>
    );
  }
};

const SubmissionItem = (props) => {
  const {
    submission,
    setMakeSubmission,
    setSubmissionToEdit,
    canReview,
    fetchedTask,
    setFetchedTask,
    fetchedTaskSubmissions,
    setFetchedTaskSubmissions,
    handleClose,
    user,
    setShowPaymentModal,
    getTaskSubmissionsForTask,
  } = props;
  const router = useRouter();
  const mediaUploads = submission?.media;
  const imageStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    marginRight: '12px',
  };
  const isCreator = user?.id === submission?.createdBy;
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const boardColumns = useColumns();
  // TODO: add user board
  const completeTask = () => {
    const newTask = {
      ...fetchedTask,
      completedAt: new Date(),
      status: TASK_STATUS_DONE,
    };
    const transformedTask = transformTaskToTaskCard(newTask, {});

    //TODO refactor this
    if (boardColumns) {
      const columns = [...boardColumns?.columns];
      const newInProgress = columns[1].tasks.filter((task) => task.id !== fetchedTask.id);
      const newDone = [transformedTask, ...columns[2].tasks];
      if (columns[1].section) {
        const newInReview = (columns[1].section.tasks = columns[1].section.tasks.filter(
          (taskSubmission) => taskSubmission.id !== submission?.id
        ));
        columns[1].tasks = newInProgress;
        columns[1].section.tasks = newInReview;
        columns[2].tasks = newDone;
      } else {
        const newInReview = (columns[2].tasks = columns[2].tasks.filter(
          (taskSubmission) => taskSubmission.id !== submission?.id
        ));
        columns[1].tasks = newInProgress;
        columns[2].tasks = newInReview;
        columns[3].tasks = newDone;
      }
      boardColumns?.setColumns(columns);
    }
    //TODO: add pod board and user board
  };
  const [isKudosModalOpen, setIsKudosForm] = useState(false);
  const [approveSubmission] = useMutation(APPROVE_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      // Change status of submission
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((taskSubmission) => {
        if (taskSubmission?.id === submission?.id) {
          return {
            ...taskSubmission,
            approvedAt: new Date(),
          };
        }
      });
      setFetchedTaskSubmissions(newFetchedTaskSubmissions);
      if (fetchedTask?.type !== BOUNTY_TYPE) {
        completeTask();
        setIsKudosForm(true);
      }
    },
    refetchQueries: [
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      GET_TASK_BY_ID,
    ],
  });
  const [approveBountySubmission] = useMutation(APPROVE_BOUNTY_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      // Change status of submission
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((taskSubmission) => {
        if (taskSubmission?.id === submission?.id) {
          return {
            ...taskSubmission,
            approvedAt: new Date(),
          };
        }
      });
      setFetchedTaskSubmissions(newFetchedTaskSubmissions);
      if (fetchedTask?.type !== BOUNTY_TYPE) {
        completeTask();
        setIsKudosForm(true);
      }
      if (fetchedTask?.type === BOUNTY_TYPE && (orgBoard || podBoard)) {
        const columns = board?.columns.map((col) =>
          col.id === submission.taskId
            ? {
                ...col,
                approvedSubmissionsCount:
                  (Number.isInteger(col.approvedSubmissionsCount) ? col.approvedSubmissionsCount : 0) + 1,
              }
            : col
        );
        board?.setColumns(columns);
      }
    },
  });
  const [requestChangeTaskSubmission] = useMutation(REQUEST_CHANGE_SUBMISSION, {
    variables: {
      submissionId: submission?.id,
    },
    onCompleted: () => {
      // Change status of submission
      // Change status of submission
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((taskSubmission) => {
        if (taskSubmission?.id === submission?.id) {
          return {
            ...taskSubmission,
            changeRequestedAt: new Date(),
          };
        }
      });
      setFetchedTaskSubmissions(newFetchedTaskSubmissions);
      if (fetchedTask?.type === BOUNTY_TYPE && (orgBoard || podBoard)) {
        const columns = board?.columns.map((col) =>
          col.id === submission.taskId ? { ...col, approvedSubmissionsCount: col.approvedSubmissionsCount + 1 } : col
        );
        board?.setColumns(columns);
      }
    },
  });
  const textStyle = {
    marginLeft: '0',
    maxWidth: '500px',
    textAlign: 'left',
  };

  return (
    <>
      <KudosForm onClose={handleClose} open={isKudosModalOpen} submission={submission} />
      <TaskSubmissionItemDiv>
        <TaskSubmissionHeader>
          {submission?.creatorProfilePicture ? (
            <SafeImage style={imageStyle} src={submission?.creatorProfilePicture} />
          ) : (
            <DefaultUserImage style={imageStyle} />
          )}
          <TaskSubmissionHeaderTextDiv>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TaskSubmissionHeaderCreatorText>{submission.creatorUsername}</TaskSubmissionHeaderCreatorText>
              {submission.createdAt && (
                <TaskSubmissionHeaderTimeText>
                  {formatDistance(new Date(submission.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </TaskSubmissionHeaderTimeText>
              )}
            </div>
            <SubmissionStatusIcon submission={submission} />
          </TaskSubmissionHeaderTextDiv>
        </TaskSubmissionHeader>
        <TaskSectionDisplayDiv>
          <TaskSectionDisplayLabel
            style={{
              marginRight: '4px',
            }}
          >
            <FileIcon />
            <SubmissionDisplayText>Files</SubmissionDisplayText>
          </TaskSectionDisplayLabel>
          <SubmissionSection>
            {mediaUploads?.length > 0 ? (
              <MediaUploadDiv>
                {mediaUploads.map((mediaItem) => (
                  <MediaLink style={textStyle} key={mediaItem?.slug} media={mediaItem} />
                ))}
              </MediaUploadDiv>
            ) : (
              <TaskDescriptionText>None</TaskDescriptionText>
            )}
          </SubmissionSection>
        </TaskSectionDisplayDiv>
        <TaskSectionDisplayDiv>
          <TaskSectionDisplayLabel
            style={{
              marginRight: '20px',
            }}
          >
            <LinkIcon />
            <SubmissionDisplayText>Link </SubmissionDisplayText>
          </TaskSectionDisplayLabel>
          {submission?.links && submission?.links[0]?.url ? (
            <TaskSubmissionLink href={submission?.links[0]?.url} target="_blank">
              {submission?.links[0]?.url}
            </TaskSubmissionLink>
          ) : (
            <>
              <TaskDescriptionText
                style={{
                  marginTop: '8px',
                }}
              >
                None
              </TaskDescriptionText>
            </>
          )}
        </TaskSectionDisplayDiv>
        <TaskSectionDisplayDiv
          style={{
            alignItems: 'flex-start',
            flexWrap: 'nowrap',
            textAlign: 'left',
          }}
        >
          <TaskSectionDisplayLabel
            style={{
              marginRight: '8px',
            }}
          >
            <NotesIcon />
            <SubmissionDisplayText>Notes </SubmissionDisplayText>
          </TaskSectionDisplayLabel>
          <TaskDescriptionText
            style={{
              marginTop: '12px',
              ...textStyle,
            }}
          >
            {renderMentionString({
              content: submission?.description,
              router,
            })}
          </TaskDescriptionText>
        </TaskSectionDisplayDiv>

        {(isCreator || canReview) && (
          <>
            <CreateFormFooterButtons>
              {isCreator && !submission.approvedAt && (
                <CreateFormButtonsBlock>
                  {/* <CreateFormCancelButton onClick={}>
                    TODO: this should be delete
                  </CreateFormCancelButton> */}
                  <CreateFormPreviewButton
                    onClick={() => {
                      setMakeSubmission(true);
                      setSubmissionToEdit(submission);
                    }}
                  >
                    Edit submission
                  </CreateFormPreviewButton>
                </CreateFormButtonsBlock>
              )}
              {canReview && fetchedTask?.status !== TASK_STATUS_DONE && (
                <>
                  <CreateFormButtonsBlock>
                    {!submission.changeRequestedAt && !submission.approvedAt && (
                      <CreateFormCancelButton onClick={requestChangeTaskSubmission}>
                        Request changes
                      </CreateFormCancelButton>
                    )}
                    {!submission.approvedAt && fetchedTask?.type === TASK_TYPE && (
                      <CreateFormPreviewButton onClick={approveSubmission}>Approve</CreateFormPreviewButton>
                    )}
                    {!submission.approvedAt && fetchedTask?.type === BOUNTY_TYPE && (
                      <CreateFormPreviewButton onClick={approveBountySubmission}>Approve</CreateFormPreviewButton>
                    )}
                  </CreateFormButtonsBlock>
                </>
              )}
              {fetchedTask?.type === BOUNTY_TYPE &&
                submission.approvedAt &&
                (submission?.paymentStatus !== PAYMENT_STATUS.PAID ||
                  submission?.paymentStatus !== PAYMENT_STATUS.PROCESSING) && (
                  <PaymentButton
                    fetchedTask={fetchedTask}
                    taskSubmissions={fetchedTaskSubmissions}
                    handleClose={handleClose}
                    getTaskSubmissionsForTask={getTaskSubmissionsForTask}
                    submission={submission}
                  />
                )}
            </CreateFormFooterButtons>
          </>
        )}
      </TaskSubmissionItemDiv>
    </>
  );
};

const TaskSubmissionForm = (props) => {
  const { setFetchedTaskSubmissions, cancelSubmissionForm, fetchedTaskSubmissions, orgId, taskId, submissionToEdit } =
    props;
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const boardColumns = useColumns();
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const board = orgBoard || podBoard || userBoard;
  const [mediaUploads, setMediaUploads] = useState(transformMediaFormat(submissionToEdit?.media) || []);
  const [descriptionText, setDescriptionText] = useState(submissionToEdit?.description || '');
  const [link, setLink] = useState((submissionToEdit?.links && submissionToEdit?.links[0]?.url) || '');
  const isValidIndex = (index) => {
    if (index >= 0) return index;
    return false;
  };
  const [createTaskSubmission] = useMutation(CREATE_TASK_SUBMISSION, {
    onCompleted: (data) => {
      const taskSubmission = data?.createTaskSubmission;
      const transformedTaskSubmission = transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {});
      setFetchedTaskSubmissions([transformedTaskSubmission, ...fetchedTaskSubmissions]);
      if (boardColumns && (!board?.entityType || board?.entityType !== ENTITIES_TYPES.BOUNTY)) {
        const columns = boardColumns?.columns;
        let newColumns = [...columns];

        const inProgressColumnIndex =
          isValidIndex(newColumns.findIndex((column) => column.status === TASK_STATUS_IN_PROGRESS)) ||
          isValidIndex(newColumns.findIndex((column) => column.section?.filter?.taskType === TASK_STATUS_IN_PROGRESS));

        const inProgressColumn = newColumns[inProgressColumnIndex];

        const taskSubmissionTask = inProgressColumn?.tasks.find((element) => element?.id === taskSubmission?.taskId);
        newColumns = addInReviewItem(
          {
            ...taskSubmissionTask,
            status: TASK_STATUS_IN_REVIEW,
          },
          columns
        );
        newColumns = removeInProgressTask(taskSubmissionTask?.id, columns);
        if (boardColumns?.setColumns) {
          boardColumns?.setColumns(newColumns);
        }
      }
      if (boardColumns && board?.entityType === ENTITIES_TYPES.BOUNTY) {
        const newColumns = board?.columns.map((col) =>
          col.id === transformedTaskSubmission.taskId
            ? {
                ...col,
                totalSubmissionsCount:
                  (Number.isInteger(col.totalSubmissionsCount) ? col.totalSubmissionsCount : 0) + 1,
              }
            : col
        );
        boardColumns?.setColumns(newColumns);
      }
      if (cancelSubmissionForm) {
        cancelSubmissionForm();
      }
    },
    refetchQueries: ['getPerStatusTaskCountForOrgBoard', 'getOrgTaskBoardTasks', 'getPodTaskBoardTasks'],
  });
  const [updateTaskSubmission] = useMutation(UPDATE_TASK_SUBMISSION, {
    onCompleted: (data) => {
      const taskSubmission = data?.updateTaskSubmission;
      const transformedTaskSubmission = transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {});
      const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((fetchedTaskSubmission) => {
        if (taskSubmission?.id === fetchedTaskSubmission?.id) {
          return transformedTaskSubmission;
        }
        return fetchedTaskSubmission;
      });
      setFetchedTaskSubmissions(newFetchedTaskSubmissions);
      if (cancelSubmissionForm) {
        cancelSubmissionForm();
      }
    },
  });
  const [attachTaskSubmissionMedia] = useMutation(ATTACH_SUBMISSION_MEDIA);
  const [removeTaskSubmissionMedia] = useMutation(REMOVE_SUBMISSION_MEDIA);
  const { data: orgUsersData } = useQuery(GET_ORG_USERS, {
    variables: {
      orgId,
    },
  });

  const inputRef: any = useRef();
  const handleSubmit = () => {
    if (submissionToEdit) {
      updateTaskSubmission({
        variables: {
          submissionId: submissionToEdit?.id,
          input: {
            description: descriptionText,
            links: [
              {
                url: link,
                displayName: link,
              },
            ],
          },
        },
      });
    } else {
      createTaskSubmission({
        variables: {
          input: {
            taskId,
            description: descriptionText,
            links: [
              {
                url: link,
                displayName: link,
              },
            ],
            mediaUploads,
          },
        },
      });
    }
  };
  const handleInputOnChange = async (event) => {
    setFileUploadLoading(true);
    const fileToAdd = await handleAddFile({
      event,
      filePrefix: 'tmp/task/new/',
      mediaUploads,
      setMediaUploads: () => {},
    });
    if (submissionToEdit) {
      attachTaskSubmissionMedia({
        variables: {
          submissionId: submissionToEdit?.id,
          input: {
            mediaUploads: [fileToAdd],
          },
        },
        onCompleted: (data) => {
          const taskSubmission = data?.attachTaskSubmissionMedia;
          setMediaUploads(transformMediaFormat(taskSubmission?.media));
          setFileUploadLoading(false);
          const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((fetchedTaskSubmission) => {
            if (fetchedTaskSubmission?.id === submissionToEdit?.id) {
              const newTaskSubmission = {
                ...fetchedTaskSubmission,
                media: taskSubmission?.media,
              };
              return newTaskSubmission;
            }
          });
          setFetchedTaskSubmissions(newFetchedTaskSubmissions);
        },
      });
    } else {
      setMediaUploads([...mediaUploads, fileToAdd]);
      setFileUploadLoading(false);
    }
  };
  const handleRemoveItem = (mediaItem) => {
    removeTaskSubmissionMedia({
      variables: {
        submissionId: submissionToEdit?.id,
        slug: mediaItem?.uploadSlug,
      },
      onCompleted: () => {
        const newFetchedTaskSubmissions = fetchedTaskSubmissions.map((fetchedTaskSubmission) => {
          if (fetchedTaskSubmission?.id === submissionToEdit?.id) {
            const newMedia = mediaUploads.filter((mediaUpload) => {
              return mediaUpload?.uploadSlug !== mediaItem?.uploadSlug;
            });
            const newTaskSubmission = {
              ...fetchedTaskSubmission,
              media: newMedia,
            };
            return newTaskSubmission;
          }
        });
        setFetchedTaskSubmissions(newFetchedTaskSubmissions);
      },
    });
  };
  return (
    <SubmissionFormWrapper>
      <SubmissionFormBackButton onClick={cancelSubmissionForm}>
        <SubmissionFormBackIcon />
        <SubmissionFormBackText>Back</SubmissionFormBackText>
      </SubmissionFormBackButton>
      <SubmissionFormBorder />
      <SubmissionFormTitle>Make a submission</SubmissionFormTitle>
      <SubmissionFormDescription>
        <TextInputContext.Provider
          value={{
            content: descriptionText,
            onChange: (e) => setDescriptionText(e.target.value),
            list: filterOrgUsersForAutocomplete(orgUsersData?.getOrgUsers),
          }}
        >
          <TextInput
            placeholder="Enter description"
            style={{
              input: {
                overflow: 'auto',
                color: palette.white,
                height: '100px',
                marginBottom: '16px',
                borderRadius: '6px',
                padding: '8px',
              },
            }}
          />
        </TextInputContext.Provider>
      </SubmissionFormDescription>
      <SubmissionFormField>
        <SubmissionDisplayText>Link</SubmissionDisplayText>
        <SubmissionFormLink value={link} onChange={(e) => setLink(e.target.value)} placeholder="Enter link" />
      </SubmissionFormField>
      <SubmissionFormField>
        <SubmissionDisplayText>Files</SubmissionDisplayText>
        <SubmissionSection>
          {mediaUploads?.length > 0 ? (
            <MediaUploadDiv>
              {mediaUploads.map((mediaItem) => (
                <MediaItem
                  key={mediaItem?.uploadSlug}
                  mediaUploads={mediaUploads}
                  setMediaUploads={setMediaUploads}
                  mediaItem={mediaItem}
                  removeMediaItem={submissionToEdit ? handleRemoveItem(mediaItem) : null}
                />
              ))}
              <AddFileUpload
                onClick={() => {
                  inputRef.current.click();
                }}
                style={{
                  cursor: 'pointer',
                  width: '24',
                  height: '24',
                  marginBottom: '8px',
                }}
              />
              {fileUploadLoading && <FileLoading />}
            </MediaUploadDiv>
          ) : (
            <MultiMediaUploadButton onClick={() => inputRef.current.click()}>
              <UploadImageIcon
                style={{
                  width: '13',
                  height: '17',
                  marginRight: '8px',
                }}
              />
              <MultiMediaUploadButtonText>Upload file</MultiMediaUploadButtonText>
              {fileUploadLoading && <FileLoading />}
            </MultiMediaUploadButton>
          )}
          <input type="file" hidden ref={inputRef} onChange={handleInputOnChange} />
        </SubmissionSection>
      </SubmissionFormField>
      <SubmissionFormBorder />
      <SubmissionFormButtonWrapper>
        <SubmissionFormCancel onClick={cancelSubmissionForm}>Cancel</SubmissionFormCancel>
        <SubmissionFormSubmit onClick={handleSubmit}>
          {submissionToEdit ? 'Submit edits' : 'Submit for approval'}
        </SubmissionFormSubmit>
      </SubmissionFormButtonWrapper>
    </SubmissionFormWrapper>
  );
};

const SubmissionButtonWrapper = ({ onClick = null, buttonText = null, helperText = '' }) => {
  return (
    <SubmissionButtonWrapperGradient>
      <SubmissionButtonWrapperBackground>
        {buttonText && <SubmissionButtonCreate onClick={onClick}>{buttonText}</SubmissionButtonCreate>}
        {helperText && <SubmissionButtonTextHelper>{helperText}</SubmissionButtonTextHelper>}
      </SubmissionButtonWrapperBackground>
    </SubmissionButtonWrapperGradient>
  );
};

export const TaskSubmissionContent = (props) => {
  const {
    taskSubmissionLoading,
    canSubmit,
    fetchedTask,
    setFetchedTask,
    updateTaskStatus,
    fetchedTaskSubmissions,
    board,
    boardColumns,
    canMoveProgress,
    canReview,
    setMakeSubmission,
    makeSubmission,
    orgId,
    setFetchedTaskSubmissions,
    handleClose,
    setShowPaymentModal,
    getTaskSubmissionsForTask,
    isBounty,
  } = props;

  const router = useRouter();
  const [submissionToEdit, setSubmissionToEdit] = useState(null);
  const [moveProgressButton, setMoveProgressButton] = useState(true);
  const taskStatus = fetchedTask?.status;
  const fetchedTaskSubmissionsLength = fetchedTaskSubmissions?.length;
  const loggedInUser = useMe();

  const handleTaskProgressStatus = () => {
    setMoveProgressButton(false);
    router.push(`${delQuery(router.asPath)}`, undefined, {
      shallow: true,
    });
    handleClose();
    updateTaskStatus({
      variables: {
        taskId: fetchedTask?.id,
        input: {
          newStatus: TASK_STATUS_IN_PROGRESS,
        },
      },
      onCompleted: (data) => {
        const task = data?.updateTaskStatus;
        handleClose();
        if (boardColumns?.setColumns) {
          const transformedTask = transformTaskToTaskCard(task, {});
          if (board?.entityType && board?.entityType === ENTITIES_TYPES.BOUNTY) {
            const newColumns = boardColumns?.columns.map((col) =>
              col.id === transformedTask.id ? transformedTask : col
            );
            boardColumns?.setColumns(newColumns);
            return;
          }
          const columns = [...boardColumns?.columns];
          columns[0].tasks = columns[0].tasks.filter((existingTask) => {
            if (transformedTask?.id !== existingTask?.id) {
              return true;
            }
            return false;
          });
          columns[1].tasks = [transformedTask, ...columns[1].tasks];
          boardColumns?.setColumns(columns);
        }
      },
    });
  };

  const loadingComponent = {
    condition: taskSubmissionLoading,
    component: <CircularProgress />,
  };
  const moveToProgressComponent = {
    condition:
      (canSubmit || canMoveProgress) && fetchedTask?.status === TASK_STATUS_TODO && moveProgressButton && !isBounty,
    component: (
      <SubmissionButtonWrapper
        onClick={handleTaskProgressStatus}
        buttonText="Set Status to In-Progress"
        helperText="In order to submit, set this task to In-Progress."
      />
    ),
  };
  const notAssignedComponent = {
    condition: !canSubmit && fetchedTaskSubmissionsLength === 0 && fetchedTask?.assigneeUsername,
    component: (
      <SubmissionButtonWrapper
        helperText={`None at the moment. Only @${fetchedTask?.assigneeUsername} can create a submission `}
      />
    ),
  };
  const canMakeSubmissionComponent = {
    condition: canSubmit && fetchedTaskSubmissionsLength === 0 && fetchedTask?.status !== TASK_STATUS_DONE,
    component: (
      <>
        {makeSubmission ? (
          <TaskSubmissionForm
            setFetchedTaskSubmissions={setFetchedTaskSubmissions}
            cancelSubmissionForm={() => setMakeSubmission(false)}
            fetchedTaskSubmissions={fetchedTaskSubmissions}
            orgId={orgId}
            taskId={fetchedTask?.id}
          />
        ) : (
          <SubmissionButtonWrapper onClick={setMakeSubmission} buttonText="Make a submission" />
        )}
      </>
    ),
  };
  const makeSubmissionAndEditComponent = {
    condition: makeSubmission && submissionToEdit,
    component: (
      <TaskSubmissionForm
        setFetchedTaskSubmissions={setFetchedTaskSubmissions}
        isEdit={true}
        cancelSubmissionForm={() => {
          setMakeSubmission(false);
          setSubmissionToEdit(null);
        }}
        fetchedTaskSubmissions={fetchedTaskSubmissions}
        orgId={orgId}
        taskId={fetchedTask?.id}
        submissionToEdit={submissionToEdit}
      />
    ),
  };
  const withSubmissionsComponent = {
    condition: fetchedTaskSubmissionsLength > 0,
    component: (
      <>
        {makeSubmission ? (
          <TaskSubmissionForm
            setFetchedTaskSubmissions={setFetchedTaskSubmissions}
            cancelSubmissionForm={() => setMakeSubmission(false)}
            fetchedTaskSubmissions={fetchedTaskSubmissions}
            orgId={orgId}
            taskId={fetchedTask?.id}
          />
        ) : (
          <>
            {taskStatus !== TASK_STATUS_DONE && taskStatus !== TASK_STATUS_ARCHIVED && (
              <SubmissionButtonWrapper onClick={setMakeSubmission} buttonText="Make a submission" />
            )}
            {taskStatus === TASK_STATUS_DONE && fetchedTask?.type === ENTITIES_TYPES.TASK && (
              <MakePaymentBlock
                fetchedTask={fetchedTask}
                setShowPaymentModal={setShowPaymentModal}
                taskSubmissions={fetchedTaskSubmissions}
              />
            )}
            {fetchedTaskSubmissions?.map((taskSubmission) => {
              return (
                <SubmissionItem
                  setMakeSubmission={setMakeSubmission}
                  setSubmissionToEdit={setSubmissionToEdit}
                  key={taskSubmission?.id}
                  canReview={canReview}
                  fetchedTask={fetchedTask}
                  setFetchedTask={setFetchedTask}
                  handleClose={handleClose}
                  setFetchedTaskSubmissions={setFetchedTaskSubmissions}
                  fetchedTaskSubmissions={fetchedTaskSubmissions}
                  submission={transformTaskSubmissionToTaskSubmissionCard(taskSubmission, {})}
                  user={loggedInUser}
                  setShowPaymentModal={setShowPaymentModal}
                  getTaskSubmissionsForTask={getTaskSubmissionsForTask}
                />
              );
            })}
          </>
        )}
      </>
    ),
  };

  if (loadingComponent.condition) return loadingComponent.component;
  if (moveToProgressComponent.condition) return moveToProgressComponent.component;
  if (notAssignedComponent.condition) return notAssignedComponent.component;
  if (canMakeSubmissionComponent.condition) return canMakeSubmissionComponent.component;
  if (makeSubmissionAndEditComponent.condition) return makeSubmissionAndEditComponent.component;
  if (withSubmissionsComponent.condition) return withSubmissionsComponent.component;
  return null;
};
