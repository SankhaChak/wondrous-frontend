import { ButtonBase, InputBase, Typography } from '@mui/material';
import LeftArrowIcon from 'components/Icons/leftArrow';
import styled from 'styled-components';
import { Button } from '../button';
import { GradientHighlightHorizontal } from '../gradients';

export const SubmissionButtonWrapperGradient = styled.div`
  background: linear-gradient(94.19deg, #7427ff 10.13%, #232323 131.81%);
  width: 100%;
  padding: 1px;
  border-radius: 6px;
`;

export const SubmissionButtonWrapperBackground = styled.div`
  background: #171717;
  width: 100%;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 14px;
`;

export const SubmissionButtonCreate = styled(Button)`
  && {
    ${GradientHighlightHorizontal}
    height: 30px;
    width: fit-content;
    > button {
      font-family: 'Space Grotesk';
      ${({ theme }) => `
        font-weight: ${theme.typography.fontWeightMedium};
        background: ${theme.palette.black}
  `}
    }
  }
`;

export const SubmissionButtonTextHelper = styled(Typography)`
  && {
    font-size: 14px;
    text-align: center;
    ${({ theme }) => `
      font-weight: ${theme.typography.fontWeightMedium};
      color: ${theme.palette.grey250}
      `}
  }
`;

export const SubmissionFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 18px;
`;

export const SubmissionFormBackButton = styled(ButtonBase)`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 32px;
  align-self: flex-start;
`;

export const SubmissionFormBackIcon = styled((props) => (
  <div {...props}>
    <LeftArrowIcon />
  </div>
))`
  background: #1d1d1d;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
`;

export const SubmissionFormBackText = styled(Typography)`
  && {
    font-size: 12px;
    ${({ theme }) => `
      color: ${theme.palette.white};
      font-weight: ${theme.typography.fontWeightMedium}
    `}
  }
`;

export const SubmissionFormBorder = styled.div`
  height: 1px;
  border-bottom: 1px dashed ${({ theme }) => theme.palette.grey75};
  width: 100%;
`;

export const SubmissionFormTitle = styled(Typography)`
  && {
    font-size: 18px;
    ${({ theme }) => `
      color: ${theme.palette.white};
      font-weight: ${theme.typography.fontWeightMedium}
    `}
  }
`;

export const SubmissionFormDescription = styled.div`
  height: 100px;
  position: relative;
  & textarea[style] {
    background: #1b1b1b !important;
  }
`;

export const SubmissionFormLink = styled(InputBase)`
  border-radius: 6px;
  width: 100%;
  font-size: 14px;
  padding: 8px;
  height: 42px;
  ${({ theme }) => `
    color: ${theme.palette.white};
    background: #1b1b1b;
  `}
  .MuiInputBase-input {
    padding: 0;
  }
`;

export const SubmissionFormButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  align-self: flex-end;
`;

export const SubmissionFormCancel = styled(ButtonBase)`
  height: 34px;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 30px;
  border-radius: 50px;
  font-family: 'Space Grotesk';
  font-size: 15px;
  ${({ theme }) => `
    background-color: ${theme.palette.black92};
    color: ${theme.palette.white};
    font-weight: ${theme.typography.fontWeightMedium};
  `};
`;

export const SubmissionFormSubmit = styled(Button)`
  && {
    ${GradientHighlightHorizontal}
    height: 34px;
    width: fit-content;
    min-height: 0;
    font-size: 15px;
    > button {
      font-family: 'Space Grotesk';
      font-size: 15px;
      ${({ theme }) => `
        font-weight: ${theme.typography.fontWeightMedium};
        background: ${theme.palette.black}
  `}
    }
  }
`;

export const TaskDescription = styled.p`
  color: #c4c4c4;
`;

export const TaskSectionDisplayDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskSectionDisplayLabel = styled.div`
  display: flex;
  align-items: center;
  min-width: 120px;
`;

export const SubmissionFormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SubmissionDisplayText = styled(Typography)`
  && {
    font-size: 14px;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.palette.blue20};
 `}
  }
`;

export const TaskSectionInfoText = styled(SubmissionDisplayText)`
  && {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    ${({ theme }) => `
    color: ${theme.palette.white};
 `}
  }
`;

export const SubmissionSection = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskModalFooter = styled.div`
  margin-top: 16px;
`;

export const TaskSectionFooterTitleDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskSubmissionTab = styled.div`
  flex: 1;
  margin-right: 16px;
  text-align: center;
  padding-bottom: 8px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  border-bottom: ${(props) => `2px solid ${props.isActive ? '#7427FF' : '#4B4B4B'}`};
`;

export const TaskSectionContent = styled.div`
  text-align: center;
  padding-top: 16px;
  padding-bottom: 20px;
  max-width: 630px;
`;
export const MakeSubmissionDiv = styled.div`
  background: #0f0f0f;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
`;

export const TaskSubmissionItemDiv = styled.div`
  padding: 30px;
  &:not(:last-child) {
    border-bottom: 1px solid #363636;
  }

  & > :last-child {
    margin-bottom: 32px;
  }
`;

export const TaskSubmissionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const TaskSubmissionHeaderTextDiv = styled.div``;

export const TaskSubmissionHeaderCreatorText = styled(Typography)`
  && {
    color: ${({ theme }) => theme.palette.white};
    font-size: 13px;
    line-height: 20px;
    font-weight: bold;
    margin-right: 8px;
  }
`;
export const TaskSubmissionHeaderTimeText = styled(Typography)`
  && {
    color: #828282;
    font-size: 13px;
    line-height: 20px;
  }
`;

export const TaskStatusHeaderText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 14px;
  }
`;

export const TaskLink = styled.a`
  && {
    color: #00baff;
    font-size: 14px;
    font-family: Space Grotesk;
  }
`;

export const TaskSubmissionLink = styled(TaskLink)`
  && {
    margin-top: 8px;
    margin-right: 8px;
    max-width: 500px;
    overflow-x: scroll;
    text-align: left;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`;

export const TaskMediaContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-left: 28px;
`;

export const TaskDescriptionText = styled(Typography)`
  && {
    font-size: 15px;
    line-height: 24px;
    margin-top: 12px;
    overflow: hidden;
    position: relative;
    width: 100%;
    ${(props) => {
      const { isExpanded, initialHeight, theme } = props;
      return `
      font-weight: ${theme.typography.fontWeightRegular};
      height: ${isExpanded ? 'fit-content' : `${initialHeight}px`};
      color: #828282;
    ${
      !isExpanded &&
      `
      :after {
      background-image: linear-gradient(to bottom, rgba(29, 29, 29, 0.3), rgba(29, 29, 29, 1) 90%);
      bottom: 0;
      content: '';
      height: 50%;
      left: 0;
      pointer-events: none;
      position: absolute;
      width: 100%;
      z-index: 1;
    }
      `
    }
  `;
    }}
  }
`;
