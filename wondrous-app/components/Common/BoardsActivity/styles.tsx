import styled from 'styled-components';

export const BoardsActivityWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  margin-top: 22px;
  & > div {
    margin-left: 18px;
    :first-child {
      margin: 0;
    }
  }
`;

export const BoardsActivityInlineViewWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 18px;
  height: 34px;
`;
