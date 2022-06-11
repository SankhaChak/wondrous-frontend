import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

import CloseModalIcon from 'components/Icons/closeModal';
import styles, {
  DeleteButton,
  CancelButton,
  SubmitButton,
  SubmitButtonWrap,
  CategoryHeader,
  CategoryRow,
  InterestButton,
  StyledDialogContent,
} from './styles';
import { useState } from 'react';
import { CreateFormCancelButton, CreateFormPreviewButton } from 'components/CreateEntity/styles';
const designCategories = [
  {
    display: '✒️ Graphic Design',
    value: 'graphic_design',
  },
  {
    display: '📱 UI/UX Designer',
    value: 'ui_ux_designer',
  },
  {
    display: '✍️ Writer',
    value: 'writer',
  },
  {
    display: '🔨 Product',
    value: 'product',
  },
];

const growthCategories = [
  {
    display: '🌱 Growth Marketing',
    value: 'growth_marketing',
  },
  {
    display: '🤳 Social Media',
    value: 'social_media',
  },
  {
    display: '🎬 Content Creation',
    value: 'content_creation',
  },
  {
    display: '🎥 Videographer',
    value: 'videographer',
  },
  {
    display: '💀 Memes',
    value: 'memes',
  },
  {
    display: '🔎 SEO',
    value: 'seo',
  },
  {
    display: '📰 Blogs',
    value: 'blogs',
  },
];

const communityCategories = [
  {
    display: '💖 Community Management',
    value: 'community_management',
  },
  {
    display: '📚 Education',
    value: 'education',
  },
  {
    display: '🗣️ Translations',
    value: 'translation',
  },
  {
    display: '💰 Treasury Management',
    value: 'treasury_management',
  },
];

const artCategories = [
  {
    display: '🖼️ NFTs',
    value: 'nfts',
  },
  {
    display: '🎶 Music NFT',
    value: 'music_nft',
  },
  {
    display: '📸 Photography',
    value: 'photography',
  },
];

const web3Categories = [
  {
    display: '🌍 DAO Operations',
    value: 'dao_operations',
  },
  {
    display: '🤝 Onboarding Users',
    value: 'onboarding_users',
  },
  {
    display: '🏛️ Governance',
    value: 'governance',
  },
];

const engineeringCategories = [
  {
    display: '💻 Devops',
    value: 'dev_ops',
  },
  {
    display: '💻 Frontend',
    value: 'frontend',
  },
  {
    display: '💻 Backend',
    value: 'backend',
  },
  {
    display: '🌐 Blockchain',
    value: 'blockhain',
  },
  {
    display: '📊 Data Science',
    value: 'data_science',
  },
];
export const UserInterestModal = ({ open, onClose }) => {
  const [interests, setInterests] = useState({});
  const saveUnsaveInterest = (interest) => {
    if (interest in interests) {
      delete interests[interest];
      const newObj = { ...interests };
      setInterests(newObj);
    } else {
      interests[interest] = true;
      const newObj = { ...interests };
      setInterests(newObj);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: styles.backgroundPaper,
      }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        Select your interests
        <Box flex={1} />
        <IconButton onClick={onClose} style={styles.closeButton}>
          <CloseModalIcon style={styles.closeButtonIcon} />
        </IconButton>
      </DialogTitle>
      <StyledDialogContent>
        <CategoryHeader>Design</CategoryHeader>
        <CategoryRow>
          {designCategories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest.value}
            >
              {interest?.display}
            </InterestButton>
          ))}
        </CategoryRow>
        <CategoryHeader>Growth</CategoryHeader>
        <CategoryRow>
          {growthCategories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest.value}
            >
              {interest?.display}
            </InterestButton>
          ))}
        </CategoryRow>
        <CategoryHeader>Community</CategoryHeader>
        <CategoryRow>
          {communityCategories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest}
            >
              {interest.display}
            </InterestButton>
          ))}
        </CategoryRow>
        <CategoryHeader>Art</CategoryHeader>
        <CategoryRow>
          {artCategories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest}
            >
              {interest.display}
            </InterestButton>
          ))}
        </CategoryRow>
        <CategoryHeader>Web3</CategoryHeader>
        <CategoryRow>
          {web3Categories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest}
            >
              {interest.display}
            </InterestButton>
          ))}
        </CategoryRow>
        <CategoryHeader>Engineering</CategoryHeader>
        <CategoryRow>
          {engineeringCategories.map((interest) => (
            <InterestButton
              style={{
                background: interest.value in interests ? '#7427FF' : '#232323',
              }}
              onClick={() => saveUnsaveInterest(interest.value)}
              key={interest}
            >
              {interest.display}
            </InterestButton>
          ))}
        </CategoryRow>
      </StyledDialogContent>
      <DialogActions>
        <CreateFormCancelButton>Cancel</CreateFormCancelButton>
        <CreateFormPreviewButton>Save</CreateFormPreviewButton>
      </DialogActions>
    </Dialog>
  );
};
