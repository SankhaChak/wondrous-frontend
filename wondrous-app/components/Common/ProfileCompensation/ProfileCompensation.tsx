import { SafeImage } from '../Image';
import { CompensationWrapper, IconContainer, CompensationPill } from './styles';

const ProfileCompensation = ({ rewards, taskIcon, style, pillStyle = {} }) => {
  const { icon, rewardAmount, symbol } = rewards[0] || {};

  return (
    <CompensationWrapper style={style}>
      <CompensationPill style={pillStyle}>
        {rewardAmount && (
          <>
            {icon && (
              <IconContainer>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <SafeImage
                  src={icon}
                  style={{
                    width: 24,
                    height: 24
                  }}
                />
              </IconContainer>
            )}
            <p style={{ color: 'white' }}>
              {rewardAmount} {icon ? null : symbol}
            </p>
          </>
        )}
        {taskIcon ? taskIcon : null}
      </CompensationPill>
    </CompensationWrapper>
  );
};

export default ProfileCompensation;
