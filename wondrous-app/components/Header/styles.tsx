import { AppBar, IconButton, TextField } from '@mui/material';
import styled from 'styled-components';
import { Button } from '../Common/button';
import { Logo } from '../Common/ci';

export const Header = styled(AppBar)`
  && {
    height: 70px;
    background: #1d1d1d;
    display: flex;
    align-items: center;
    //padding: 15px 20px;
    //display: flex;
    //justify-content: space-between;
    //align-items: center;
    z-index: 200;
  }
`;

export const HeaderContainer = styled.div`
  //max-width: 1388px;
  padding: 15px 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
`;

export const HeaderLeftBlock = styled.div`
  max-width: 440px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5%;
`;

export const HeaderLogoWrapper = styled.button`
  position: relative;
  display: flex;
  border: 0;
  background: transparent;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    background: none;
    filter: blur(20px);
    border-radius: 100%;
    left: 0;
    top: 0;
  }

  &:hover {
    cursor: pointer;
    &::before {
      background: linear-gradient(180deg, #ccbbff 0%, #7427ff 47.4%, #00baff 100%);
    }
  }
`;
export const HeaderLogo = styled(Logo)`
  width: 41px;
  height: 31px;
  path {
    fill: white;
  }
  :hover {
    cursor: pointer;
    #path-a {
      fill: url(#a);
    }
    #path-b {
      fill: url(#b);
    }
    #path-c {
      fill: url(#c);
    }
  }
`;

export const HeaderHomeButton = styled(IconButton)`
  && {
    background: #0f0f0f;
    border-radius: 4px;
    width: 40px;
    height: 40px;
    z-index: 100;

    &:hover {
      svg {
        path {
          stroke: url(#paint0_linear_11401_251635);
        }
      }
      background: #0f0f0f;
    }
  }
`;

export const HeaderHomeButtonWrapper = styled.div`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    background: none;
    filter: blur(8px);
  }
  &:hover {
    &::before {
      background: linear-gradient(46.92deg, #b820ff 8.72%, #ffffff 115.55%);
    }
  }
`;

export const HeaderInput = styled(TextField)({
  '&.MuiTextField-root': {
    width: 310,
    maxWidth: '100%',
    height: 40,
    backgroundColor: '#0F0F0F',
    borderRadius: 6,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  '& .MuiInputBase-input': {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: '0.01em',
    color: '#C4C4C4',
  },
  '& .MuiInput-underline:after': {
    borderBottom: '2px solid violet',
  },
});

export const HeaderRightBlock = styled.div`
  max-width: 480px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const StyledBadge = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 100;
  svg {
    circle {
      display: ${({ hasUnreadNotifications }) => (hasUnreadNotifications ? 'block' : 'none')};
      ${({ isOpen }) => {
        return isOpen ? `fill: url(#open-notif-gradient);` : ``;
      }};
    }
    rect {
      ${({ isOpen }) => (isOpen ? `stroke: url(#open-notif-gradient); fill: transparent;` : ``)}
    }
  }
  &:hover {
    svg {
      circle {
        fill: url(#outline-hover-color);
      }
      rect {
        stroke: url(#outline-hover-color);
        fill: black;
      }
    }
  }
`;

export const HeaderCreateButton = styled.button`
  visibility: ${({ visibility }) => (visibility ? 'visible' : 'hidden')};
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  background: transparent;
  border: 0;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -1;
    background: none;
    filter: blur(8px);
    border-radius: 100%;
    left: 0;
    top: 0;
  }
  &:hover {
    cursor: pointer;
    &::before {
      background: linear-gradient(
        212.53deg,
        #ff6dd7 -79.63%,
        #b820ff -41.63%,
        #f93701 -9.97%,
        #ffd653 22.6%,
        #00baff 56.07%,
        #06ffa5 85.93%
      );
    }
  }
`;

export const TutorialButton = styled(Button)`
  && {
    min-height: 40px;
    margin-right: 16px;
    width: 160px;
  }
`;

export const TutorialText = styled.span`
  font-family: Space Grotesk;
`;
